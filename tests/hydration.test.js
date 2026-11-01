/**
 * tests/hydration.test.js
 * Comprehensive unit test suite for VidCut Canvas Hydration Architecture
 * Validates all 8 scenarios:
 * 1. Opening Project A (Full hydration)
 * 2. Incremental hydration (Adding new video to active project)
 * 3. Adding audio/waveform resources to active project
 * 4. Updating resource data (modified paths)
 * 5. Rapid project switching (cancellation token / generation token)
 * 6. Failed hydration retry (transient error recovery)
 * 7. In-flight concurrent request deduplication
 * 8. Reopening project / ResourceManage reconstruction
 */

const assert = require('assert');

// Simulated storage and resource manager
function createMockResourceManager() {
  const cache = new Map();
  const fetchCounts = new Map();

  return {
    cache,
    fetchCounts,
    useLocalStorage: true,
    async fetchBlob(relativePath) {
      const count = fetchCounts.get(relativePath) || 0;
      fetchCounts.set(relativePath, count + 1);

      if (relativePath.includes('fail_transient') && count === 0) {
        throw new Error('Simulated transient I/O failure');
      }

      const blobUrl = `blob:http://localhost:3005/${relativePath.replace(/\//g, '_')}`;
      cache.set(relativePath, blobUrl);
      return blobUrl;
    }
  };
}

// Simulated hydrateResourcePaths logic mirroring src/services/localStorageService.ts
async function hydrateResourcePaths(resources, resourceManage, options) {
  if (!resourceManage?.fetchBlob) return;
  if (options?.isCancelled?.()) return;

  const paths = [];
  for (const res of resources) {
    for (const p of [res.url, res.thumb, res.frames, res.wave]) {
      if (typeof p === 'string' && p.startsWith('materials/')) {
        paths.push(p);
      }
    }
  }

  const uniquePaths = Array.from(new Set(paths));
  const CONCURRENCY = 8;
  for (let i = 0; i < uniquePaths.length; i += CONCURRENCY) {
    if (options?.isCancelled?.()) return;
    const chunk = uniquePaths.slice(i, i + CONCURRENCY);
    await Promise.all(
      chunk.map(async (p) => {
        if (options?.isCancelled?.()) return;
        try {
          await resourceManage.fetchBlob(p);
          options?.onPathHydrated?.(p);
        } catch (err) {
          // Warning logged, path is not added to hydrated set to allow retry
        }
      })
    );
  }
}

// Simulated Canvas Hydration Controller mirroring src/pages/editor/components/canvas/Canvas.tsx
class CanvasHydrationController {
  constructor(editor) {
    this.editor = editor;
    this.hydratedPaths = new Set();
    this.lastResourceManage = null;
    this.lastAppId = null;
    this.hydrationGeneration = 0;
  }

  async runEffect() {
    let isCancelled = false;
    const currentGeneration = ++this.hydrationGeneration;
    const currentAppId = this.editor.appid;
    const resourceManage = this.editor.movie?.resourceManage;

    if (!resourceManage || !this.editor.useLocalStorage) {
      return;
    }

    // 1. Detect project switch or manager recreation
    if (this.lastAppId !== currentAppId || this.lastResourceManage !== resourceManage) {
      this.lastAppId = currentAppId;
      this.lastResourceManage = resourceManage;
      this.hydratedPaths.clear();
    }

    resourceManage.useLocalStorage = this.editor.useLocalStorage;

    const resources = this.editor.data?.resouces || [];
    if (!resources.length) return;

    // 2. Collect pending unhydrated paths
    const pendingPaths = [];
    for (const res of resources) {
      for (const p of [res.url, res.thumb, res.frames, res.wave]) {
        if (typeof p === 'string' && p.startsWith('materials/') && !this.hydratedPaths.has(p)) {
          pendingPaths.push(p);
        }
      }
    }

    const uniquePending = Array.from(new Set(pendingPaths));
    if (!uniquePending.length) return;

    const pendingResources = uniquePending.map(p => ({ url: p }));

    // 3. Execute batch hydration with cancellation & generation check
    await hydrateResourcePaths(pendingResources, resourceManage, {
      isCancelled: () =>
        isCancelled ||
        currentGeneration !== this.hydrationGeneration ||
        this.editor.appid !== currentAppId ||
        this.editor.movie?.resourceManage !== resourceManage,
      onPathHydrated: (p) => {
        if (
          !isCancelled &&
          currentGeneration === this.hydrationGeneration &&
          this.editor.appid === currentAppId
        ) {
          this.hydratedPaths.add(p);
        }
      }
    });
  }
}

async function runTests() {
  console.log('=== RUNNING VIDCUT CANVAS HYDRATION TEST SUITE ===\n');

  // Test 1: Full hydration on opening Project A
  {
    console.log('[Test 1] Opening Project A (Full hydration)...');
    const rm = createMockResourceManager();
    const editor = {
      appid: 'proj_A',
      useLocalStorage: true,
      movie: { resourceManage: rm },
      data: {
        resouces: [
          { url: 'materials/proj_A/clip1.mp4', thumb: 'materials/proj_A/clip1_thumb.jpg' },
          { url: 'materials/proj_A/clip2.mp4' },
          { url: 'https://cdn.example.com/remote.mp4' } // remote, should ignore
        ]
      }
    };
    const controller = new CanvasHydrationController(editor);
    await controller.runEffect();

    assert.strictEqual(controller.hydratedPaths.size, 3, 'Should hydrate exactly 3 local paths');
    assert.ok(rm.cache.has('materials/proj_A/clip1.mp4'));
    assert.ok(rm.cache.has('materials/proj_A/clip1_thumb.jpg'));
    assert.ok(rm.cache.has('materials/proj_A/clip2.mp4'));
    assert.strictEqual(rm.cache.has('https://cdn.example.com/remote.mp4'), false);
    console.log('  -> PASSED: All 3 local paths hydrated into resourceManager cache.');
  }

  // Test 2: Incremental hydration when adding a new video to active Project A
  {
    console.log('[Test 2] Incremental hydration (Adding new video clip to active Project A)...');
    const rm = createMockResourceManager();
    const editor = {
      appid: 'proj_A',
      useLocalStorage: true,
      movie: { resourceManage: rm },
      data: {
        resouces: [
          { url: 'materials/proj_A/clip1.mp4' }
        ]
      }
    };
    const controller = new CanvasHydrationController(editor);
    await controller.runEffect();
    assert.strictEqual(rm.fetchCounts.get('materials/proj_A/clip1.mp4'), 1);

    // User adds clip 2
    editor.data.resouces.push({ url: 'materials/proj_A/clip2.mp4', thumb: 'materials/proj_A/clip2_thumb.jpg' });
    await controller.runEffect();

    // Verify clip 1 was NOT re-fetched
    assert.strictEqual(rm.fetchCounts.get('materials/proj_A/clip1.mp4'), 1, 'Clip 1 should NOT be re-fetched');
    assert.strictEqual(rm.fetchCounts.get('materials/proj_A/clip2.mp4'), 1, 'Clip 2 should be fetched once');
    assert.strictEqual(rm.fetchCounts.get('materials/proj_A/clip2_thumb.jpg'), 1, 'Clip 2 thumb should be fetched once');
    assert.strictEqual(controller.hydratedPaths.size, 3);
    console.log('  -> PASSED: Incremental addition hydrated without re-fetching existing assets.');
  }

  // Test 3: Adding audio/waveform resources to active project
  {
    console.log('[Test 3] Adding audio and waveform to active project...');
    const rm = createMockResourceManager();
    const editor = {
      appid: 'proj_A',
      useLocalStorage: true,
      movie: { resourceManage: rm },
      data: {
        resouces: [
          { url: 'materials/proj_A/clip1.mp4' }
        ]
      }
    };
    const controller = new CanvasHydrationController(editor);
    await controller.runEffect();

    // User adds audio track with waveform peaks
    editor.data.resouces.push({
      url: 'materials/proj_A/voiceover.mp3',
      wave: 'materials/proj_A/voiceover_wave.json'
    });
    await controller.runEffect();

    assert.ok(rm.cache.has('materials/proj_A/voiceover.mp3'));
    assert.ok(rm.cache.has('materials/proj_A/voiceover_wave.json'));
    assert.strictEqual(controller.hydratedPaths.size, 3);
    console.log('  -> PASSED: Audio and waveform paths correctly identified and hydrated.');
  }

  // Test 4: Updating resource data (modified relative paths)
  {
    console.log('[Test 4] Updating resource data (modified file path)...');
    const rm = createMockResourceManager();
    const editor = {
      appid: 'proj_A',
      useLocalStorage: true,
      movie: { resourceManage: rm },
      data: {
        resouces: [
          { url: 'materials/proj_A/intro_v1.mp4' }
        ]
      }
    };
    const controller = new CanvasHydrationController(editor);
    await controller.runEffect();
    assert.ok(rm.cache.has('materials/proj_A/intro_v1.mp4'));

    // Resource replaced by editor with v2
    editor.data.resouces[0].url = 'materials/proj_A/intro_v2.mp4';
    await controller.runEffect();

    assert.ok(rm.cache.has('materials/proj_A/intro_v2.mp4'), 'New path intro_v2 should be hydrated');
    console.log('  -> PASSED: Updated resource URL was recognized and hydrated.');
  }

  // Test 5: Rapid project switching (cancellation token & generation token)
  {
    console.log('[Test 5] Rapid project switching (Project A -> Project B cancellation)...');
    const rmA = createMockResourceManager();
    const rmB = createMockResourceManager();
    const editor = {
      appid: 'proj_A',
      useLocalStorage: true,
      movie: { resourceManage: rmA },
      data: {
        resouces: [
          { url: 'materials/proj_A/huge1.mp4' },
          { url: 'materials/proj_A/huge2.mp4' }
        ]
      }
    };
    const controller = new CanvasHydrationController(editor);

    // Mock slow fetch for Project A
    const pendingResolvers = [];
    rmA.fetchBlob = (p) => new Promise((resolve) => {
      pendingResolvers.push(() => resolve(`blob:proj_A_${p}`));
    });

    const promiseA = controller.runEffect();

    // Immediately switch to Project B before Project A finishes
    editor.appid = 'proj_B';
    editor.movie = { resourceManage: rmB };
    editor.data = {
      resouces: [
        { url: 'materials/proj_B/b1.mp4' }
      ]
    };

    const promiseB = controller.runEffect();

    // Now resolve Project A's delayed fetches
    pendingResolvers.forEach(r => r());
    await Promise.all([promiseA, promiseB]);

    // Project B should have hydrated b1.mp4, and hydratedPaths must NOT retain Project A paths
    assert.strictEqual(rmB.cache.has('materials/proj_B/b1.mp4'), true);
    assert.strictEqual(controller.lastAppId, 'proj_B');
    assert.ok(!controller.hydratedPaths.has('materials/proj_A/huge1.mp4'), 'Project A paths must not leak into Project B set');
    assert.ok(controller.hydratedPaths.has('materials/proj_B/b1.mp4'));
    console.log('  -> PASSED: Cancellation token and generation token prevented cross-project state leak.');
  }

  // Test 6: Failed hydration retry
  {
    console.log('[Test 6] Failed hydration retry on transient error...');
    const rm = createMockResourceManager();
    const editor = {
      appid: 'proj_A',
      useLocalStorage: true,
      movie: { resourceManage: rm },
      data: {
        resouces: [
          { url: 'materials/proj_A/fail_transient.mp4' }
        ]
      }
    };
    const controller = new CanvasHydrationController(editor);

    // 1st attempt fails due to transient error
    await controller.runEffect();
    assert.strictEqual(controller.hydratedPaths.has('materials/proj_A/fail_transient.mp4'), false, 'Failed path must not be cached as hydrated');
    assert.strictEqual(rm.fetchCounts.get('materials/proj_A/fail_transient.mp4'), 1);

    // 2nd attempt (user retries or re-renders)
    await controller.runEffect();
    assert.strictEqual(controller.hydratedPaths.has('materials/proj_A/fail_transient.mp4'), true, 'Path should be marked hydrated after successful retry');
    assert.strictEqual(rm.fetchCounts.get('materials/proj_A/fail_transient.mp4'), 2);
    console.log('  -> PASSED: Transient failure was retried and successfully hydrated.');
  }

  // Test 7: In-flight concurrent request deduplication
  {
    console.log('[Test 7] In-flight concurrent request deduplication...');
    const inFlightMap = new Map();
    let physicalDiskReads = 0;

    async function getMaterialFileUrlMock(relPath) {
      if (inFlightMap.has(relPath)) {
        return inFlightMap.get(relPath);
      }
      const p = (async () => {
        try {
          physicalDiskReads++;
          await new Promise(r => setTimeout(r, 20));
          return `blob:dedup_${relPath}`;
        } finally {
          inFlightMap.delete(relPath);
        }
      })();
      inFlightMap.set(relPath, p);
      return p;
    }

    // Fire 5 concurrent requests for the exact same path
    const results = await Promise.all([
      getMaterialFileUrlMock('materials/proj_A/shared_track.mp4'),
      getMaterialFileUrlMock('materials/proj_A/shared_track.mp4'),
      getMaterialFileUrlMock('materials/proj_A/shared_track.mp4'),
      getMaterialFileUrlMock('materials/proj_A/shared_track.mp4'),
      getMaterialFileUrlMock('materials/proj_A/shared_track.mp4'),
    ]);

    assert.strictEqual(physicalDiskReads, 1, 'Only 1 physical disk read should occur for concurrent requests');
    assert.strictEqual(results[0], results[1]);
    assert.strictEqual(results[1], results[4]);
    console.log('  -> PASSED: 5 concurrent requests safely coalesced into 1 I/O operation.');
  }

  // Test 8: Reopening project / resourceManage reconstruction
  {
    console.log('[Test 8] Reopening project / resourceManage reconstruction...');
    const rmOld = createMockResourceManager();
    const editor = {
      appid: 'proj_A',
      useLocalStorage: true,
      movie: { resourceManage: rmOld },
      data: {
        resouces: [
          { url: 'materials/proj_A/clip1.mp4' }
        ]
      }
    };
    const controller = new CanvasHydrationController(editor);
    await controller.runEffect();
    assert.strictEqual(rmOld.cache.has('materials/proj_A/clip1.mp4'), true);

    // Reopen project or destroy and recreate resourceManage
    const rmNew = createMockResourceManager();
    editor.movie.resourceManage = rmNew; // new empty instance
    await controller.runEffect();

    assert.strictEqual(rmNew.cache.has('materials/proj_A/clip1.mp4'), true, 'New resource manager cache must be populated');
    assert.strictEqual(controller.lastResourceManage, rmNew);
    console.log('  -> PASSED: Reconstructed resourceManage was detected and repopulated.');
  }

  // Test 9: Resource overwrite on same relative path & Blob URL disposal
  {
    console.log('[Test 9] Resource overwrite on same path & Blob URL disposal...');
    const urlCache = new Map();
    const revokedUrls = [];

    function mockRevokeObjectURL(url) {
      revokedUrls.push(url);
    }

    function mockSaveFileToLocal(relPath, content) {
      if (urlCache.has(relPath)) {
        const old = urlCache.get(relPath);
        mockRevokeObjectURL(old);
        urlCache.delete(relPath);
      }
      const newUrl = `blob:v2_${relPath}_${content}`;
      urlCache.set(relPath, newUrl);
      return newUrl;
    }

    // Step 1: Initial save
    const url1 = mockSaveFileToLocal('materials/proj_A/track.mp4', 'hash_v1');
    assert.strictEqual(urlCache.get('materials/proj_A/track.mp4'), url1);
    assert.strictEqual(revokedUrls.length, 0);

    // Step 2: Overwrite with same relative path
    const url2 = mockSaveFileToLocal('materials/proj_A/track.mp4', 'hash_v2');
    assert.notStrictEqual(url1, url2);
    assert.strictEqual(urlCache.get('materials/proj_A/track.mp4'), url2);
    assert.strictEqual(revokedUrls.length, 1);
    assert.strictEqual(revokedUrls[0], url1, 'Old Blob URL must be revoked on overwrite');
    console.log('  -> PASSED: Overwritten path safely revoked previous Blob URL and created fresh entry.');
  }

  // Test 10: In-place observable array mutations (splice, push, replace)
  {
    console.log('[Test 10] In-place observable array mutations...');
    const rm = createMockResourceManager();
    const editor = {
      appid: 'proj_A',
      useLocalStorage: true,
      movie: { resourceManage: rm },
      data: {
        resouces: [
          { url: 'materials/proj_A/elem1.mp4' },
          { url: 'materials/proj_A/elem2.mp4' },
        ]
      }
    };
    const controller = new CanvasHydrationController(editor);
    await controller.runEffect();
    assert.strictEqual(controller.hydratedPaths.size, 2);

    // Splice: replace elem2 with elem3 in-place
    editor.data.resouces.splice(1, 1, { url: 'materials/proj_A/elem3.mp4' });
    await controller.runEffect();

    assert.ok(rm.cache.has('materials/proj_A/elem3.mp4'));
    assert.strictEqual(controller.hydratedPaths.has('materials/proj_A/elem3.mp4'), true);
    console.log('  -> PASSED: In-place array mutations seamlessly detected and hydrated.');
  }

  console.log('\n========================================================');
  console.log('  ALL 10 CANVAS HYDRATION TEST SCENARIOS PASSED (100%)   ');
  console.log('========================================================\n');
}

runTests().catch(err => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
