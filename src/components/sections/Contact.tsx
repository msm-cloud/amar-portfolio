'use client';

import { useActionState, useState, type ChangeEvent } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { Input } from '@/components/ui/Input';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SubmitButton } from '@/components/ui/SubmitButton';
import { Textarea } from '@/components/ui/Textarea';
import { fadeInUp } from '@/lib/animations';
import {
  submitContactForm,
  type ContactFormState,
} from '@/server/actions/contact';

const initialState: ContactFormState = { status: 'idle', message: '' };

interface FormValues {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const emptyFormValues: FormValues = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

export function Contact() {
  const shouldReduceMotion = useReducedMotion();
  const [state, formAction] = useActionState(submitContactForm, initialState);

  // Controlled, not uncontrolled defaultValue/name-only inputs: React's
  // <form action={...}> resets uncontrolled fields once the action
  // completes, regardless of whether it succeeded or failed (confirmed
  // live - fields were empty after a server-validation error, not
  // retained as intended). Keeping our own state and passing it as
  // `value` is what actually satisfies "keep the form data intact on
  // failure" - React can't reset a value it doesn't own.
  const [formValues, setFormValues] = useState<FormValues>(emptyFormValues);

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <SectionContainer id="contact">
      <SectionHeading
        eyebrow="Contact"
        title="Let's Work Together"
        description="Have a project in mind, or just want to say hello? Send a message and I'll get back to you soon."
      />

      <motion.div
        variants={fadeInUp}
        initial={shouldReduceMotion ? 'visible' : 'hidden'}
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        <GlassCard className="mx-auto max-w-xl">
          {state.status === 'success' ? (
            <div className="py-6 text-center">
              <h3 className="text-lg font-semibold text-foreground">
                Message sent
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {state.message}
              </p>
            </div>
          ) : (
            <form action={formAction} className="relative flex flex-col gap-4">
              {/* Honeypot: invisible to real users (off-screen, unreachable
                  by keyboard nav, unlabeled to screen readers), but a bot
                  that blindly fills every input it finds will trip it.
                  Left uncontrolled on purpose - nothing depends on this
                  field surviving a reset. */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -left-[9999px] h-px w-px overflow-hidden"
              >
                <label htmlFor="company_website">Leave this field empty</label>
                <input
                  type="text"
                  id="company_website"
                  name="company_website"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <Input
                label="Name"
                name="name"
                type="text"
                autoComplete="name"
                required
                maxLength={120}
                value={formValues.name}
                onChange={handleChange}
              />
              <Input
                label="Email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formValues.email}
                onChange={handleChange}
              />
              <Input
                label="Subject (optional)"
                name="subject"
                type="text"
                autoComplete="off"
                maxLength={200}
                value={formValues.subject}
                onChange={handleChange}
              />
              <Textarea
                label="Message"
                name="message"
                required
                minLength={10}
                maxLength={5000}
                rows={5}
                value={formValues.message}
                onChange={handleChange}
              />

              {state.status === 'error' && (
                <p
                  role="alert"
                  className="text-sm text-red-600 dark:text-red-400"
                >
                  {state.message}
                </p>
              )}

              <SubmitButton pendingChildren="Sending…" className="mt-2 w-full">
                Send Message
              </SubmitButton>
            </form>
          )}
        </GlassCard>
      </motion.div>
    </SectionContainer>
  );
}
