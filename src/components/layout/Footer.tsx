import { Logo } from "./Logo";
import { FOOTER } from "@/lib/content";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface-1 lg:pl-[72px]">
      <div className="container grid gap-12 py-16 md:grid-cols-[1.4fr_repeat(3,1fr)] md:py-20">
        <div>
          <Logo height={34} />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">{FOOTER.blurb}</p>
        </div>

        {FOOTER.columns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <p className="eyebrow">{col.title}</p>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((link) => (
                <li key={link}>
                  <span className="text-sm text-muted-foreground">{link}</span>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-border">
        <div className="container flex flex-col gap-2 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="eyebrow">
            {new Date().getFullYear()} · {FOOTER.legal}
          </p>
          <p className="eyebrow">30.3384, 71.2781 · Asia/Karachi</p>
        </div>
      </div>
    </footer>
  );
}
