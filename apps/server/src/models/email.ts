export interface EmailAddress {
  name?: string;
  address: string;
}

export interface Attachment {
  filename?: string;
  contentType: string;
  size: number;
  content: Buffer;
}

export interface Email {
  id: string;
  from: EmailAddress;
  to: EmailAddress[];
  cc?: EmailAddress[];
  subject: string;
  date: Date;
  textBody?: string;
  htmlBody?: string;
  raw: string;
  attachments: Attachment[];
  size: number;
}

export interface EmailSummary {
  id: string;
  from: EmailAddress;
  to: EmailAddress[];
  subject: string;
  date: string;       // ISO 文字列
  hasAttachments: boolean;
  size: number;
}

export function toEmailSummary(email: Email): EmailSummary {
  return {
    id: email.id,
    from: email.from,
    to: email.to,
    subject: email.subject,
    date: email.date.toISOString(),
    hasAttachments: email.attachments.length > 0,
    size: email.size,
  };
}
