export async function fireConfetti() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const { confetti } = await import("@tsparticles/confetti");
  await confetti({
    count: 110,
    spread: 85,
    startVelocity: 38,
    position: { x: 50, y: 65 },
    colors: ["#c8202f", "#f47fae", "#f4ece0", "#d7ad62", "#4f8f58"],
    zIndex: 100,
  });
}
