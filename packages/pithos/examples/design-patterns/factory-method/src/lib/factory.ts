/**
 * Factory Method — Notification Factory.
 *
 * sendNotification(createNotif) never changes.
 * Only the factory parameter changes — that's the whole pattern.
 */

import type { AppNotification, ChannelKey } from "./types";

const SUBJECTS = ["Your order has shipped", "Weekly digest ready", "Password reset requested", "New comment on your post", "Invoice #4821 available", "Deployment succeeded"];
const EMAILS = ["alice@example.com", "bob@example.com", "team@example.com"];
const PHONES = ["+33 6 12 34 56 78", "+1 555 0123", "+44 7911 123456"];
const SLACK_CHANNELS = ["#general", "#engineering", "#alerts", "#deploys"];

let idx = 0;
function pick<T>(arr: T[]): T { return arr[idx % arr.length]; }
function nextSubject(): string { const s = pick(SUBJECTS); idx++; return s; }

function createEmailNotification(): AppNotification {
  const subject = nextSubject();
  return { id: crypto.randomUUID(), channel: "email", title: subject, fields: [{ label: "To", value: pick(EMAILS) }, { label: "Subject", value: subject }, { label: "Body", value: "Please find the details attached. Best regards." }], sentAt: Date.now() };
}

function createSmsNotification(): AppNotification {
  const subject = nextSubject();
  return { id: crypto.randomUUID(), channel: "sms", title: subject, fields: [{ label: "To", value: pick(PHONES) }, { label: "Message", value: subject }], sentAt: Date.now() };
}

function createPushNotification(): AppNotification {
  const subject = nextSubject();
  return { id: crypto.randomUUID(), channel: "push", title: subject, fields: [{ label: "Title", value: subject }, { label: "Badge", value: `${(idx % 9) + 1}` }, { label: "Sound", value: "default" }], sentAt: Date.now() };
}

function createSlackNotification(): AppNotification {
  const subject = nextSubject();
  return { id: crypto.randomUUID(), channel: "slack", title: subject, fields: [{ label: "Channel", value: pick(SLACK_CHANNELS) }, { label: "Text", value: subject }, { label: "Bot", value: "pithos-bot" }], sentAt: Date.now() };
}

export const factories: Record<ChannelKey, () => AppNotification> = {
  email: createEmailNotification,
  sms: createSmsNotification,
  push: createPushNotification,
  slack: createSlackNotification,
};

/** The consumer that NEVER changes */
export function sendNotification(createNotif: () => AppNotification): AppNotification {
  return createNotif();
}

export function resetCounter(): void { idx = 0; }
