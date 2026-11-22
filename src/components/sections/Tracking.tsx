import { Section, SectionTitle, SectionLead, WaypointEyebrow, Reveal } from "@/components/layout/Section";
import { StatusStrip } from "@/components/figures/StatusStrip";
import { TRACKING, statusInk } from "@/lib/content";

export function Tracking() {
  return (
    <Section id="tracking">
      <Reveal>
        <WaypointEyebrow id="tracking" />
        <SectionTitle>{TRACKING.title}</SectionTitle>
        <SectionLead>{TRACKING.lead}</SectionLead>
      </Reveal>

      <Reveal delay={0.08}>
        <div className="mt-14">
          <StatusStrip />
        </div>
      </Reveal>

      <div className="mt-24 grid gap-14 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-20">
        <Reveal>
          <h3 className="font-display text-2xl font-semibold">{TRACKING.map.title}</h3>
          <dl className="mt-8 grid gap-x-10 gap-y-7 sm:grid-cols-2">
            {TRACKING.map.items.map((item) => (
              <div key={item.name} className="border-t border-border pt-4">
                <dt className="font-display text-base font-semibold text-foreground">{item.name}</dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.body}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal delay={0.08}>
          {/* The expandable row from the vehicle list, as the operator sees it. */}
          <div className="rounded-md border border-border bg-surface-1">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <div>
                <p className="font-display text-base font-semibold">LES-4471</p>
                <p className="eyebrow mt-1">Teltonika · 352093081234567</p>
              </div>
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[0.625rem] uppercase tracking-eyebrow"
                style={{ background: "rgba(22,217,126,0.12)", color: statusInk("move") }}
              >
                <span aria-hidden className="size-1.5 rounded-full bg-current animate-blink" />
                Moving
              </span>
            </div>
            <dl className="grid grid-cols-2 gap-px bg-border">
              {TRACKING.readout.map((row) => (
                <div key={row.k} className="flex items-baseline justify-between gap-3 bg-surface-1 px-6 py-3.5">
                  <dt className="eyebrow">{row.k}</dt>
                  <dd className="font-mono text-sm tabular-nums text-foreground">{row.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>

      <Reveal>
        <div className="mt-24 border-t border-border pt-10">
          <h3 className="font-display text-2xl font-semibold">{TRACKING.search.title}</h3>
          <ul className="mt-7 flex flex-wrap gap-2.5">
            {TRACKING.search.fields.map((f) => (
              <li
                key={f}
                className="rounded-md border border-border px-3.5 py-2 font-mono text-[0.6875rem] uppercase tracking-eyebrow text-muted-foreground transition-colors duration-150 hover:border-accent hover:text-accent"
              >
                {f}
              </li>
            ))}
          </ul>
          <p className="mt-5 max-w-xl text-sm text-muted-foreground">{TRACKING.search.note}</p>
        </div>
      </Reveal>
    </Section>
  );
}
