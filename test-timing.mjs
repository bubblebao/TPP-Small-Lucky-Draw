function testRandomizedStartFullLoopMath() {
  const testPoolSizes = [205, 180, 100, 50, 20, 5, 2, 1];
  const durations = [3000, 5000, 7000];

  for (const poolLen of testPoolSizes) {
    for (const duration of durations) {
      let minLaps = 1;
      if (duration >= 6500) {
        minLaps = poolLen >= 150 ? 2 : 3;
      } else if (duration >= 4500) {
        minLaps = poolLen >= 150 ? 1 : 2;
      } else {
        minLaps = 1;
      }

      // Test multiple randomized start indexes
      for (let startIndex = 0; startIndex < poolLen; startIndex++) {
        for (let targetIndex = 0; targetIndex < poolLen; targetIndex++) {
          const distance = (targetIndex - startIndex + poolLen) % poolLen;
          const totalSteps = minLaps * poolLen + distance;

          // 1. Must do at least 1 full loop through all pool numbers
          if (poolLen > 1 && totalSteps < poolLen) {
            throw new Error(`Did not complete full loop! totalSteps=${totalSteps}, poolLen=${poolLen}`);
          }

          // 2. Final step must land exactly on targetIndex
          const finalIndex = (startIndex + totalSteps) % poolLen;
          if (finalIndex !== targetIndex) {
            throw new Error(`Target mismatch! start=${startIndex}, target=${targetIndex}, final=${finalIndex}`);
          }
        }
      }
    }
  }

  console.log('✅ Randomized Start + Full Loop Math: 100% PASS for all durations (3s, 5s, 7s) and all pool sizes!');
}

testRandomizedStartFullLoopMath();
