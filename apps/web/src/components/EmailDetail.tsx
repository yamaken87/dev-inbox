import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { fetchEmail, fetchEmailRaw } from "@/lib/api";
import type { EmailDetail as EmailDetailType } from "@/types/email";
import AttachmentList from "./AttachmentList";
import EmailBody from "./EmailBody";

interface EmailDetailProps {
  emailId: string;
  onDelete: (id: string) => void;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function EmailDetail({ emailId, onDelete }: EmailDetailProps) {
  const [email, setEmail] = useState<EmailDetailType | null>(null);
  const [raw, setRaw] = useState<string>("");

  useEffect(() => {
    setEmail(null);
    setRaw("");
    Promise.all([fetchEmail(emailId), fetchEmailRaw(emailId)]).then(
      ([{ email }, rawText]) => {
        setEmail(email);
        setRaw(rawText);
      }
    );
  }, [emailId]);

  if (!email) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
        Loading...
      </div>
    );
  }

  const fromDisplay = email.from.name
    ? `${email.from.name} <${email.from.address}>`
    : email.from.address;

  const toDisplay = email.to
    .map((t) => (t.name ? `${t.name} <${t.address}>` : t.address))
    .join(", ");

  const ccDisplay = email.cc
    ?.map((t) => (t.name ? `${t.name} <${t.address}>` : t.address))
    .join(", ");

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="shrink-0 px-4 pt-4 pb-2">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h2 className="text-base font-semibold leading-tight">{email.subject}</h2>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 text-destructive hover:text-destructive"
            onClick={() => onDelete(email.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
          <dt className="text-muted-foreground">From</dt>
          <dd className="truncate">{fromDisplay}</dd>

          <dt className="text-muted-foreground">To</dt>
          <dd className="truncate">{toDisplay}</dd>

          {ccDisplay && (
            <>
              <dt className="text-muted-foreground">Cc</dt>
              <dd className="truncate">{ccDisplay}</dd>
            </>
          )}

          <dt className="text-muted-foreground">Date</dt>
          <dd>
            {new Date(email.date).toLocaleString("en-US", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </dd>

          <dt className="text-muted-foreground">Size</dt>
          <dd>{formatSize(email.size)}</dd>
        </dl>
      </div>

      <Separator />

      <AttachmentList emailId={email.id} attachments={email.attachments} />

      {/* Body */}
      <div className="flex-1 overflow-hidden">
        <EmailBody htmlBody={email.htmlBody} textBody={email.textBody} raw={raw} />
      </div>
    </div>
  );
}
