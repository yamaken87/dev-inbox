import type { Response } from "express";

interface SseClient {
  id: string;
  res: Response;
}

class EventBus {
  private clients = new Map<string, SseClient>();

  addClient(id: string, res: Response) {
    this.clients.set(id, { id, res });
  }

  removeClient(id: string) {
    this.clients.delete(id);
  }

  broadcast(event: string, data: unknown) {
    const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
    for (const client of this.clients.values()) {
      client.res.write(payload);
    }
  }
}

export const eventBus = new EventBus();
