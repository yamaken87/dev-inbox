import express from "express";
import cors from "cors";
import { config } from "../config.js";

export function createApiServer() {
  const app = express();
  app.use(cors({ origin: config.cors.origin }));
  app.use(express.json());
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
