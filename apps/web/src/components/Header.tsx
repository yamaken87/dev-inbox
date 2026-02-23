import { Mail, Settings, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  emailCount: number;
  onSearch: (query: string) => void;
  onOpenConfig: () => void;
  onDeleteAll: () => void;
}

export default function Header({
  emailCount,
  onSearch,
  onOpenConfig,
  onDeleteAll,
}: HeaderProps) {
  return (
    <header className="flex items-center gap-3 border-b px-4 py-3">
      <div className="flex items-center gap-2 shrink-0">
        <Mail className="h-5 w-5 text-primary" />
        <span className="font-semibold text-sm">Dev Inbox</span>
        <Badge variant="secondary">{emailCount}</Badge>
      </div>

      <Input
        type="search"
        placeholder="Search emails..."
        className="h-8 flex-1"
        onChange={(e) => onSearch(e.target.value)}
      />

      <div className="flex items-center gap-1 shrink-0">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onOpenConfig}>
          <Settings className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={onDeleteAll}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
