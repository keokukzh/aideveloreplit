import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Copy, Check } from "lucide-react";

interface CodeSnippetProps {
  code: string;
  title?: string;
  language?: string;
  className?: string;
}

export function CodeSnippet({ code, title, language = "html", className }: CodeSnippetProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <Card className={className}>
      {title && (
        <div className="px-4 py-2 border-b">
          <h4 className="text-sm font-medium">{title}</h4>
        </div>
      )}
      <CardContent className="p-4">
        <div className="relative">
          <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm font-mono">
            <code className={`language-${language}`}>{code}</code>
          </pre>
          <Button
            variant="outline"
            size="sm"
            onClick={copyToClipboard}
            className="absolute top-2 right-2"
            data-testid="button-copy-code"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-1" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}