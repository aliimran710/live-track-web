import * as React from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

import { WaypointEyebrow, Reveal } from "@/components/layout/Section";
import { SceneMount } from "@/components/three/SceneMount";
import { SIGNAL_CHAIN } from "@/lib/content";
import { signalProgress, stageFromProgress } from "@/lib/signalProgress";
import { cn } from "@/lib/utils";

/**
 * The section pins while the packet walks the chain. Scroll position is
 * published to `signalProgress`, which the WebGL scene reads, so the stage
 * described here is the stage lit on the canvas.
 */
export function HowItWorks() {
  const ref = React.useRef<HTMLDivElement>(null);
  const [stage, setStage] = React.useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    signalProgress.current = p;
    const next = stageFromProgress(p);
    setStage((prev) => (prev === next ? prev : next));
  });

  const current = SIGNAL_CHAIN.stages[stage];

  return (
    <section id="how" ref={ref} className="relative scroll-mt-24 lg:pl-[72px]">
      {/* Four screens of scroll, one per hop. */}
      <div className="h-[290vh]">
        <div className="sticky top-0 flex min-h-screen items-center overflow-hidden pb-16 pt-28">
          <div className="graticule absolute inset-0 opacity-40" />

          <div className="container relative grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:gap-16">
            <div>
              <WaypointEyebrow id="how" />
              <h2 className="mt-5 max-w-xl text-[clamp(1.8rem,3vw,2.7rem)] font-semibold leading-[1.08]">
                {SIGNAL_CHAIN.title}
              </h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
                {SIGNAL_CHAIN.lead}
              </p>

              {/* Stage rail: which hop you are reading about. */}
              <ol className="mt-10 flex flex-wrap gap-x-5 gap-y-2" aria-label="Stages">
                {SIGNAL_CHAIN.stages.map((s, i) => (
                  <li key={s.key} className="flex items-center gap-2">
                    <span
                      aria-hidden
                      className={cn(
                        "h-px transition-all duration-300",
                        i === stage ? "w-7 bg-accent" : "w-3.5 bg-border",
                      )}
                    />
                    <span
                      className={cn(
                        "font-mono text-[0.6875rem] uppercase tracking-eyebrow transition-colors duration-300",
                        i === stage ? "text-accent" : "text-muted-foreground",
                      )}
                    >
                      {s.name}
                    </span>
                  </li>
                ))}
              </ol>

              <div className="relative mt-7 min-h-[11.5rem] rounded-md border border-border bg-surface-1 p-6">
                <motion.div
                  key={current.key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="eyebrow text-accent">{current.metric}</p>
                  <h3 className="mt-3 font-display text-xl font-semibold">{current.name}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{current.body}</p>
                </motion.div>
              </div>
            </div>

            <div className="relative h-[46vh] min-h-[280px] w-full lg:h-[58vh]">
              <SceneMount
                scene="signal"
                label="A packet travelling from a vehicle device to a satellite, a server and an operator panel"
              />
            </div>
          </div>
        </div>
      </div>

      {/* What happens when the network misbehaves. */}
      <div className="container relative pb-24 md:pb-32">
        <Reveal>
          <dl className="grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3">
            {SIGNAL_CHAIN.resilience.map((r) => (
              <div key={r.label} className="bg-surface-1 p-7">
                <dt className="eyebrow">{r.label}</dt>
                <dd className="mt-3 font-mono text-2xl font-medium text-foreground">{r.value}</dd>
                <dd className="mt-2 text-sm text-muted-foreground">{r.note}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
