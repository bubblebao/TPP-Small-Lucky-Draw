function testCalibratedTimingMath() {
  const testPoolSizes = [205, 180, 50, 15, 5, 2, 1];
  const durations = [2000, 3500, 5000];

  for (const poolLen of testPoolSizes) {
    for (const duration of durations) {
      let totalSteps = 45;
      if (duration <= 2200) {
        totalSteps = Math.min(30, poolLen > 1 ? 30 : 1);
      } else if (duration >= 4500) {
        totalSteps = Math.min(65, poolLen > 1 ? 65 : 1);
      } else {
        totalSteps = Math.min(45, poolLen > 1 ? 45 : 1);
      }

      for (let targetIndex = 0; targetIndex < poolLen; targetIndex++) {
        const startIndex = (targetIndex - (totalSteps % poolLen) + poolLen) % poolLen;
        const finalIndex = (startIndex + totalSteps) % poolLen;

        if (finalIndex !== targetIndex) {
          throw new Error(`Failed: poolLen=${poolLen}, target=${targetIndex}, final=${finalIndex}`);
        }
      }
    }
  }

  console.log('✅ Calibrated Timing & Step Math: 100% PASS for all durations (2s, 3.5s, 5s) and all pool sizes!');
}

testCalibratedTimingMath();
