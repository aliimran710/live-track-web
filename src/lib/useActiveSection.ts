import * as React from "react";

/**
 * Reports which waypoint section currently owns the viewport.
 * The rail uses it to tint the dot the visitor is standing on.
 */
export function useActiveSection(ids: string[]) {
  const [active, setActive] = React.useState(ids[0]);

  React.useEffect(() => {
    const seen = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          seen.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        }
        let best = ids[0];
        let bestRatio = 0;
        for (const id of ids) {
          const ratio = seen.get(id) ?? 0;
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = id;
          }
        }
        if (bestRatio > 0) setActive(best);
      },
      { threshold: [0, 0.15, 0.35, 0.6, 0.9], rootMargin: "-20% 0px -30% 0px" },
    );

    const nodes = ids
      .map((id) => document.getElementById(id))
      .filter((n): n is HTMLElement => Boolean(n));
    nodes.forEach((n) => observer.observe(n));

    return () => observer.disconnect();
  }, [ids]);

  return active;
}
