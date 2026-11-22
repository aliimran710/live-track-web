import * as React from "react";
import { useInView, useReducedMotion } from "framer-motion";

/**
 * Counts to a value once, when it first comes into view. Decimals are kept
 * because one of the hero figures is 0.05 seconds and rounding would lie.
 */
export function CountUp({
  value,
  suffix = "",
  decimals,
  duration = 1100,
  className,
}: {
  value: number;
  suffix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduced = useReducedMotion();
  const places = decimals ?? (Number.isInteger(value) ? 0 : 2);
  const [shown, setShown] = React.useState(reduced ? value : 0);

  React.useEffect(() => {
    if (!inView || reduced) {
      if (reduced) setShown(value);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      // Ease out: fast first, settles on the number.
      const eased = 1 - Math.pow(1 - t, 3);
      setShown(value * eased);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduced, value, duration]);

  return (
    <span ref={ref} className={className}>
      {shown.toLocaleString("en-US", {
        minimumFractionDigits: places,
        maximumFractionDigits: places,
      })}
      {suffix}
    </span>
  );
}
