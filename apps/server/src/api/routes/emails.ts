import { Router } from "express";
import { emailStore } from "../../store/email-store.js";

export const emailsRouter = Router();

// GET /api/emails?q=
emailsRouter.get("/emails", (req, res) => {
  const q = typeof req.query.q === "string" ? req.query.q : undefined;
  const emails = q ? emailStore.search(q) : emailStore.getAll();
  res.json({ emails, total: emails.length });
});

// GET /api/emails/:id
emailsRouter.get("/emails/:id", (req, res) => {
  const email = emailStore.get(req.params.id);
  if (!email) {
    res.status(404).json({ error: "Email not found" });
    return;
  }
  const { content: _content, ...restAttachments } = email.attachments[0] ?? {};
  const attachments = email.attachments.map(({ content: _c, ...meta }) => meta);
  res.json({ email: { ...email, attachments, date: email.date.toISOString() } });
});

// GET /api/emails/:id/raw
emailsRouter.get("/emails/:id/raw", (req, res) => {
  const email = emailStore.get(req.params.id);
  if (!email) {
    res.status(404).json({ error: "Email not found" });
    return;
  }
  res.type("text/plain").send(email.raw);
});

// GET /api/emails/:id/attachments/:index
emailsRouter.get("/emails/:id/attachments/:index", (req, res) => {
  const email = emailStore.get(req.params.id);
  if (!email) {
    res.status(404).json({ error: "Email not found" });
    return;
  }
  const index = Number(req.params.index);
  const attachment = email.attachments[index];
  if (!attachment) {
    res.status(404).json({ error: "Attachment not found" });
    return;
  }
  res.setHeader("Content-Type", attachment.contentType);
  if (attachment.filename) {
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${attachment.filename}"`
    );
  }
  res.send(attachment.content);
});

// DELETE /api/emails/:id
emailsRouter.delete("/emails/:id", (req, res) => {
  const deleted = emailStore.delete(req.params.id);
  if (!deleted) {
    res.status(404).json({ error: "Email not found" });
    return;
  }
  res.status(204).send();
});

// DELETE /api/emails
emailsRouter.delete("/emails", (_req, res) => {
  emailStore.deleteAll();
  res.status(204).send();
});
