import { createApiServer, startApiServer } from "./api/server.js";

async function main() {
  console.log("Dev Inbox server starting...");

  const app = createApiServer();
  await startApiServer(app);
}

main();
