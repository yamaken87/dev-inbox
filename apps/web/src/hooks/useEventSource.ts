import { useEffect, useLayoutEffect, useRef } from "react";
import type { EmailSummary } from "../types/email";

interface Handlers {
  onEmailNew: (email: EmailSummary) => void;
  onEmailDeleted: (data: { id: string }) => void;
  onEmailsCleared: () => void;
}

export function useEventSource(handlers: Handlers) {
  // ハンドラを ref で保持することで、EventSource のコールバックが
  // 常に最新のクロージャを参照できるようにする
  const handlersRef = useRef(handlers);
  useLayoutEffect(() => {
    handlersRef.current = handlers;
  });

  useEffect(() => {
    const es = new EventSource("/api/events");

    es.addEventListener("email:new", (e) => {
      handlersRef.current.onEmailNew(JSON.parse(e.data));
    });
    es.addEventListener("email:deleted", (e) => {
      handlersRef.current.onEmailDeleted(JSON.parse(e.data));
    });
    es.addEventListener("emails:cleared", () => {
      handlersRef.current.onEmailsCleared();
    });

    return () => es.close();
  }, []);
}
