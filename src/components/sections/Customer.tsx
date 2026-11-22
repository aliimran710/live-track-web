import { Section, SectionTitle, SectionLead, WaypointEyebrow, Reveal } from "@/components/layout/Section";
import { CUSTOMER, STATUS_HEX } from "@/lib/content";

export function Customer() {
  return (
    <Section id="customer" className="bg-surface-1/40">
      <Reveal>
        <WaypointEyebrow id="customer" />
        <SectionTitle>{CUSTOMER.title}</SectionTitle>
        <SectionLead>{CUSTOMER.lead}</SectionLead>
      </Reveal>

      <ul className="mt-14 grid gap-px overflow-hidden rounded-md border border-border bg-border lg:grid-cols-3">
        {CUSTOMER.channels.map((channel, i) => (
          <li key={channel.name} className="bg-surface-1">
            <Reveal delay={i * 0.06} className="h-full">
              <div className="flex h-full flex-col p-7 md:p-8">
                <h3 className="font-display text-lg font-semibold text-foreground">{channel.name}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{channel.body}</p>

                {/* What the customer or the operator actually sees. */}
                <pre className="mt-7 flex-1 whitespace-pre-wrap rounded-sm border border-border bg-surface-2 p-4 font-mono text-[0.6875rem] leading-relaxed text-muted-foreground">
                  {channel.sample}
                </pre>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>

      <Reveal delay={0.1}>
        <dl className="mt-10 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3">
          {CUSTOMER.complaintStates.map((state) => (
            <div key={state.name} className="flex items-center gap-4 bg-surface-1 p-6">
              <span aria-hidden className="size-2.5 rounded-full" style={{ background: STATUS_HEX[state.tone] }} />
              <dt className="eyebrow">{state.name}</dt>
              <dd className="ml-auto font-mono text-xl font-medium tabular-nums text-foreground">{state.count}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </Section>
  );
}
