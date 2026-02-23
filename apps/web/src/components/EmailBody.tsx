import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface EmailBodyProps {
  htmlBody?: string;
  textBody?: string;
  raw: string;
}

export default function EmailBody({ htmlBody, textBody, raw }: EmailBodyProps) {
  const defaultTab = htmlBody ? "html" : textBody ? "text" : "raw";

  return (
    <Tabs defaultValue={defaultTab} className="flex flex-col h-full">
      <TabsList className="shrink-0 self-start mx-4 mt-3">
        {htmlBody && <TabsTrigger value="html">HTML</TabsTrigger>}
        {textBody && <TabsTrigger value="text">Text</TabsTrigger>}
        <TabsTrigger value="raw">Raw</TabsTrigger>
      </TabsList>

      {htmlBody && (
        <TabsContent value="html" className="flex-1 mt-0 overflow-hidden">
          <iframe
            srcDoc={htmlBody}
            sandbox=""
            className="w-full h-full border-0"
            title="Email HTML content"
          />
        </TabsContent>
      )}

      {textBody && (
        <TabsContent value="text" className="flex-1 mt-0 overflow-auto p-4">
          <pre className="text-sm whitespace-pre-wrap break-words font-mono">
            {textBody}
          </pre>
        </TabsContent>
      )}

      <TabsContent value="raw" className="flex-1 mt-0 overflow-auto p-4">
        <pre className="text-xs whitespace-pre-wrap break-words font-mono text-muted-foreground">
          {raw}
        </pre>
      </TabsContent>
    </Tabs>
  );
}
