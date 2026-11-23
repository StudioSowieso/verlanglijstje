"use client";

import dynamic from "next/dynamic";

const SnowCanvas = dynamic(() => import("./snow-canvas"), { ssr: false });

export function Snow() {
  return <SnowCanvas />;
}
