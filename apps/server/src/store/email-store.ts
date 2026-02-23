import { Email, EmailSummary, toEmailSummary } from "../models/email.js";
import { eventBus } from "./event-bus.js";
import { config } from "../config.js";

class EmailStore {
  private store = new Map<string, Email>();

  add(email: Email): void {
    this.store.set(email.id, email);
    // FIFO: 上限超過時に最古のメールを削除
    if (this.store.size > config.storage.maxEmails) {
      const oldestKey = this.store.keys().next().value!;
      this.store.delete(oldestKey);
    }
    eventBus.broadcast("email:new", toEmailSummary(email));
  }

  get(id: string): Email | undefined {
    return this.store.get(id);
  }

  getAll(): EmailSummary[] {
    return [...this.store.values()]
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .map(toEmailSummary);
  }

  delete(id: string): boolean {
    const deleted = this.store.delete(id);
    if (deleted) eventBus.broadcast("email:deleted", { id });
    return deleted;
  }

  deleteAll(): void {
    this.store.clear();
    eventBus.broadcast("emails:cleared", {});
  }

  search(query: string): EmailSummary[] {
    const q = query.toLowerCase();
    return [...this.store.values()]
      .filter((e) =>
        e.from.address.toLowerCase().includes(q) ||
        e.to.some((t) => t.address.toLowerCase().includes(q)) ||
        e.subject.toLowerCase().includes(q) ||
        e.textBody?.toLowerCase().includes(q)
      )
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .map(toEmailSummary);
  }

  count(): number {
    return this.store.size;
  }
}

export const emailStore = new EmailStore();
