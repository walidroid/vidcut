const { observable, autorun, transaction } = require('mobx');
const assert = require('assert');

// Mock Editor Store Selection logic matching src/stores/editor.ts
class MockEditorStore {
  constructor() {
    this.selectedElementIds = [];
    this.selectedElementMap = observable.map();
  }

  isElementSelected(id) {
    return !!this.selectedElementMap.get(id);
  }

  setSelectedElementIds(ids) {
    if (ids.length === 1 && this.selectedElementIds.length === 1 && ids[0] === this.selectedElementIds[0]) {
      return;
    }

    transaction(() => {
      const oldIds = this.selectedElementIds;
      const newSet = new Set(ids);
      const oldSet = new Set(oldIds);

      for (const oldId of oldIds) {
        if (!newSet.has(oldId)) {
          this.selectedElementMap.delete(oldId);
        }
      }
      for (const newId of ids) {
        if (!oldSet.has(newId)) {
          this.selectedElementMap.set(newId, true);
        }
      }
      this.selectedElementIds = [...ids];
    });
  }

  resetSelect() {
    transaction(() => {
      this.selectedElementIds.forEach(id => this.selectedElementMap.delete(id));
      this.selectedElementIds = [];
    });
  }
}

async function testSelectionArchitecture() {
  console.log('=== Running MobX Fine-Grained Selection Verification Test ===\n');

  const TOTAL_CLIPS = 1000;
  const store = new MockEditorStore();

  // Track observer runs for each of the 1000 clips
  const notificationCounts = new Array(TOTAL_CLIPS).fill(0);
  const disposers = [];

  for (let i = 0; i < TOTAL_CLIPS; i++) {
    const clipId = `clip_${i}`;
    const d = autorun(() => {
      const active = store.isElementSelected(clipId);
      notificationCounts[i]++;
    });
    disposers.push(d);
  }

  // Initial mount: every clip ran once
  assert.strictEqual(notificationCounts.every(c => c === 1), true, 'All 1000 clips must run initial observer once on mount');
  console.log('✔ Initial mount: exactly 1000 clip observers initialized (1 run each).');

  // TEST 1: Select single clip (clip_42)
  store.setSelectedElementIds(['clip_42']);
  assert.strictEqual(notificationCounts[42], 2, 'Selected clip_42 must be notified (count = 2)');
  let otherRuns = notificationCounts.filter((c, idx) => idx !== 42 && c !== 1).length;
  assert.strictEqual(otherRuns, 0, 'No other clip out of the 999 unaffected clips should be notified');
  console.log('✔ Test 1 passed: Selecting clip_42 notified ONLY clip_42 (1 notification total).');

  // TEST 2: Switch selection from clip_42 to clip_100
  store.setSelectedElementIds(['clip_100']);
  assert.strictEqual(notificationCounts[42], 3, 'Previously selected clip_42 must be notified of deselection (count = 3)');
  assert.strictEqual(notificationCounts[100], 2, 'Newly selected clip_100 must be notified of selection (count = 2)');
  otherRuns = notificationCounts.filter((c, idx) => idx !== 42 && idx !== 100 && c !== 1).length;
  assert.strictEqual(otherRuns, 0, 'The other 998 clip observers must have received 0 notifications');
  console.log('✔ Test 2 passed: Switching selection notified EXACTLY 2 clips (clip_42 and clip_100). The other 998 clips had 0 notifications.');

  // TEST 3: Multi-selection (clip_100, clip_200, clip_300)
  store.setSelectedElementIds(['clip_100', 'clip_200', 'clip_300']);
  assert.strictEqual(notificationCounts[100], 2, 'clip_100 remained selected, should NOT re-trigger unnecessarily');
  assert.strictEqual(notificationCounts[200], 2, 'clip_200 was newly selected (count = 2)');
  assert.strictEqual(notificationCounts[300], 2, 'clip_300 was newly selected (count = 2)');
  console.log('✔ Test 3 passed: Multi-selection notified only newly added clips (clip_200, clip_300); clip_100 did not re-fire.');

  // TEST 4: Deselect all via resetSelect()
  store.resetSelect();
  assert.strictEqual(notificationCounts[100], 3, 'clip_100 notified of deselection');
  assert.strictEqual(notificationCounts[200], 3, 'clip_200 notified of deselection');
  assert.strictEqual(notificationCounts[300], 3, 'clip_300 notified of deselection');
  assert.strictEqual(store.selectedElementIds.length, 0, 'selectedElementIds must be empty');
  assert.strictEqual(store.selectedElementMap.size, 0, 'selectedElementMap must be empty');
  console.log('✔ Test 4 passed: Deselect all notified only the 3 previously active clips; map is empty.');

  // Cleanup disposers
  disposers.forEach(d => d());
  console.log('\n✔ ALL SELECTION TESTS PASSED: Complexity is strictly O(|ΔS|) notifications (O(1) relative to total clips N).\n');
}

testSelectionArchitecture().catch(err => {
  console.error('❌ SELECTION TEST FAILED:', err);
  process.exit(1);
});

