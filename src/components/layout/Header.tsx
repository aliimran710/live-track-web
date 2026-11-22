import * as React from "react";
import { Menu } from "lucide-react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NAV } from "@/lib/content";
import { cn } from "@/lib/utils";

export function Header() {
  const [lifted, setLifted] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => setLifted(y > 24));

  return (
    <motion.header
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-200 lg:pl-[72px]",
        lifted && "border-b border-border bg-background/82 backdrop-blur-md",
      )}
    >
      <div className="container flex h-[72px] items-center justify-between gap-6">
        <a href="#hero" className="shrink-0 rounded-sm" aria-label="Live Track, back to top">
          <Logo height={44} />
        </a>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Sections">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-sm text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <a href="#contact">Request a demo</a>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Open menu"
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-muted-foreground lg:hidden"
              >
                <Menu className="size-4" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[82vw] max-w-sm border-border bg-background">
              <div className="mt-10 flex flex-col gap-1">
                {NAV.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="border-b border-border py-4 font-display text-xl text-foreground"
                  >
                    {item.label}
                  </a>
                ))}
                <Button asChild className="mt-8">
                  <a href="#contact" onClick={() => setOpen(false)}>
                    Request a demo
                  </a>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}
