export async function fireConfetti() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const { confetti } = await import("@tsparticles/confetti");
  await confetti({
    count: 110,
    spread: 85,
    startVelocity: 38,
    position: { x: 50, y: 65 },
    colors: ["#e5484d", "#f0c24b", "#3fb37f", "#ffffff", "#5aa9ff"],
    zIndex: 100,
  });
}
