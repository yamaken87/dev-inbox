import { Readable } from "node:stream";
import { simpleParser } from "mailparser";
import { v4 as uuidv4 } from "uuid";
import { emailStore } from "../store/email-store.js";
import { config } from "../config.js";
import type { Attachment, Email, EmailAddress } from "../models/email.js";

export async function handleEmailStream(
  stream: Readable,
  _session: unknown,
  callback: (err?: Error | null) => void
) {
  try {
    const parsed = await simpleParser(stream);
    const raw = parsed.text ?? "";

    const attachments: Attachment[] = (parsed.attachments ?? [])
      .filter((a) => a.content.length <= config.storage.maxAttachmentSize)
      .map((a) => ({
        filename: a.filename,
        contentType: a.contentType,
        size: a.size,
        content: a.content,
      }));

    const toAddress = (a: { name?: string; address?: string }): EmailAddress => ({
      name: a.name,
      address: a.address ?? "",
    });

    const email: Email = {
      id: uuidv4(),
      from: toAddress(parsed.from?.value[0] ?? {}),
      to: (parsed.to ? [parsed.to].flat().flatMap((a) => a.value) : []).map(toAddress),
      cc: parsed.cc ? [parsed.cc].flat().flatMap((a) => a.value).map(toAddress) : undefined,
      subject: parsed.subject ?? "(no subject)",
      date: parsed.date ?? new Date(),
      textBody: parsed.text,
      htmlBody: parsed.html || undefined,
      raw,
      attachments,
      size: Buffer.byteLength(raw),
    };

    emailStore.add(email);
    console.log(`Email received: "${email.subject}" from ${email.from.address}`);
    callback();
  } catch (err) {
    callback(err instanceof Error ? err : new Error(String(err)));
  }
}
