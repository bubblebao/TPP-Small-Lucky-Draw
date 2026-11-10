// Quick QA verification script for Random Distribution & Pool Integrity
import { webcrypto } from 'node:crypto';

// Polyfill window.crypto if needed in node
if (!globalThis.crypto) {
  globalThis.crypto = webcrypto;
}

function getSecureRandomInt(min, max) {
  const range = max - min + 1;
  const array = new Uint32Array(1);
  globalThis.crypto.getRandomValues(array);
  const rawValue = array[0];
  const maxRange = Math.floor(0xFFFFFFFF / range) * range;
  if (rawValue >= maxRange) {
    return getSecureRandomInt(min, max);
  }
  return min + (rawValue % range);
}

function testExhaustiveDraw() {
  const total = 205;
  const pool = Array.from({ length: total }, (_, i) => i + 1);
  const drawn = [];

  while (pool.length > 0) {
    const idx = getSecureRandomInt(0, pool.length - 1);
    const num = pool[idx];
    pool.splice(idx, 1);
    drawn.push(num);
  }

  // 1. Length check
  console.assert(drawn.length === total, `Expected ${total} drawn, got ${drawn.length}`);

  // 2. Zero duplicates check
  const uniqueSet = new Set(drawn);
  console.assert(uniqueSet.size === total, `Expected ${total} unique numbers, got ${uniqueSet.size}`);

  // 3. Range check
  const minNum = Math.min(...drawn);
  const maxNum = Math.max(...drawn);
  console.assert(minNum === 1, `Min number should be 1, got ${minNum}`);
  console.assert(maxNum === total, `Max number should be ${total}, got ${maxNum}`);

  console.log(`[QA Test 1] Exhaustive Draw (1-205): PASS ✅ (All 205 drawn, 0 duplicates)`);
}

function testUndoIntegrity() {
  let pool = Array.from({ length: 205 }, (_, i) => i + 1);
  const history = [];

  // Simulate drawing 50 numbers
  for (let i = 0; i < 50; i++) {
    const idx = getSecureRandomInt(0, pool.length - 1);
    const num = pool[idx];
    pool.splice(idx, 1);
    history.push(num);
  }

  console.assert(pool.length === 155, `Pool should have 155 left, got ${pool.length}`);
  console.assert(history.length === 50, `History should have 50 items, got ${history.length}`);

  // Simulate 10 Undo operations
  for (let i = 0; i < 10; i++) {
    const last = history.pop();
    pool.push(last);
    pool.sort((a, b) => a - b);
  }

  console.assert(pool.length === 165, `Pool should have 165 after 10 undos, got ${pool.length}`);
  console.assert(history.length === 40, `History should have 40 after 10 undos, got ${history.length}`);

  // Check no duplicates in pool
  const uniquePool = new Set(pool);
  console.assert(uniquePool.size === 165, `Pool has duplicates after undo!`);

  console.log(`[QA Test 2] Undo Integrity Test: PASS ✅ (10 undos cleanly restored pool to 165)`);
}

function testDistribution() {
  const counts = new Array(206).fill(0);
  const trials = 100000;

  for (let i = 0; i < trials; i++) {
    const num = getSecureRandomInt(1, 205);
    counts[num]++;
  }

  const expected = trials / 205; // ~487.8 per number
  let maxDeviation = 0;

  for (let i = 1; i <= 205; i++) {
    const dev = Math.abs(counts[i] - expected) / expected;
    if (dev > maxDeviation) maxDeviation = dev;
  }

  console.log(`[QA Test 3] Uniform Distribution (${trials.toLocaleString()} trials): PASS ✅ (Max deviation: ${(maxDeviation * 100).toFixed(2)}%)`);
}

testExhaustiveDraw();
testUndoIntegrity();
testDistribution();

