import { Section, SectionTitle, SectionLead, WaypointEyebrow, Reveal } from "@/components/layout/Section";
import { GeofenceDraw } from "@/components/figures/GeofenceDraw";
import { GEOFENCING } from "@/lib/content";

export function Geofencing() {
  return (
    <Section id="geofencing" className="bg-surface-1/40">
      <Reveal>
        <WaypointEyebrow id="geofencing" />
        <SectionTitle>{GEOFENCING.title}</SectionTitle>
        <SectionLead>{GEOFENCING.lead}</SectionLead>
      </Reveal>

      <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-20">
        <Reveal>
          <GeofenceDraw />
        </Reveal>

        <Reveal delay={0.08}>
          <ol className="space-y-px overflow-hidden rounded-md border border-border bg-border">
            {GEOFENCING.steps.map((step, i) => (
              <li key={step.name} className="flex gap-5 bg-surface-1 p-7">
                <span className="mt-0.5 font-mono text-[0.6875rem] tracking-eyebrow text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="font-display text-base font-semibold text-foreground">{step.name}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </Section>
  );
}
