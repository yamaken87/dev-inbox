import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { fetchSmtpConfig } from "@/lib/api";
import type { SmtpConfig as SmtpConfigType } from "@/types/email";

interface SmtpConfigProps {
  open: boolean;
  onClose: () => void;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={handleCopy}>
      {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
    </Button>
  );
}

function buildExamples(host: string, port: number): Record<string, string> {
  return {
    nodemailer: `const nodemailer = require('nodemailer');
const transport = nodemailer.createTransport({
  host: '${host}',
  port: ${port},
  secure: false,
});
transport.sendMail({
  from: 'sender@example.com',
  to: 'inbox@example.com',
  subject: 'Hello!',
  text: 'Test email.',
});`,
    swaks: `swaks --to inbox@example.com \\
  --server ${host} --port ${port}`,
    python: `import smtplib
from email.mime.text import MIMEText

msg = MIMEText('Test email.')
msg['Subject'] = 'Hello!'
msg['From'] = 'sender@example.com'
msg['To'] = 'inbox@example.com'

with smtplib.SMTP('${host}', ${port}) as s:
    s.sendmail(msg['From'], [msg['To']], msg.as_string())`,
  };
}

export default function SmtpConfig({ open, onClose }: SmtpConfigProps) {
  const [config, setConfig] = useState<SmtpConfigType | null>(null);

  useEffect(() => {
    if (open) {
      fetchSmtpConfig().then(setConfig);
    }
  }, [open]);

  const examples = config
    ? buildExamples(config.smtp.host, config.smtp.port)
    : null;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>SMTP Configuration</DialogTitle>
        </DialogHeader>

        {config ? (
          <div className="space-y-4 text-sm">
            <div className="rounded-md border p-3 font-mono text-xs bg-muted/50">
              <div>Host: <span className="font-semibold">{config.smtp.host}</span></div>
              <div>Port: <span className="font-semibold">{config.smtp.port}</span></div>
            </div>

            <p className="text-muted-foreground text-xs">
              Send emails to this SMTP server. No authentication required.
            </p>

            {examples &&
              Object.entries(examples).map(([lang, code]) => (
                <div key={lang}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium capitalize">{lang}</span>
                    <CopyButton text={code} />
                  </div>
                  <pre className="rounded-md bg-muted p-3 text-xs overflow-x-auto">
                    <code>{code}</code>
                  </pre>
                </div>
              ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Loading...</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
