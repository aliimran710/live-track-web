import * as React from "react";
import { motion, AnimatePresence, useInView, useReducedMotion } from "framer-motion";

import { ALERTS, STATUS_HEX, statusInk } from "@/lib/content";

/**
 * The live event feed. A new line arrives at the top and the oldest falls
 * off the bottom, which is what watching the panel actually looks like.
 */
export function EventFeed() {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-60px" });
  const reduced = useReducedMotion();
  const [offset, setOffset] = React.useState(0);

  React.useEffect(() => {
    if (!inView || reduced) return;
    const id = window.setInterval(() => setOffset((o) => o + 1), 2600);
    return () => window.clearInterval(id);
  }, [inView, reduced]);

  const rows = React.useMemo(() => {
    const feed = ALERTS.feed;
    // Times are generated rather than cycled, so the newest line is always
    // the latest one and the feed never reads out of order.
    const newest = 8 * 3600 + 52 * 60 + 47 + offset * 26;
    return Array.from({ length: 5 }, (_, i) => {
      const item = feed[(offset + i) % feed.length];
      return { ...item, time: clock(newest - i * 37), key: `${item.vehicle}-${offset + i}` };
    });
  }, [offset]);

  return (
    <div ref={ref} className="overflow-hidden rounded-md border border-border bg-surface-1">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <p className="eyebrow">Live events</p>
        <span className="flex items-center gap-2">
          <span aria-hidden className="size-1.5 rounded-full animate-blink" style={{ background: statusInk("move") }} />
          <span className="eyebrow" style={{ color: statusInk("move") }}>Connected</span>
        </span>
      </div>

      <ul className="relative overflow-hidden">
        <AnimatePresence initial={false}>
          {rows.map((row, i) => (
            <motion.li
              key={row.key}
              layout
              initial={reduced ? false : { opacity: 0, y: -14 }}
              animate={{ opacity: 1 - i * 0.14, y: 0 }}
              exit={reduced ? undefined : { opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-4 border-b border-border px-6 py-[0.85rem]"
            >
              <span aria-hidden className="size-2 shrink-0 rounded-full" style={{ background: STATUS_HEX[row.tone] }} />
              <span className="font-mono text-[0.6875rem] tabular-nums text-muted-foreground">{row.time}</span>
              <span className="font-mono text-xs font-medium text-foreground">{row.vehicle}</span>
              <span className="ml-auto truncate text-sm text-muted-foreground">{row.event}</span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}

/** Seconds since midnight, rendered the way the panel renders Asia/Karachi. */
function clock(total: number) {
  const s = ((total % 86400) + 86400) % 86400;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}`;
}
