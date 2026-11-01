const { observable, autorun, transaction } = require('mobx');
const { performance } = require('perf_hooks');

console.log('=== MobX Timeline Clip Selection Benchmark ===\n');
console.log('| Total Clips in Timeline | Strategy | Notifications Fired | Execution Time (ms) | Efficiency / Speedup |');
console.log('| :--- | :--- | :--- | :--- | :--- |');

for (const N of [100, 500, 1000, 5000]) {
  // 1. Array-based (Before)
  const storeArray = observable({ selectedIds: [] });
  const arrayDisposers = [];
  let arrayRuns = 0;
  for (let i = 0; i < N; i++) {
    const id = 'clip_' + i;
    const d = autorun(() => {
      const active = storeArray.selectedIds.includes(id);
      arrayRuns++;
    });
    arrayDisposers.push(d);
  }
  arrayRuns = 0;

  const t0 = performance.now();
  storeArray.selectedIds = ['clip_42'];
  const t1 = performance.now();
  const arrayNotifications = arrayRuns;
  const arrayTime = t1 - t0;
  arrayDisposers.forEach(d => d());

  // 2. Map-based (After)
  const storeMap = observable({
    selectedIds: [],
    selectedMap: observable.map(),
    setSelected(ids) {
      transaction(() => {
        for (const old of this.selectedIds) {
          if (!ids.includes(old)) this.selectedMap.delete(old);
        }
        for (const nw of ids) {
          this.selectedMap.set(nw, true);
        }
        this.selectedIds = [...ids];
      });
    }
  });

  const mapDisposers = [];
  let mapRuns = 0;
  for (let i = 0; i < N; i++) {
    const id = 'clip_' + i;
    const d = autorun(() => {
      const active = !!storeMap.selectedMap.get(id);
      mapRuns++;
    });
    mapDisposers.push(d);
  }
  mapRuns = 0;

  const t2 = performance.now();
  storeMap.setSelected(['clip_42']);
  const t3 = performance.now();
  const mapNotifications = mapRuns;
  const mapTime = t3 - t2;
  mapDisposers.forEach(d => d());

  const speedup = (arrayTime / mapTime).toFixed(1);
  console.log(`| ${N} clips | Array includes (Before) | ${arrayNotifications} notifications (O(N)) | ${arrayTime.toFixed(3)} ms | Baseline (1.0x) |`);
  console.log(`| ${N} clips | Observable Map (After)  | ${mapNotifications} notification (O(1)) | ${mapTime.toFixed(3)} ms | ${speedup}x faster |`);
}

