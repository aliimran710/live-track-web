import { useTheme } from "./ThemeProvider";
import { cn } from "@/lib/utils";

/**
 * The Live Track lockup: a map pin holding a navigation arrow, beside the
 * wordmark. Two assets, one per theme — white on the navy canvas, black on
 * paper. The artwork is 2170 x 725, so the box is reserved at that ratio to
 * keep the header from shifting while the image loads.
 */
const ASPECT = 2170 / 725;

export function Logo({ className, height = 32 }: { className?: string; height?: number }) {
  const { theme } = useTheme();
  const src = theme === "dark" ? "/brand/dark-theme.png" : "/brand/light-theme.png";

  return (
    <img
      src={src}
      alt="Live Track"
      width={Math.round(height * ASPECT)}
      height={height}
      style={{ height, width: "auto" }}
      className={cn("select-none", className)}
      draggable={false}
    />
  );
}
