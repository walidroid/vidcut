const fs = require('fs');
const path = require('path');
const { performance } = require('perf_hooks');

async function runBenchmark() {
  console.log('=== VidCut Performance Baseline Benchmark ===\n');

  // 1. Bundle Size Measurement
  const distDir = path.resolve('dist');
  let totalJsSize = 0;
  let mainJsSize = 0;
  let mainJsName = '';

  const jsDir = path.join(distDir, 'homeAssets', 'js');
  if (fs.existsSync(jsDir)) {
    const files = fs.readdirSync(jsDir);
    for (const file of files) {
      if (file.endsWith('.js')) {
        const stats = fs.statSync(path.join(jsDir, file));
        totalJsSize += stats.size;
        if (file.startsWith('main-')) {
          mainJsSize = stats.size;
          mainJsName = file;
        }
      }
    }
  }

  console.log(`[1] Bundle Size:`);
  console.log(`    Main Entry Bundle: ${mainJsName} (${(mainJsSize / 1024 / 1024).toFixed(2)} MB / ${mainJsSize} bytes)`);
  console.log(`    Total JS Size: ${(totalJsSize / 1024 / 1024).toFixed(2)} MB`);

  // 2. Synthetic Audio Peak & Waveform Computation Benchmark
  console.log('\n[2] Audio Waveform Computation Benchmark:');
  const sampleRates = [44100, 48000];
  const durations = [10, 60, 180]; // 10s, 1min, 3min audio

  for (const duration of durations) {
    const sampleRate = 44100;
    const totalSamples = sampleRate * duration;
    const mockChannelData = new Float32Array(totalSamples);
    // Fill with synthetic audio wave
    for (let i = 0; i < totalSamples; i++) {
      mockChannelData[i] = Math.sin(i * 0.05) * Math.cos(i * 0.01) * Math.random();
    }

    const t0 = performance.now();
    // Simulate current _getPeaks algorithm in audioWaveFormSvgPath.js
    const peaksCount = duration * 50;
    const sampleSize = totalSamples / peaksCount;
    const sampleStep = Math.max(1, Math.floor(sampleSize / 10));
    const mergedPeaks = [];

    for (let peakNumber = 0; peakNumber < peaksCount; peakNumber++) {
      const start = Math.floor(peakNumber * sampleSize);
      const end = Math.floor(start + sampleSize);
      let min = mockChannelData[0];
      let max = mockChannelData[0];

      for (let sampleIndex = start; sampleIndex < end; sampleIndex += sampleStep) {
        const val = mockChannelData[sampleIndex];
        if (val > max) max = val;
        if (val < min) min = val;
      }
      mergedPeaks[2 * peakNumber] = max;
      mergedPeaks[2 * peakNumber + 1] = min;
    }
    const t1 = performance.now();

    // Measure distribution / downsampling algorithm (distributeNumbers)
    const t2 = performance.now();
    const needNum = Math.ceil(duration * 50); // standard width
    const chunkSize = Math.max(1, Math.floor(mergedPeaks.length / needNum));
    const distributed = [];
    for (let i = 0; i < mergedPeaks.length; i += chunkSize) {
      distributed.push(mergedPeaks.slice(i, i + chunkSize));
    }
    const t3 = performance.now();

    console.log(`    Duration ${duration}s (${totalSamples} samples):`);
    console.log(`      - Peak extraction: ${(t1 - t0).toFixed(2)} ms`);
    console.log(`      - Distribute/resample: ${(t3 - t2).toFixed(2)} ms`);
    console.log(`      - Total waveform processing: ${(t1 - t0 + t3 - t2).toFixed(2)} ms`);
  }

  // 3. Sequential vs Parallel Hydration Simulation Benchmark
  console.log('\n[3] Project Resource Hydration Benchmark:');
  const resourceCounts = [10, 30, 60];
  for (const count of resourceCounts) {
    // Simulate sequential hydration
    const mockFetch = async () => {
      await new Promise(r => setTimeout(r, 5)); // 5ms simulated file read
    };

    const seqStart = performance.now();
    for (let i = 0; i < count; i++) {
      await mockFetch();
    }
    const seqEnd = performance.now();

    // Simulate parallel hydration with concurrency limit (8)
    const parStart = performance.now();
    const pool = [];
    for (let i = 0; i < count; i++) {
      const task = mockFetch();
      pool.push(task);
      if (pool.length >= 8) {
        await Promise.race(pool);
        // remove finished
      }
    }
    await Promise.all(pool);
    const parEnd = performance.now();

    console.log(`    ${count} resources:`);
    console.log(`      - Sequential: ${(seqEnd - seqStart).toFixed(2)} ms`);
    console.log(`      - Parallel (pool of 8): ${(parEnd - parStart).toFixed(2)} ms`);
    console.log(`      - Speedup: ${( (seqEnd - seqStart) / (parEnd - parStart) ).toFixed(2)}x`);
  }

  // 4. Memory Footprint
  const mem = process.memoryUsage();
  console.log('\n[4] Node Process Memory Baseline:');
  console.log(`    Heap Used: ${(mem.heapUsed / 1024 / 1024).toFixed(2)} MB`);
  console.log(`    Heap Total: ${(mem.heapTotal / 1024 / 1024).toFixed(2)} MB`);
  console.log(`    RSS: ${(mem.rss / 1024 / 1024).toFixed(2)} MB`);
}

runBenchmark().catch(console.error);

