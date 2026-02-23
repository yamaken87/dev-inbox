import type { EmailDetail, EmailSummary, SmtpConfig } from "../types/email";

const BASE = "/api";

export async function fetchEmails(query?: string) {
  const url = query
    ? `${BASE}/emails?q=${encodeURIComponent(query)}`
    : `${BASE}/emails`;
  const res = await fetch(url);
  return res.json() as Promise<{ emails: EmailSummary[]; total: number }>;
}

export async function fetchEmail(id: string) {
  const res = await fetch(`${BASE}/emails/${id}`);
  return res.json() as Promise<{ email: EmailDetail }>;
}

export async function fetchEmailRaw(id: string) {
  const res = await fetch(`${BASE}/emails/${id}/raw`);
  return res.text();
}

export async function deleteEmail(id: string) {
  await fetch(`${BASE}/emails/${id}`, { method: "DELETE" });
}

export async function deleteAllEmails() {
  await fetch(`${BASE}/emails`, { method: "DELETE" });
}

export async function fetchSmtpConfig() {
  const res = await fetch(`${BASE}/config`);
  return res.json() as Promise<SmtpConfig>;
}

export function getAttachmentUrl(emailId: string, index: number) {
  return `${BASE}/emails/${emailId}/attachments/${index}`;
}
