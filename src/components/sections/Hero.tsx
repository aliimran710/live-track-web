import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CountUp } from "@/components/figures/CountUp";
import { WaypointEyebrow } from "@/components/layout/Section";
import { HERO } from "@/lib/content";
import { SceneMount } from "@/components/three/SceneMount";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  return (
    <section id="hero" className="relative min-h-[100svh] overflow-hidden pt-[72px] lg:pl-[72px]">
      <div className="graticule absolute inset-0 opacity-50" />
      {/* The canvas occupies the right of the viewport on desktop and sits
          under the headline on small screens. */}
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[58%] lg:block">
        <SceneMount scene="hero" label="A vehicle travelling a route across a city grid, tracked from above" />
      </div>
      {/* The scene has to sit under the headline on the left and stand clear
          on the right, so the fade finishes well before the canvas does. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-[58%] lg:block"
        style={{
          backgroundImage:
            "linear-gradient(to right, hsl(var(--background)) 0%, hsl(var(--background) / 0.75) 14%, hsl(var(--background) / 0.25) 32%, transparent 48%)",
        }}
      />

      <div className="container relative flex min-h-[calc(100svh-72px)] flex-col justify-center py-12">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.15 }}>
          <WaypointEyebrow id="hero" />
        </motion.div>

        <h1 className="mt-7 max-w-[14ch] text-[clamp(2.35rem,5.1vw,4.35rem)] font-bold leading-[0.96]">
          {HERO?.title?.map((line, i) => (
            <motion.span
              key={line}
              className="block"
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: EASE, delay: 0.25 + i * 0.09 }}
            >
              {line}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.55 }}
          className="mt-7 max-w-xl text-base leading-relaxed text-muted-foreground md:text-[1.0625rem]"
        >
          {HERO.lead}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.66 }}
          className="mt-9 flex flex-wrap items-center gap-3"
        >
          <Button asChild size="lg">
            <a href="#how">{HERO.primaryCta}</a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href="#contact">{HERO.secondaryCta}</a>
          </Button>
        </motion.div>

        {/* Mobile and tablet get the scene here, in flow. */}
        <div className="relative mt-12 h-[280px] w-full overflow-hidden rounded-md border border-border bg-surface-1 sm:h-[340px] lg:hidden">
          <SceneMount scene="hero" label="A vehicle travelling a route across a city grid, tracked from above" />
        </div>

        <motion.dl
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.8 }}
          className="mt-12 grid max-w-3xl grid-cols-2 gap-x-6 gap-y-8 border-t border-border pt-8 md:grid-cols-4"
        >
          {HERO.stats.map((stat) => (
            // A definition list wants dt before dd in the DOM; the number
            // reads first, so the visual order is set with flex ordering.
            <div key={stat.label} className="flex flex-col">
              <dt className="order-2 mt-2 text-sm font-medium text-foreground">{stat.label}</dt>
              <dd className="order-1 font-mono text-[clamp(1.35rem,2.3vw,1.85rem)] font-medium tabular-nums text-foreground">
                <CountUp value={stat.value} suffix={stat.suffix} />
              </dd>
              <dd className="order-3 mt-0.5 text-xs text-muted-foreground">{stat.note}</dd>
            </div>
          ))}
        </motion.dl>
      </div>

      <motion.a
        href="#why"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-2 rounded-sm lg:inline-flex"
      >
        <span className="eyebrow">Scroll the route</span>
        <ArrowDown className="size-3.5 text-muted-foreground" />
      </motion.a>
    </section>
  );
}

export default Hero;