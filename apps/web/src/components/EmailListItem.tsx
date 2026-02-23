import { Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EmailSummary } from "@/types/email";

interface EmailListItemProps {
  email: EmailSummary;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  if (isToday) {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function EmailListItem({
  email,
  isSelected,
  onSelect,
}: EmailListItemProps) {
  const senderName = email.from.name || email.from.address;
  const toAddresses = email.to.map((t) => t.address).join(", ");

  return (
    <button
      className={cn(
        "w-full text-left px-4 py-3 border-b hover:bg-muted/50 transition-colors",
        isSelected && "bg-muted"
      )}
      onClick={() => onSelect(email.id)}
    >
      <div className="flex items-baseline justify-between gap-2 mb-1">
        <span className="text-sm font-medium truncate">{senderName}</span>
        <span className="text-xs text-muted-foreground shrink-0">
          {formatDate(email.date)}
        </span>
      </div>
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm truncate">{email.subject}</span>
        {email.hasAttachments && (
          <Paperclip className="h-3 w-3 text-muted-foreground shrink-0" />
        )}
      </div>
      <div className="text-xs text-muted-foreground truncate mt-0.5">
        To: {toAddresses}
      </div>
    </button>
  );
}
