import { Section, SectionTitle, SectionLead, WaypointEyebrow, Reveal } from "@/components/layout/Section";
import { WHY, STATUS_HEX } from "@/lib/content";

export function Why() {
  return (
    <Section id="why">
      <Reveal>
        <WaypointEyebrow id="why" />
        <SectionTitle>{WHY.title}</SectionTitle>
        <SectionLead>{WHY.lead}</SectionLead>
      </Reveal>

      <ul className="mt-16 grid gap-px overflow-hidden rounded-md border border-border bg-border md:grid-cols-2">
        {WHY.questions.map((item, i) => (
          <li key={item.q} className="bg-surface-1">
            <Reveal delay={i * 0.06} className="h-full">
              <div className="group flex h-full flex-col gap-4 p-7 transition-colors duration-200 hover:bg-surface-2 md:p-9">
                <span
                  aria-hidden
                  className="h-1 w-10 rounded-full transition-all duration-300 group-hover:w-16"
                  style={{ background: STATUS_HEX[item.status] }}
                />
                <p className="font-display text-lg font-semibold leading-snug text-foreground md:text-xl">
                  {item.q}
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.a}</p>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  );
}
