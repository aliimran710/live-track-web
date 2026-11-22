import * as React from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

import { REPORTS, statusInk } from "@/lib/content";

/**
 * The trip cache, shown as a race rather than claimed as a number. The two
 * bars run on the same clock: the cached lookup lands before the eye gets
 * to it, the upstream one takes the rest of the section.
 */
const UPSTREAM_SECONDS = 3.1;
const CACHE_SECONDS = 0.12;

export function TripCacheRace() {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-80px" });
  const reduced = useReducedMotion();
  const [lap, setLap] = React.useState(0);

  React.useEffect(() => {
    if (!inView || reduced) return;
    const id = window.setInterval(() => setLap((l) => l + 1), 4800);
    return () => window.clearInterval(id);
  }, [inView, reduced]);

  const run = inView || reduced;

  const lanes = [
    { ...REPORTS.cache.before, duration: UPSTREAM_SECONDS, bar: "#5B6BA8", ink: statusInk("offline") },
    { ...REPORTS.cache.after, duration: CACHE_SECONDS, bar: "#22D3EE", ink: "hsl(var(--accent))" },
  ];

  return (
    <div ref={ref} className="rounded-md border border-border bg-surface-1 p-7 md:p-9">
      <h3 className="font-display text-xl font-semibold">{REPORTS.cache.title}</h3>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">{REPORTS.cache.body}</p>

      <div className="mt-9 space-y-7">
        {lanes.map((lane) => (
          <div key={lane.label}>
            <div className="flex items-baseline justify-between gap-4">
              <p className="eyebrow">{lane.label}</p>
              <p className="font-mono text-lg font-medium tabular-nums" style={{ color: lane.ink }}>
                {lane.value}
              </p>
            </div>
            <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
              <motion.div
                key={`${lane.label}-${lap}`}
                className="h-full rounded-full"
                style={{ background: lane.bar }}
                initial={{ width: reduced ? "100%" : 0 }}
                animate={run ? { width: "100%" } : { width: 0 }}
                transition={{ duration: reduced ? 0 : lane.duration, ease: "linear" }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
