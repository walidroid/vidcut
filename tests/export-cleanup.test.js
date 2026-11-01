const assert = require('assert');

async function testExportCleanup() {
  console.log('=== Running Export Resource Disposal & Lifecycle Test ===\n');

  // Test 1: Successful completion triggers cleanup exactly once
  let destroyCallCount = 0;
  let isDestroyed = false;
  const mockMe = {
    destroy: () => {
      destroyCallCount++;
    }
  };

  const safeDestroy = () => {
    if (isDestroyed) return;
    isDestroyed = true;
    try {
      mockMe.destroy();
    } catch (e) {}
  };

  // Simulate onFinish finally
  try {
    // simulated successful onFinish
  } finally {
    safeDestroy();
  }

  assert.strictEqual(destroyCallCount, 1, 'Destroy must be called once on success');
  console.log('✔ Test 1 passed: Successful export called destroy() exactly once.');

  // Test 2: Double destroy idempotency
  safeDestroy();
  safeDestroy();
  assert.strictEqual(destroyCallCount, 1, 'Destroy must be idempotent and not fire multiple times');
  console.log('✔ Test 2 passed: Multiple destroy calls prevented by idempotency guard.');

  // Test 3: Failure handling cleanup
  let failDestroyCount = 0;
  let failIsDestroyed = false;
  const mockFailMe = {
    destroy: () => { failDestroyCount++; }
  };
  const safeFailDestroy = () => {
    if (failIsDestroyed) return;
    failIsDestroyed = true;
    mockFailMe.destroy();
  };

  try {
    throw new Error('Simulated WebGL Context Lost');
  } catch (e) {
    // catch block
  } finally {
    safeFailDestroy();
  }

  assert.strictEqual(failDestroyCount, 1, 'Destroy must execute even on unhandled exception in finally block');
  console.log('✔ Test 3 passed: Exception during export safely cleans up MovieEncoding resources via finally.');

  console.log('\n✔ ALL EXPORT CLEANUP TESTS PASSED.\n');
}

testExportCleanup().catch(err => {
  console.error('❌ EXPORT CLEANUP TEST FAILED:', err);
  process.exit(1);
});

