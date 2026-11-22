import * as React from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Lock, Unlock } from "lucide-react";

import { CONTROL, statusInk } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * Sending a command and getting an answer. The lock on the row changes only
 * when the device acknowledges, which is the whole point of the response
 * table in the panel.
 */
export function CommandConsole() {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-80px" });
  const reduced = useReducedMotion();
  const [step, setStep] = React.useState(reduced ? CONTROL.console.length : 0);

  React.useEffect(() => {
    if (!inView || reduced) return;
    let i = 0;
    setStep(0);
    const id = window.setInterval(() => {
      i += 1;
      setStep(i);
      if (i > CONTROL.console.length + 2) i = 0;
    }, 1100);
    return () => window.clearInterval(id);
  }, [inView, reduced]);

  const locked = step > CONTROL.console.length - 1;

  return (
    <div ref={ref} className="overflow-hidden rounded-md border border-border bg-surface-1">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <p className="font-mono text-[0.6875rem] uppercase tracking-eyebrow text-foreground">
          Send command · LES-4471
        </p>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[0.625rem] uppercase tracking-eyebrow transition-colors duration-300",
            !locked && "text-muted-foreground",
          )}
          style={locked ? { background: "rgba(168,85,247,0.12)", color: statusInk("disabled") } : undefined}
        >
          {locked ? <Lock className="size-3" /> : <Unlock className="size-3" />}
          {locked ? "Immobilised" : "Running"}
        </span>
      </div>

      <div className="min-h-[9.5rem] space-y-2.5 px-6 py-5">
        {CONTROL.console.map((line, i) => (
          <motion.p
            key={line.line}
            initial={reduced ? false : { opacity: 0, x: -8 }}
            animate={step > i ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-baseline gap-4 font-mono text-xs"
          >
            <span className="tabular-nums text-muted-foreground">{line.time}</span>
            <span className={line.kind === "out" ? "text-accent" : "text-foreground"}>{line.line}</span>
          </motion.p>
        ))}
        {!reduced && (
          <span aria-hidden className="inline-block h-3.5 w-[7px] bg-accent align-middle animate-blink" />
        )}
      </div>

      <p className="border-t border-border bg-surface-2 px-6 py-4 text-sm text-muted-foreground">{CONTROL.note}</p>
    </div>
  );
}
