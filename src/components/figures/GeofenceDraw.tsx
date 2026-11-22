import * as React from "react";
import { motion, AnimatePresence, useInView, useReducedMotion } from "framer-motion";

import { GEOFENCING } from "@/lib/content";
import { cn } from "@/lib/utils";

const POLY: [number, number][] = [
  [96, 58],
  [236, 92],
  [268, 196],
  [158, 238],
  [78, 160],
];
const CIRCLE = { cx: 176, cy: 148, r: 86 };

/**
 * Drawing a zone, the way the panel does it: click each corner for a
 * polygon, or press and drag for a circle. The WKT underneath is the string
 * that actually gets stored.
 */
export function GeofenceDraw() {
  const [shape, setShape] = React.useState<"polygon" | "circle">("polygon");
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduced = useReducedMotion();

  const active = GEOFENCING.shapes.find((s) => s.key === shape)!;
  const run = inView || reduced;

  return (
    <div ref={ref} className="mx-auto w-full max-w-xl overflow-hidden rounded-md border border-border bg-surface-1">
      <div role="tablist" aria-label="Zone shape" className="flex border-b border-border">
        {GEOFENCING.shapes.map((s) => (
          <button
            key={s.key}
            role="tab"
            type="button"
            aria-selected={shape === s.key}
            onClick={() => setShape(s.key)}
            className={cn(
              "flex-1 px-5 py-3.5 font-mono text-[0.6875rem] uppercase tracking-eyebrow transition-colors duration-150",
              shape === s.key
                ? "bg-surface-2 text-accent"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {s.name}
          </button>
        ))}
      </div>

      <div className="relative">
        <div className="graticule-fine absolute inset-0 opacity-70" />
        <svg viewBox="0 0 352 296" className="relative w-full" role="img" aria-label={`${active.name} zone drawn on the map`}>
          <AnimatePresence mode="wait">
            {shape === "polygon" ? (
              <motion.g key="poly" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <motion.polygon
                  points={POLY.map((p) => p.join(",")).join(" ")}
                  fill="rgba(34,211,238,0.09)"
                  stroke="#22D3EE"
                  strokeWidth={1.75}
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={run ? { pathLength: 1, opacity: 1 } : {}}
                  transition={{ duration: reduced ? 0 : 1.5, ease: "easeInOut" }}
                />
                {POLY.map((p, i) => (
                  <motion.circle
                    key={i}
                    cx={p[0]}
                    cy={p[1]}
                    r={4}
                    fill="#22D3EE"
                    stroke="hsl(var(--surface-1))"
                    strokeWidth={2}
                    initial={{ scale: 0 }}
                    animate={run ? { scale: 1 } : {}}
                    transition={{ delay: reduced ? 0 : 0.2 + i * 0.26, type: "spring", stiffness: 380, damping: 20 }}
                    style={{ transformOrigin: `${p[0]}px ${p[1]}px` }}
                  />
                ))}
              </motion.g>
            ) : (
              <motion.g key="circle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <motion.circle
                  cx={CIRCLE.cx}
                  cy={CIRCLE.cy}
                  fill="rgba(34,211,238,0.09)"
                  stroke="#22D3EE"
                  strokeWidth={1.75}
                  initial={{ r: 0 }}
                  animate={run ? { r: CIRCLE.r } : {}}
                  transition={{ duration: reduced ? 0 : 1.1, ease: [0.22, 1, 0.36, 1] }}
                />
                {/* Centre, and the radius the operator dragged out. */}
                <circle cx={CIRCLE.cx} cy={CIRCLE.cy} r={3.5} fill="#22D3EE" />
                <motion.line
                  x1={CIRCLE.cx}
                  y1={CIRCLE.cy}
                  x2={CIRCLE.cx + CIRCLE.r}
                  y2={CIRCLE.cy}
                  stroke="#22D3EE"
                  strokeWidth={1}
                  strokeDasharray="3 3"
                  initial={{ opacity: 0 }}
                  animate={run ? { opacity: 0.8 } : {}}
                  transition={{ delay: reduced ? 0 : 0.9 }}
                />
                <motion.text
                  x={CIRCLE.cx + CIRCLE.r / 2}
                  y={CIRCLE.cy - 9}
                  textAnchor="middle"
                  className="fill-accent font-mono"
                  style={{ fontSize: 10, letterSpacing: "0.1em" }}
                  initial={{ opacity: 0 }}
                  animate={run ? { opacity: 1 } : {}}
                  transition={{ delay: reduced ? 0 : 1.05 }}
                >
                  850 m
                </motion.text>
              </motion.g>
            )}
          </AnimatePresence>

          {/* A vehicle sitting inside the zone. */}
          <g transform="translate(176 148)">
            <circle r="16" fill="rgba(22,217,126,0.14)" />
            <path d="M 0 -7 L 5.2 6 L 0 3.2 L -5.2 6 Z" fill="#16D97E" />
          </g>
        </svg>
      </div>

      <div className="border-t border-border bg-surface-2 px-6 py-5">
        <p className="eyebrow">Stored as</p>
        <p className="mt-2 break-all font-mono text-[0.6875rem] leading-relaxed text-accent">{active.wkt}</p>
        <p className="mt-3 text-sm text-muted-foreground">{active.body}</p>
      </div>
    </div>
  );
}
