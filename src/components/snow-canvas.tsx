"use client";

import type { ISourceOptions } from "@tsparticles/engine";
import Particles, { ParticlesProvider } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useEffect, useState } from "react";

const options: ISourceOptions = {
  fullScreen: { enable: false },
  background: { color: "transparent" },
  fpsLimit: 40,
  particles: {
    number: { value: 38, density: { enable: true } },
    color: { value: "#f4ece0" },
    shape: { type: "circle" },
    opacity: { value: { min: 0.35, max: 0.8 } },
    size: { value: { min: 1.5, max: 3.5 } },
    move: {
      enable: true,
      direction: "bottom",
      speed: { min: 0.4, max: 1.1 },
      straight: false,
      outModes: { default: "out" },
    },
    wobble: { enable: true, distance: 8, speed: { min: -1, max: 1 } },
  },
  detectRetina: true,
};

export default function SnowCanvas() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setEnabled(!query.matches);
    const onChange = () => setEnabled(!query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
      <ParticlesProvider init={loadSlim}>
        <Particles id="snow" options={options} className="h-full w-full" />
      </ParticlesProvider>
    </div>
  );
}
