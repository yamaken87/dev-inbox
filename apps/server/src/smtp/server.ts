import { SMTPServer } from "smtp-server";
import { config } from "../config.js";
import { handleEmailStream } from "./handler.js";

export function createSmtpServer() {
  return new SMTPServer({
    authOptional: true,
    onData: handleEmailStream,
  });
}

export async function startSmtpServer(server: SMTPServer) {
  return new Promise<void>((resolve) => {
    server.listen(config.smtp.port, config.smtp.host, () => {
      console.log(`SMTP server listening on ${config.smtp.host}:${config.smtp.port}`);
      resolve();
    });
  });
}
