import confetti from 'canvas-confetti';

export function fireCelebrationConfetti() {
  const duration = 2.5 * 1000;
  const animationEnd = Date.now() + duration;

  // The Pavilions Phuket Luxury Gold & Slate palette
  const colors = ['#D4AF37', '#F3E5AB', '#698A9A', '#FFFFFF', '#FFD700', '#44595B'];

  // Left & Right cannon blasts
  confetti({
    particleCount: 80,
    angle: 60,
    spread: 65,
    origin: { x: 0, y: 0.8 },
    colors,
    zIndex: 9999,
  });

  confetti({
    particleCount: 80,
    angle: 120,
    spread: 65,
    origin: { x: 1, y: 0.8 },
    colors,
    zIndex: 9999,
  });

  // Continuous mini sparkles
  const interval: ReturnType<typeof setInterval> = setInterval(function () {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 40 * (timeLeft / duration);

    confetti({
      particleCount,
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      origin: {
        x: Math.random() * 0.6 + 0.2,
        y: Math.random() * 0.4 + 0.2,
      },
      colors,
      zIndex: 9999,
      disableForReducedMotion: true,
    });
  }, 250);
}

