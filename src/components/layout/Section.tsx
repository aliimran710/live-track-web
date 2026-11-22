import * as React from "react";
import { motion } from "framer-motion";

import { WAYPOINTS, statusInk } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * Section headers are waypoints, not ornaments. A GPS track genuinely is an
 * ordered series of fixes, so the ordinal, the coordinate and the state all
 * carry information the rest of the page refers back to.
 */
export function WaypointEyebrow({ id }: { id: string }) {
  const wp = WAYPOINTS.find((w) => w.id === id);
  if (!wp) return null;
  const color = statusInk(wp.status);

  return (
    <p className="eyebrow flex flex-wrap items-center gap-x-3 gap-y-1">
      <span className="text-foreground">WP {wp.index}</span>
      <span aria-hidden className="h-px w-6 bg-border" />
      <span>{wp.coord}</span>
      <span aria-hidden className="h-px w-6 bg-border" />
      <span>{wp.stamp} PKT</span>
      <span aria-hidden className="h-px w-6 bg-border" />
      <span className="inline-flex items-center gap-1.5" style={{ color }}>
        <span aria-hidden className="size-1.5 rounded-full" style={{ background: color }} />
        {wp.label}
      </span>
    </p>
  );
}

export function Section({
  id,
  children,
  className,
  grid = true,
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
  grid?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn("relative scroll-mt-24 py-24 md:py-32", grid && "lg:pl-[72px]", className)}
    >
      <div className="container">{children}</div>
    </section>
  );
}

const EASE = [0.22, 1, 0.36, 1] as const;

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, ease: EASE, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Section title, set in the expanded display face. */
export function SectionTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={cn("mt-5 max-w-3xl text-[clamp(1.9rem,3.4vw,3.1rem)] font-semibold leading-[1.08]", className)}>
      {children}
    </h2>
  );
}

export function SectionLead({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-[1.0625rem]", className)}>
      {children}
    </p>
  );
}
