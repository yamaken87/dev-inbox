import { Paperclip } from "lucide-react";
import { getAttachmentUrl } from "@/lib/api";
import type { AttachmentMeta } from "@/types/email";

interface AttachmentListProps {
  emailId: string;
  attachments: AttachmentMeta[];
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AttachmentList({ emailId, attachments }: AttachmentListProps) {
  if (attachments.length === 0) return null;

  return (
    <div className="border-t px-4 py-3">
      <p className="text-xs font-medium text-muted-foreground mb-2">
        Attachments ({attachments.length})
      </p>
      <div className="flex flex-wrap gap-2">
        {attachments.map((attachment, index) => (
          <a
            key={index}
            href={getAttachmentUrl(emailId, index)}
            download={attachment.filename}
            className="flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs hover:bg-muted transition-colors"
          >
            <Paperclip className="h-3 w-3 text-muted-foreground" />
            <span className="font-medium">
              {attachment.filename ?? "attachment"}
            </span>
            <span className="text-muted-foreground">
              {attachment.contentType} · {formatSize(attachment.size)}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
