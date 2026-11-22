import { Section, SectionTitle, SectionLead, WaypointEyebrow, Reveal } from "@/components/layout/Section";
import { EventFeed } from "@/components/figures/EventFeed";
import { ALERTS } from "@/lib/content";

export function Alerts() {
  return (
    <Section id="alerts">
      <Reveal>
        <WaypointEyebrow id="alerts" />
        <SectionTitle>{ALERTS.title}</SectionTitle>
        <SectionLead>{ALERTS.lead}</SectionLead>
      </Reveal>

      <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-20">
        <Reveal>
          <EventFeed />
        </Reveal>

        <Reveal delay={0.08}>
          <dl className="grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
            {ALERTS.rules.map((rule) => (
              <div key={rule.label} className="bg-surface-1 p-6">
                <dt className="eyebrow">{rule.label}</dt>
                <dd className="mt-2.5 font-display text-base font-semibold text-foreground">{rule.value}</dd>
                <dd className="mt-1.5 text-sm text-muted-foreground">{rule.note}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </Section>
  );
}
