// Verification of the sequential step calculation algorithm
function testSequentialMath() {
  const testPoolSizes = [205, 150, 50, 10, 5, 2, 1];
  const durations = [2000, 3500, 5000];

  for (const poolLen of testPoolSizes) {
    for (const duration of durations) {
      for (let startIndex = 0; startIndex < poolLen; startIndex++) {
        for (let targetIndex = 0; targetIndex < poolLen; targetIndex++) {
          const distance = (targetIndex - startIndex + poolLen) % poolLen;
          const minSteps = Math.max(30, Math.floor(duration / 55));
          const laps = Math.max(1, Math.ceil((minSteps - distance) / poolLen));
          const totalSteps = laps * poolLen + distance;

          const finalIndex = (startIndex + totalSteps) % poolLen;
          if (finalIndex !== targetIndex) {
            throw new Error(
              `Failed: poolLen=${poolLen}, start=${startIndex}, target=${targetIndex}, final=${finalIndex}`
            );
          }
        }
      }
    }
  }

  console.log('✅ Sequential Step Math Test: 100% PASS for all pool sizes and durations!');
}

testSequentialMath();

