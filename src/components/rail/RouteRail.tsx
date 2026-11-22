import * as React from "react";
import { useScroll, useMotionValueEvent, useReducedMotion } from "framer-motion";

import { WAYPOINTS, STATUS_HEX, statusInk } from "@/lib/content";
import { useActiveSection } from "@/lib/useActiveSection";

const RAIL_W = 72;

/* Two zones the vehicle passes through, as fractions of the route. */
const ZONES = [0.37, 0.72];

/**
 * The route the page is built on.
 *
 * A meandering track down the left edge, drawn as the visitor scrolls, with
 * a vehicle marker riding it. The marker is rotated to the path tangent —
 * the same thing the operator panel does with its live heading. Waypoint
 * dots sit at each section and light up in that section colour.
 *
 * The viewBox matches the measured pixel height, so nothing is stretched
 * and every point can be sampled straight off the rendered path.
 */
function buildPath(height: number): string {
  const cx = RAIL_W / 2;
  const amp = 15;
  const segs = 11;
  const step = height / segs;

  let d = `M ${cx} 0`;
  for (let i = 0; i < segs; i++) {
    const y0 = i * step;
    const y1 = y0 + step;
    // Alternate the bulge so the track reads as a road, not a sine wave.
    const dir = i % 2 === 0 ? 1 : -1;
    const lean = i % 3 === 0 ? 0.62 : 1;
    d += ` C ${cx + amp * dir * lean} ${y0 + step * 0.3}, ${cx + amp * dir * lean} ${y1 - step * 0.3}, ${cx} ${y1}`;
  }
  return d;
}

type Pt = { x: number; y: number };

export function RouteRail() {
  const ids = React.useMemo(() => WAYPOINTS.map((w) => w.id), []);
  const active = useActiveSection(ids);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();

  const hostRef = React.useRef<HTMLDivElement>(null);
  const pathRef = React.useRef<SVGPathElement>(null);
  const markerRef = React.useRef<SVGGElement>(null);
  const zoneRefs = React.useRef<(SVGCircleElement | null)[]>([]);

  const [height, setHeight] = React.useState(0);
  const [length, setLength] = React.useState(0);
  const [stops, setStops] = React.useState<Pt[]>([]);
  const [zones, setZones] = React.useState<Pt[]>([]);

  const pathD = React.useMemo(() => (height ? buildPath(height) : ""), [height]);

  React.useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const ro = new ResizeObserver(([entry]) => setHeight(entry.contentRect.height));
    ro.observe(host);
    setHeight(host.getBoundingClientRect().height);
    return () => ro.disconnect();
  }, []);

  // Sample the rendered path once it exists: waypoints, zones, total length.
  React.useLayoutEffect(() => {
    const path = pathRef.current;
    if (!path || !pathD) return;
    const total = path.getTotalLength();
    setLength(total);
    setStops(
      WAYPOINTS.map((_, i) => {
        const p = path.getPointAtLength((i / (WAYPOINTS.length - 1)) * total);
        return { x: p.x, y: p.y };
      }),
    );
    setZones(
      ZONES.map((z) => {
        const p = path.getPointAtLength(z * total);
        return { x: p.x, y: p.y };
      }),
    );
  }, [pathD]);

  const place = React.useCallback(
    (p: number) => {
      const path = pathRef.current;
      const marker = markerRef.current;
      if (!path || !marker || !length) return;

      const t = Math.min(Math.max(p, 0), 1);
      const at = path.getPointAtLength(t * length);
      // Tangent from a short lookahead: this is the vehicle heading.
      const ahead = path.getPointAtLength(Math.min(t * length + 2, length));
      const angle = (Math.atan2(ahead.y - at.y, ahead.x - at.x) * 180) / Math.PI + 90;

      marker.setAttribute("transform", `translate(${at.x} ${at.y}) rotate(${angle})`);
      path.style.strokeDashoffset = String(length * (1 - t));

      ZONES.forEach((z, i) => {
        const node = zoneRefs.current[i];
        if (!node) return;
        const inside = Math.abs(t - z) < 0.035;
        node.style.opacity = inside ? "1" : "0.3";
        node.style.transform = inside ? "scale(1.3)" : "scale(1)";
      });
    },
    [length],
  );

  useMotionValueEvent(scrollYProgress, "change", place);

  React.useEffect(() => {
    if (!length) return;
    place(reduced ? 1 : scrollYProgress.get());
  }, [length, place, reduced, scrollYProgress]);

  const activeWp = WAYPOINTS.find((w) => w.id === active) ?? WAYPOINTS[0];
  const activeColor = STATUS_HEX[activeWp.status];

  return (
    <div
      ref={hostRef}
      aria-hidden
      className="pointer-events-none fixed inset-y-0 left-0 z-40 hidden w-[72px] border-r border-border bg-background/40 backdrop-blur-[2px] lg:block"
    >
      <div className="graticule-fine absolute inset-0 opacity-60" />

      {pathD && (
        <svg className="absolute inset-0" width={RAIL_W} height={height} viewBox={`0 0 ${RAIL_W} ${height}`}>
          {/* Ghost of the full route: the road exists before you drive it. */}
          <path d={pathD} fill="none" stroke="hsl(var(--border))" strokeWidth={1.5} />

          {/* The travelled portion. */}
          <path
            ref={pathRef}
            d={pathD}
            fill="none"
            stroke={activeColor}
            strokeWidth={2.25}
            strokeLinecap="round"
            style={{
              strokeDasharray: length || undefined,
              strokeDashoffset: length || undefined,
              transition: "stroke 400ms ease",
              filter: `drop-shadow(0 0 5px ${activeColor}66)`,
            }}
          />

          {zones.map((pt, i) => (
            <circle
              key={ZONES[i]}
              ref={(el) => {
                zoneRefs.current[i] = el;
              }}
              cx={pt.x}
              cy={pt.y}
              r={11}
              fill="rgba(34,211,238,0.08)"
              stroke="#22D3EE"
              strokeWidth={1}
              strokeDasharray="3 3"
              style={{
                opacity: 0.3,
                transformOrigin: `${pt.x}px ${pt.y}px`,
                transition: "opacity 300ms ease, transform 300ms ease",
              }}
            />
          ))}

          {stops.map((pt, i) => {
            const w = WAYPOINTS[i];
            const on = w.id === active;
            return (
              <g key={w.id}>
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={on ? 4 : 2.5}
                  fill={on ? STATUS_HEX[w.status] : "hsl(var(--border))"}
                  style={{ transition: "r 250ms ease, fill 250ms ease" }}
                />
                {on && (
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={4}
                    fill="none"
                    stroke={STATUS_HEX[w.status]}
                    strokeWidth={1}
                    className="animate-pulse-ring"
                    style={{ transformOrigin: `${pt.x}px ${pt.y}px` }}
                  />
                )}
              </g>
            );
          })}

          {/* The vehicle. A chevron, because heading is the point. */}
          <g ref={markerRef}>
            <path
              d="M 0 -7 L 5.2 6 L 0 3.2 L -5.2 6 Z"
              fill={activeColor}
              style={{ transition: "fill 400ms ease", filter: `drop-shadow(0 0 6px ${activeColor})` }}
            />
          </g>
        </svg>
      )}

      {/* Live readout, set vertically so it fits the 72px rail. */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2" style={{ writingMode: "vertical-rl" }}>
        <span className="eyebrow whitespace-nowrap" style={{ color: statusInk(activeWp.status) }}>
          {activeWp.coord} · {activeWp.stamp} PKT · {activeWp.speed} km/h
        </span>
      </div>
    </div>
  );
}

/**
 * The mobile route: a hairline at the viewport edge that fills with scroll.
 */
export function RouteRailMobile() {
  const { scrollYProgress } = useScroll();
  const barRef = React.useRef<HTMLDivElement>(null);
  const ids = React.useMemo(() => WAYPOINTS.map((w) => w.id), []);
  const active = useActiveSection(ids);
  const color = STATUS_HEX[(WAYPOINTS.find((w) => w.id === active) ?? WAYPOINTS[0]).status];

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (barRef.current) barRef.current.style.transform = `scaleY(${Math.min(Math.max(p, 0), 1)})`;
  });

  return (
    <div aria-hidden className="pointer-events-none fixed inset-y-0 left-0 z-40 w-[3px] bg-border lg:hidden">
      <div
        ref={barRef}
        className="h-full w-full origin-top"
        style={{ background: color, transform: "scaleY(0)", transition: "background 400ms ease" }}
      />
    </div>
  );
}
