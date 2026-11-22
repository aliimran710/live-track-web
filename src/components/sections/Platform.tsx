import { Section, SectionTitle, SectionLead, WaypointEyebrow, Reveal } from "@/components/layout/Section";
import { PLATFORM } from "@/lib/content";

export function Platform() {
  return (
    <Section id="platform" className="bg-surface-1/40">
      <Reveal>
        <WaypointEyebrow id="platform" />
        <SectionTitle>{PLATFORM.title}</SectionTitle>
        <SectionLead>{PLATFORM.lead}</SectionLead>
      </Reveal>

      <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-20">
        <Reveal>
          <dl className="divide-y divide-border border-y border-border">
            {PLATFORM.specs.map((spec) => (
              <div key={spec.k} className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1 py-4">
                <dt className="eyebrow">{spec.k}</dt>
                <dd className="font-mono text-sm text-foreground">{spec.v}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="rounded-md border border-border bg-surface-1 p-7 md:p-8">
            <h3 className="font-display text-xl font-semibold">{PLATFORM.dashboard.title}</h3>

            <p className="eyebrow mt-7">Counters</p>
            <ul className="mt-3 grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-border bg-border sm:grid-cols-3">
              {PLATFORM.dashboard.kpis.map((kpi) => (
                <li key={kpi} className="bg-surface-2 px-3 py-3 text-center text-xs text-muted-foreground">
                  {kpi}
                </li>
              ))}
            </ul>

            <p className="eyebrow mt-7">Charts</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {PLATFORM.dashboard.charts.map((chart) => (
                <li
                  key={chart}
                  className="rounded-md border border-border px-3 py-1.5 font-mono text-[0.625rem] uppercase tracking-eyebrow text-muted-foreground"
                >
                  {chart}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
