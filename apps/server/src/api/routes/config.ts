import { Router } from "express";
import { config } from "../../config.js";

export const configRouter = Router();

configRouter.get("/config", (_req, res) => {
  res.json({
    smtp: {
      host: config.smtp.host === "0.0.0.0" ? "localhost" : config.smtp.host,
      port: config.smtp.port,
    },
    examples: {
      nodemailer: `const transporter = nodemailer.createTransport({ host: 'localhost', port: ${config.smtp.port}, secure: false });`,
      swaks: `swaks --to you@example.com --server localhost --port ${config.smtp.port}`,
      python: `smtplib.SMTP('localhost', ${config.smtp.port})`,
    },
  });
});
