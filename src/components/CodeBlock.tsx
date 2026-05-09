import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = { code: string; language?: string; className?: string };

export function CodeBlock({ code, language = "text", className }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className={`group relative overflow-hidden rounded-lg border border-border bg-[oklch(0.10_0.03_270)] ${className ?? ""}`}>
      <div className="flex items-center justify-between border-b border-border/60 px-3 py-1.5">
        <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          {language}
        </span>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleCopy}
          className="h-7 gap-1.5 text-xs"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus as any}
        customStyle={{
          margin: 0,
          padding: "1rem",
          background: "transparent",
          fontSize: "0.85rem",
          fontFamily: "var(--font-mono)",
          maxHeight: "60vh",
        }}
        wrapLongLines
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
