import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { eventBus } from "../../store/event-bus.js";

export const eventsRouter = Router();

eventsRouter.get("/events", (req, res) => {
  const clientId = uuidv4();
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  eventBus.addClient(clientId, res);

  req.on("close", () => {
    eventBus.removeClient(clientId);
  });
});
