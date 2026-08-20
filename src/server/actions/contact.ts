'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { Resend } from 'resend';
import { createClient } from '@/lib/supabase/server';

export interface ContactFormState {
  status: 'idle' | 'success' | 'error';
  message: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_MAX_LENGTH = 120;
const SUBJECT_MAX_LENGTH = 200;
const MESSAGE_MIN_LENGTH = 10;
const MESSAGE_MAX_LENGTH = 5000;

// Where notification emails go. Sent from Resend's shared
// onboarding@resend.dev address for now — swap to a verified custom
// domain sender later (Resend requires a verified domain to send from
// anything else).
const NOTIFICATION_RECIPIENT = 'mmshahidullah103@gmail.com';
const NOTIFICATION_SENDER = 'Amar Portfolio <onboarding@resend.dev>';

// --- Rate limiting -----------------------------------------------------
// Basic in-memory per-IP limiter: no extra service, "good enough" per the
// brief. Known limitations, both fine for a single-instance deployment:
//   - Resets on server restart (the Map is just in process memory).
//   - Doesn't share state across multiple server instances/regions.
// Upgrade to something like Upstash Redis if this ever needs to be
// bulletproof (e.g. multi-instance serverless).
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 3;
const submissionTimestamps = new Map<string, number[]>();

async function isRateLimited(): Promise<boolean> {
  const headersList = await headers();
  const identifier =
    headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headersList.get('x-real-ip') ||
    'unknown';

  const now = Date.now();
  const recent = (submissionTimestamps.get(identifier) ?? []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS
  );

  if (recent.length >= RATE_LIMIT_MAX_REQUESTS) {
    submissionTimestamps.set(identifier, recent);
    return true;
  }

  recent.push(now);
  submissionTimestamps.set(identifier, recent);
  return false;
}

/**
 * Contact form submission. Designed for React's useActionState:
 *   const [state, formAction] = useActionState(submitContactForm, { status: 'idle', message: '' });
 */
export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  // Honeypot: a real visitor never sees or fills this field (visually
  // hidden, tabIndex -1). A bot that fills every field it finds will trip
  // it. Report success without doing anything, so the bot doesn't learn
  // its submission was rejected.
  const honeypot = String(formData.get('company_website') ?? '').trim();
  if (honeypot !== '') {
    return {
      status: 'success',
      message: "Thanks! I'll get back to you soon.",
    };
  }

  const name = String(formData.get('name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const subject = String(formData.get('subject') ?? '').trim();
  const message = String(formData.get('message') ?? '').trim();

  // Server-side validation - never trust the client's HTML5 `required`/
  // `minLength` alone, those are trivially bypassed.
  if (!name || name.length > NAME_MAX_LENGTH) {
    return {
      status: 'error',
      message: `Please enter your name (max ${NAME_MAX_LENGTH} characters).`,
    };
  }
  if (!email || !EMAIL_REGEX.test(email)) {
    return { status: 'error', message: 'Please enter a valid email address.' };
  }
  if (subject.length > SUBJECT_MAX_LENGTH) {
    return {
      status: 'error',
      message: `Subject is too long (max ${SUBJECT_MAX_LENGTH} characters).`,
    };
  }
  if (!message || message.length < MESSAGE_MIN_LENGTH) {
    return {
      status: 'error',
      message: `Please enter a message of at least ${MESSAGE_MIN_LENGTH} characters.`,
    };
  }
  if (message.length > MESSAGE_MAX_LENGTH) {
    return {
      status: 'error',
      message: `Message is too long (max ${MESSAGE_MAX_LENGTH} characters).`,
    };
  }

  if (await isRateLimited()) {
    return {
      status: 'error',
      message:
        "You're submitting a bit too quickly — please wait a minute and try again.",
    };
  }

  const supabase = await createClient();
  const { error: insertError } = await supabase
    .from('contact_messages')
    .insert({
      name,
      email,
      subject: subject || null,
      message,
    });

  if (insertError) {
    console.error('[contact] Supabase insert failed:', insertError);
    return {
      status: 'error',
      message:
        'Something went wrong saving your message. Please try again in a moment.',
    };
  }

  // Best-effort email notification. The message is already safely in the
  // database at this point, so a Resend failure must NOT surface as an
  // error to the visitor — just log it server-side to notice later.
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    console.error(
      '[contact] RESEND_API_KEY is not set - skipping email notification. The message was still saved to the database.'
    );
  } else {
    try {
      const resend = new Resend(resendApiKey);
      const { error: emailError } = await resend.emails.send({
        from: NOTIFICATION_SENDER,
        to: NOTIFICATION_RECIPIENT,
        replyTo: email,
        subject: `New contact form message${subject ? `: ${subject}` : ''}`,
        text: `From: ${name} <${email}>\nSubject: ${subject || '(none)'}\n\n${message}`,
      });
      if (emailError) {
        console.error('[contact] Resend email failed:', emailError);
      }
    } catch (err) {
      console.error('[contact] Resend email threw an exception:', err);
    }
  }

  return {
    status: 'success',
    message: "Thanks! I'll get back to you soon.",
  };
}

/**
 * Admin-only: marks a contact message as read. Relies entirely on RLS
 * (`contact_messages_update_admin_editor`) for authorization - if called
 * by a non-admin/editor session, the UPDATE simply matches zero rows.
 */
export async function markContactMessageAsRead(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('contact_messages')
    .update({ is_read: true })
    .eq('id', id);

  if (error) {
    console.error('[contact] Failed to mark message as read:', error);
    return;
  }

  revalidatePath('/admin/messages');
}
