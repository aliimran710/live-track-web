import { Section, SectionTitle, SectionLead, WaypointEyebrow, Reveal } from "@/components/layout/Section";
import { CommandConsole } from "@/components/figures/CommandConsole";
import { CONTROL, STATUS_HEX } from "@/lib/content";

export function Control() {
  return (
    <Section id="control">
      <Reveal>
        <WaypointEyebrow id="control" />
        <SectionTitle>{CONTROL.title}</SectionTitle>
        <SectionLead>{CONTROL.lead}</SectionLead>
      </Reveal>

      <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start lg:gap-20">
        <Reveal>
          <ul className="space-y-px overflow-hidden rounded-md border border-border bg-border">
            {CONTROL.commands.map((cmd) => (
              <li key={cmd.name} className="flex gap-5 bg-surface-1 p-7">
                <span
                  aria-hidden
                  className="mt-1.5 h-9 w-1 shrink-0 rounded-full"
                  style={{ background: STATUS_HEX[cmd.tone] }}
                />
                <div>
                  <p className="font-display text-base font-semibold text-foreground">{cmd.name}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{cmd.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.08}>
          <CommandConsole />
        </Reveal>
      </div>
    </Section>
  );
}
