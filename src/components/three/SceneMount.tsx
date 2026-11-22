import * as React from "react";
import { useReducedMotion } from "framer-motion";

import { CanvasFallback } from "./CanvasFallback";

const HeroScene = React.lazy(() => import("./HeroScene"));
const SignalChainScene = React.lazy(() => import("./SignalChainScene"));

/** One cheap probe, cached: does this browser give us a context at all? */
let webglSupported: boolean | null = null;
function supportsWebGL() {
  if (webglSupported !== null) return webglSupported;
  try {
    const canvas = document.createElement("canvas");
    webglSupported = Boolean(
      canvas.getContext("webgl2") ?? canvas.getContext("webgl"),
    );
  } catch {
    webglSupported = false;
  }
  return webglSupported;
}

/**
 * Keeps three.js out of the first paint. The chunk is only requested once
 * the scene is close to the viewport, and never at all for visitors who
 * asked for reduced motion or whose browser has no WebGL.
 */
export function SceneMount({
  scene,
  label,
}: {
  scene: "hero" | "signal";
  label: string;
}) {
  const hostRef = React.useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [near, setNear] = React.useState(false);

  React.useEffect(() => {
    const host = hostRef.current;
    if (!host || reduced) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px 0px" },
    );
    observer.observe(host);
    return () => observer.disconnect();
  }, [reduced]);

  const useCanvas = near && !reduced && supportsWebGL();
  const Scene = scene === "hero" ? HeroScene : SignalChainScene;

  return (
    <div ref={hostRef} className="h-full w-full">
      {useCanvas ? (
        <React.Suspense fallback={<CanvasFallback label={label} />}>
          <Scene />
        </React.Suspense>
      ) : (
        <CanvasFallback label={label} />
      )}
    </div>
  );
}
