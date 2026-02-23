export interface EmailAddress {
  name?: string;
  address: string;
}

export interface AttachmentMeta {
  filename?: string;
  contentType: string;
  size: number;
}

export interface EmailSummary {
  id: string;
  from: EmailAddress;
  to: EmailAddress[];
  subject: string;
  date: string;
  hasAttachments: boolean;
  size: number;
}

export interface EmailDetail extends EmailSummary {
  cc?: EmailAddress[];
  textBody?: string;
  htmlBody?: string;
  raw: string;
  attachments: AttachmentMeta[];
}

export interface SmtpConfig {
  smtp: { host: string; port: number };
  examples: Record<string, string>;
}
