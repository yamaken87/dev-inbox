export const config = {
  smtp: {
    port: Number(process.env.SMTP_PORT) || 1025,
    host: process.env.SMTP_HOST || "0.0.0.0",
  },
  api: {
    port: Number(process.env.API_PORT) || 3000,
    host: process.env.API_HOST || "0.0.0.0",
  },
  storage: {
    maxEmails: 1000,
    maxAttachmentSize: 10 * 1024 * 1024, // 10MB
  },
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
  },
};
