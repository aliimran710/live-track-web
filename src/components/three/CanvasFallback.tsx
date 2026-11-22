/**
 * Shown instead of a WebGL scene when the visitor has asked for reduced
 * motion, or when the browser cannot give us a context. It is the same
 * territory drawn flat: a grid, a route, a pin and a zone.
 */
export function CanvasFallback({ label }: { label: string }) {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="graticule absolute inset-0 opacity-70" />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 600 460" role="img" aria-label={label}>
        <defs>
          <linearGradient id="fbRoute" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#22D3EE" stopOpacity="0.15" />
            <stop offset="0.6" stopColor="#22D3EE" stopOpacity="1" />
            <stop offset="1" stopColor="#22D3EE" stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* City blocks, flattened to an isometric plan. */}
        {Array.from({ length: 5 }).map((_, r) =>
          Array.from({ length: 7 }).map((_, c) => (
            <rect
              key={`${r}-${c}`}
              x={48 + c * 76}
              y={76 + r * 68}
              width={54}
              height={46}
              rx={2}
              fill="currentColor"
              className="text-muted-foreground"
              opacity={0.1 + ((r + c) % 3) * 0.045}
            />
          )),
        )}

        <path
          d="M 54 388 L 196 388 L 196 254 L 348 254 L 348 150 L 492 150"
          fill="none"
          stroke="url(#fbRoute)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <circle cx="348" cy="254" r="40" fill="rgba(34,211,238,0.07)" stroke="#22D3EE" strokeWidth="1" strokeDasharray="4 4" />

        {/* The car, at the head of the route. Same saloon silhouette the
            WebGL scene extrudes, drawn side-on so the two views match. */}
        <g transform="translate(492 150)">
          <ellipse cx="0" cy="17" rx="38" ry="5" fill="#22D3EE" opacity="0.25" />
          <path
            d="M -34 10 L -37 2 Q -38 -5 -31 -6 L -19 -7 Q -8 -19 4 -20 L 16 -20 Q 26 -19 31 -7 L 36 -5 Q 39 -3 38 4 L 36 10 Z"
            fill="#22D3EE"
          />
          <path d="M -17 -8 Q -8 -17 3 -17 L 3 -8 Z M 7 -17 L 15 -17 Q 23 -16 27 -8 L 7 -8 Z" fill="#04003A" opacity="0.72" />
          <circle cx="-20" cy="10" r="7" fill="#04003A" />
          <circle cx="-20" cy="10" r="3" fill="#22D3EE" />
          <circle cx="22" cy="10" r="7" fill="#04003A" />
          <circle cx="22" cy="10" r="3" fill="#22D3EE" />
          <rect x="34" y="-2" width="5" height="4" rx="1.5" fill="#FFF4D6" />
          <rect x="-39" y="-1" width="4" height="4" rx="1.5" fill="#FF4D5E" />
        </g>
      </svg>
    </div>
  );
}
