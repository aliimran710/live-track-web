import * as React from "react";
import { useForm } from "react-hook-form";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

import { Section, SectionTitle, SectionLead, WaypointEyebrow, Reveal } from "@/components/layout/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CONTACT } from "@/lib/content";

type Values = {
  name: string;
  company: string;
  phone: string;
  fleet: string;
  message: string;
};

/**
 * Five rules, written out rather than pulled from a schema library: a
 * validator this small does not justify 25 KB on a marketing page.
 * Each message says what to do, not what went wrong.
 */
const RULES: Record<keyof Values, { min: number; message: string }> = {
  name: { min: 2, message: "Tell us who to ask for." },
  company: { min: 2, message: "Which company is this for?" },
  phone: { min: 7, message: "We need a number we can call." },
  fleet: { min: 1, message: "Roughly how many vehicles?" },
  message: { min: 10, message: "A sentence about what you track is enough." },
};

const rule = (key: keyof Values) => ({
  required: RULES[key].message,
  validate: (v: string) => v.trim().length >= RULES[key].min || RULES[key].message,
});

export function Contact() {
  const [sent, setSent] = React.useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ mode: "onBlur" });

  const onSubmit = async (_values: Values) => {
    // TODO: point this at the Live Track lead endpoint. Until then the
    // form validates and confirms locally, and nothing is transmitted.
    await new Promise((r) => setTimeout(r, 650));
    setSent(true);
  };

  const f = CONTACT.fields;

  return (
    <Section id="contact">
      <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-20">
        <Reveal>
          <WaypointEyebrow id="contact" />
          <SectionTitle>{CONTACT.title}</SectionTitle>
          <SectionLead>{CONTACT.lead}</SectionLead>

          <ul className="mt-10 space-y-4">
            {CONTACT.assurances.map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-accent" />
                {item}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="rounded-md border border-border bg-surface-1 p-7 md:p-9">
            {sent ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex min-h-[22rem] flex-col items-start justify-center"
                role="status"
              >
                <span className="flex size-11 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  <Check className="size-5" />
                </span>
                <p className="mt-6 font-display text-xl font-semibold">{CONTACT.success}</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-5 sm:grid-cols-2">
                <Field id="name" label={f.name.label} placeholder={f.name.placeholder} error={errors.name?.message} {...register("name", rule("name"))} />
                <Field id="company" label={f.company.label} placeholder={f.company.placeholder} error={errors.company?.message} {...register("company", rule("company"))} />
                <Field id="phone" label={f.phone.label} placeholder={f.phone.placeholder} inputMode="tel" error={errors.phone?.message} {...register("phone", rule("phone"))} />
                <Field id="fleet" label={f.fleet.label} placeholder={f.fleet.placeholder} inputMode="numeric" error={errors.fleet?.message} {...register("fleet", rule("fleet"))} />

                <div className="sm:col-span-2">
                  <Label htmlFor="message" className="eyebrow">
                    {f.message.label}
                  </Label>
                  <Textarea
                    id="message"
                    rows={4}
                    placeholder={f.message.placeholder}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? "message-error" : undefined}
                    className="mt-2.5 resize-none bg-background"
                    {...register("message", rule("message"))}
                  />
                  {errors.message && (
                    <p id="message-error" className="mt-2 text-xs text-destructive">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                <Button type="submit" size="lg" disabled={isSubmitting} className="sm:col-span-2">
                  {isSubmitting ? "Sending…" : CONTACT.submit}
                </Button>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

type FieldProps = React.ComponentProps<typeof Input> & {
  id: string;
  label: string;
  error?: string;
};

const Field = React.forwardRef<HTMLInputElement, FieldProps>(({ id, label, error, ...props }, ref) => (
  <div>
    <Label htmlFor={id} className="eyebrow">
      {label}
    </Label>
    <Input
      id={id}
      ref={ref}
      aria-invalid={Boolean(error)}
      aria-describedby={error ? `${id}-error` : undefined}
      className="mt-2.5 bg-background"
      {...props}
    />
    {error && (
      <p id={`${id}-error`} className="mt-2 text-xs text-destructive">
        {error}
      </p>
    )}
  </div>
));
Field.displayName = "Field";
