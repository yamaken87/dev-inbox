import { useCallback, useEffect, useRef, useState } from "react";
import { deleteAllEmails, deleteEmail, fetchEmails } from "@/lib/api";
import { useEventSource } from "@/hooks/useEventSource";
import type { EmailSummary } from "@/types/email";
import Header from "@/components/Header";
import EmailList from "@/components/EmailList";
import EmailDetail from "@/components/EmailDetail";
import SmtpConfig from "@/components/SmtpConfig";

export default function App() {
  const [emails, setEmails] = useState<EmailSummary[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [configOpen, setConfigOpen] = useState(false);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 初期ロード
  useEffect(() => {
    fetchEmails().then(({ emails }) => setEmails(emails));
  }, []);

  // SSE リアルタイム更新
  useEventSource({
    onEmailNew: (email) => {
      // 検索中は新着を自動追加しない（検索結果が崩れるため）
      if (!searchQuery) setEmails((prev) => [email, ...prev]);
    },
    onEmailDeleted: ({ id }) => {
      setEmails((prev) => prev.filter((e) => e.id !== id));
      if (selectedId === id) setSelectedId(null);
    },
    onEmailsCleared: () => {
      setEmails([]);
      setSelectedId(null);
    },
  });

  // 検索（300ms デバウンス）
  const handleSearch = useCallback((query: string) => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      setSearchQuery(query);
      fetchEmails(query || undefined).then(({ emails }) => setEmails(emails));
    }, 300);
  }, []);

  // 個別削除
  const handleDelete = useCallback(async (id: string) => {
    await deleteEmail(id);
    setEmails((prev) => prev.filter((e) => e.id !== id));
    if (selectedId === id) setSelectedId(null);
  }, [selectedId]);

  // 全削除
  const handleDeleteAll = useCallback(async () => {
    await deleteAllEmails();
    setEmails([]);
    setSelectedId(null);
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <Header
        emailCount={emails.length}
        onSearch={handleSearch}
        onOpenConfig={() => setConfigOpen(true)}
        onDeleteAll={handleDeleteAll}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* メール一覧（幅固定） */}
        <div className="w-[350px] shrink-0 border-r flex flex-col overflow-hidden">
          <EmailList
            emails={emails}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </div>

        {/* メール詳細 */}
        <div className="flex-1 overflow-hidden">
          {selectedId ? (
            <EmailDetail emailId={selectedId} onDelete={handleDelete} />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
              Select an email to read
            </div>
          )}
        </div>
      </div>

      <SmtpConfig open={configOpen} onClose={() => setConfigOpen(false)} />
    </div>
  );
}
