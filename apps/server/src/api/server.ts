import express from "express";
import cors from "cors";
import { config } from "../config.js";
import { emailsRouter } from "./routes/emails.js";
import { eventsRouter } from "./routes/events.js";
import { configRouter } from "./routes/config.js";

export function createApiServer() {
  const app = express();
  app.use(cors({ origin: config.cors.origin }));
  app.use(express.json());
  app.use("/api", emailsRouter);
  app.use("/api", eventsRouter);
  app.use("/api", configRouter);
  return app;
}

export async function startApiServer(app: ReturnType<typeof express>) {
  return new Promise<void>((resolve) => {
    app.listen(config.api.port, config.api.host, () => {
      console.log(`API server listening on http://${config.api.host}:${config.api.port}`);
      resolve();
    });
  });
}
