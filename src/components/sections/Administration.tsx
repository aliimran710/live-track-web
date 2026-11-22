import { Check } from "lucide-react";

import { Section, SectionTitle, SectionLead, WaypointEyebrow, Reveal } from "@/components/layout/Section";
import { ADMIN } from "@/lib/content";

export function Administration() {
  return (
    <Section id="admin">
      <Reveal>
        <WaypointEyebrow id="admin" />
        <SectionTitle>{ADMIN.title}</SectionTitle>
        <SectionLead>{ADMIN.lead}</SectionLead>
      </Reveal>

      <div className="mt-14 grid gap-px overflow-hidden rounded-md border border-border bg-border lg:grid-cols-3">
        {ADMIN.groups.map((group, i) => (
          <div key={group.name} className="bg-surface-1">
            <Reveal delay={i * 0.06} className="h-full">
              <div className="h-full p-7 md:p-8">
                <h3 className="font-display text-lg font-semibold text-foreground">{group.name}</h3>
                <ul className="mt-6 space-y-3.5">
                  {group.items.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                      <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-accent" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        ))}
      </div>

      <Reveal delay={0.1}>
        <dl className="mt-10 flex flex-wrap gap-3">
          {ADMIN.session.map((item) => (
            <div
              key={item.label}
              className="flex items-baseline gap-3 rounded-md border border-border px-4 py-2.5"
            >
              <dt className="eyebrow">{item.label}</dt>
              <dd className="font-mono text-xs text-foreground">{item.value}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </Section>
  );
}
