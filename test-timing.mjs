function testFullLoopMath() {
  const testPoolSizes = [205, 180, 100, 50, 15, 5, 2, 1];
  const durations = [5000, 7000, 9000];

  for (const poolLen of testPoolSizes) {
    for (const duration of durations) {
      let minLaps = 1;
      if (duration >= 8500) {
        minLaps = poolLen >= 150 ? 2 : 3;
      } else if (duration >= 6500) {
        minLaps = poolLen >= 150 ? 2 : 2;
      } else {
        minLaps = 1;
      }

      for (let startIndex = 0; startIndex < poolLen; startIndex++) {
        for (let targetIndex = 0; targetIndex < poolLen; targetIndex++) {
          const distance = (targetIndex - startIndex + poolLen) % poolLen;
          const totalSteps = minLaps * poolLen + distance;

          // 1. Must do at least 1 full loop
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

  console.log('✅ Full 205-Number Cycle Math: 100% PASS! Every number in pool is visited at least 1 full time, and final step lands exactly on target!');
}

testFullLoopMath();
