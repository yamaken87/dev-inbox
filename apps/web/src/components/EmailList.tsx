import type { EmailSummary } from "@/types/email";
import EmailListItem from "./EmailListItem";

interface EmailListProps {
  emails: EmailSummary[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function EmailList({ emails, selectedId, onSelect }: EmailListProps) {
  if (emails.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
        <p className="text-sm">No emails yet</p>
        <p className="text-xs">Send a mail to the SMTP server to get started</p>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto h-full">
      {emails.map((email) => (
        <EmailListItem
          key={email.id}
          email={email}
          isSelected={email.id === selectedId}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
