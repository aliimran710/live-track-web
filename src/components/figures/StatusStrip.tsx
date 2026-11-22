import * as React from "react";
import { motion, useInView } from "framer-motion";

import { TRACKING, STATUS_HEX } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * The status strip, as it sits above the vehicle list in the panel: six
 * segments, each one a filter. Here the segment widths are proportional to
 * the counts, so the shape of the fleet is readable before the numbers are.
 */
export function StatusStrip() {
  const [active, setActive] = React.useState<string | null>(null);
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const states = TRACKING.states;
  const total = states.find((s) => s.key === "total")?.count ?? 1;
  const segments = states.filter((s) => s.key !== "total");

  return (
    <div ref={ref}>
      <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-surface-2" role="img" aria-label="Fleet by state">
        {segments.map((s, i) => (
          <motion.span
            key={s.key}
            initial={{ width: 0 }}
            animate={inView ? { width: `${(s.count / total) * 100}%` } : { width: 0 }}
            transition={{ duration: 0.8, delay: 0.1 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            style={{ background: STATUS_HEX[s.key] }}
            className={cn("h-full transition-opacity duration-200", active && active !== s.key && "opacity-30")}
          />
        ))}
      </div>

      <ul className="mt-8 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
        {states.map((s) => (
          <li key={s.key}>
            <button
              type="button"
              onMouseEnter={() => setActive(s.key)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(s.key)}
              onBlur={() => setActive(null)}
              className="flex w-full flex-col items-start gap-1 bg-surface-1 p-6 text-left transition-colors duration-200 hover:bg-surface-2"
            >
              <span className="flex items-center gap-2">
                <span aria-hidden className="size-2 rounded-full" style={{ background: STATUS_HEX[s.key] }} />
                <span className="eyebrow">{s.name}</span>
              </span>
              <span className="mt-1 font-mono text-2xl font-medium tabular-nums text-foreground">{s.count}</span>
              <span className="text-sm text-muted-foreground">{s.rule}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
