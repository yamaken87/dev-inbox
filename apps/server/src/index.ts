import { createApiServer, startApiServer } from "./api/server.js";
import { createSmtpServer, startSmtpServer } from "./smtp/server.js";

async function main() {
  console.log("Dev Inbox server starting...");

  const app = createApiServer();
  const smtp = createSmtpServer();

  await Promise.all([
    startApiServer(app),
    startSmtpServer(smtp),
  ]);
}

main();
