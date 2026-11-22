import { Section, SectionTitle, SectionLead, WaypointEyebrow, Reveal } from "@/components/layout/Section";
import { TripCacheRace } from "@/components/figures/TripCacheRace";
import { REPORTS } from "@/lib/content";

export function Reports() {
  return (
    <Section id="reports" className="bg-surface-1/40">
      <Reveal>
        <WaypointEyebrow id="reports" />
        <SectionTitle>{REPORTS.title}</SectionTitle>
        <SectionLead>{REPORTS.lead}</SectionLead>
      </Reveal>

      <ul className="mt-14 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {REPORTS.types.map((type, i) => (
          <li key={type.name} className="bg-surface-1">
            <Reveal delay={i * 0.04} className="h-full">
              <div className="group h-full p-6 transition-colors duration-200 hover:bg-surface-2">
                <p className="font-mono text-[0.6875rem] tracking-eyebrow text-accent">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <p className="mt-3 font-display text-base font-semibold text-foreground">{type.name}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{type.body}</p>
              </div>
            </Reveal>
          </li>
        ))}
        {/* Seven types into a four-column grid leaves one cell; fill it so
            the hairline grid does not end on a bare strip of border. */}
        <li aria-hidden className="hidden bg-surface-1 lg:block" />
      </ul>

      <div className="mt-14 grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <Reveal>
          <TripCacheRace />
        </Reveal>

        <div className="grid gap-8">
          <Reveal delay={0.08}>
            {/* The PDF, drawn as the document it produces. */}
            <div className="rounded-md border border-border bg-surface-1 p-7">
              <h3 className="font-display text-xl font-semibold">{REPORTS.pdf.title}</h3>
              <div className="mt-6 overflow-hidden rounded-sm border border-border">
                <div className="bg-surface-2 px-4 py-2.5">
                  <p className="font-mono text-[0.625rem] uppercase tracking-eyebrow text-foreground">
                    LIVE TRACK VEHICLE REPORT
                  </p>
                  <p className="eyebrow mt-1">13-11-2026 · 14-11-2026</p>
                </div>
                <ul className="divide-y divide-border">
                  {REPORTS.pdf.columns.map((col) => (
                    <li key={col} className="flex items-center justify-between px-4 py-2">
                      <span className="font-mono text-[0.625rem] uppercase tracking-eyebrow text-muted-foreground">
                        {col}
                      </span>
                      <span aria-hidden className="h-px w-16 bg-border" />
                    </li>
                  ))}
                </ul>
              </div>
              <p className="mt-5 text-sm text-muted-foreground">{REPORTS.pdf.note}</p>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="rounded-md border border-border bg-surface-1 p-7">
              <h3 className="font-display text-xl font-semibold">{REPORTS.playback.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{REPORTS.playback.body}</p>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
