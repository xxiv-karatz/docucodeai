import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast, Toaster } from "sonner";
import { Sparkles, Loader2, FileCode2, Github, Wand2, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CodeBlock } from "@/components/CodeBlock";
import { EXAMPLES } from "@/lib/examples";
import { formatCost } from "@/lib/pricing";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DocuCode AI — Auto-document messy code with AI" },
      {
        name: "description",
        content:
          "Paste any code. Get clean docstrings, inline comments, tests, and a README in seconds — powered by AI.",
      },
      { property: "og:title", content: "DocuCode AI" },
      {
        property: "og:description",
        content: "AI-powered documentation for any codebase.",
      },
    ],
  }),
  component: HomePage,
});

type DocResult = {
  commented_code: string;
  docstring: string;
  explanation: string;
  test_snippet: string;
  readme_snippet: string;
  complexity_score: string;
  edge_cases: string[];
};

type ComparisonResult = {
  readability_before: number;
  readability_after: number;
  maintainability_before: number;
  maintainability_after: number;
  onboarding_minutes_saved: number;
  key_improvements: string[];
  summary: string;
};

const LANGUAGES = [
  { value: "auto", label: "Auto-detect" },
  { value: "python", label: "Python" },
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "sql", label: "SQL" },
  { value: "java", label: "Java" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
];

function detectLanguage(code: string): string {
  const c = code.trim();
  if (/^\s*(def |import |from .* import|class .*:)/m.test(c)) return "python";
  if (/^\s*(SELECT |WITH |INSERT |UPDATE |CREATE TABLE)/im.test(c)) return "sql";
  if (/\bpublic\s+class\b|System\.out\.println/.test(c)) return "java";
  if (/^\s*(package |func |import \()/m.test(c)) return "go";
  if (/\bfn\s+\w+|let\s+mut\b/.test(c)) return "rust";
  if (/:\s*(string|number|boolean)\b|interface\s+\w+/.test(c)) return "typescript";
  if (/\b(function|const|let|=>)\b/.test(c)) return "javascript";
  return "text";
}

function HomePage() {
  const [code, setCode] = useState(EXAMPLES[0].code);
  const [language, setLanguage] = useState("auto");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DocResult | null>(null);
  const [rawError, setRawError] = useState<string | null>(null);
  const [model, setModel] = useState<string>("");
  const [lastCost, setLastCost] = useState<number | null>(null);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [requestCount, setRequestCount] = useState<number>(0);

  const [comparing, setComparing] = useState(false);
  const [comparison, setComparison] = useState<ComparisonResult | null>(null);
  const [compareOpen, setCompareOpen] = useState(false);

  const effectiveLanguage = useMemo(
    () => (language === "auto" ? detectLanguage(code) : language),
    [language, code],
  );

  const loadExample = (idx: number) => {
    const ex = EXAMPLES[idx];
    setCode(ex.code);
    setLanguage(ex.language);
    setResult(null);
    setRawError(null);
  };

  const handleGenerate = async () => {
    if (!code.trim()) {
      toast.error("Paste some code first.");
      return;
    }
    setLoading(true);
    setRawError(null);
    setResult(null);
    try {
      const res = await fetch("/api/document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language: effectiveLanguage }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Request failed");
        return;
      }
      if (data.usage) {
        setLastCost(data.usage.cost ?? 0);
        setTotalCost((t) => t + (data.usage.cost ?? 0));
        setRequestCount((n) => n + 1);
      }
      if (data.model) setModel(data.model);
      if (!data.ok) {
        setRawError(data.raw || data.error || "Could not parse model output.");
        toast.error("Could not parse JSON — showing raw output.");
        return;
      }
      setResult(data.doc);
      toast.success("Documentation generated.");
    } catch (err: any) {
      toast.error(err?.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleCompare = async () => {
    if (!result) return;
    setComparing(true);
    setComparison(null);
    setCompareOpen(true);
    try {
      const res = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          original: code,
          documented: result.commented_code,
          language: effectiveLanguage,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Compare failed");
        return;
      }
      if (data.usage) {
        setTotalCost((t) => t + (data.usage.cost ?? 0));
        setRequestCount((n) => n + 1);
      }
      if (data.ok) setComparison(data.comparison);
      else toast.error("Could not parse comparison.");
    } catch (err: any) {
      toast.error(err?.message || "Network error");
    } finally {
      setComparing(false);
    }
  };

  const complexityColor =
    result?.complexity_score === "simple"
      ? "bg-success/15 text-success border-success/30"
      : result?.complexity_score === "complex"
      ? "bg-destructive/15 text-destructive border-destructive/30"
      : "bg-primary/15 text-primary border-primary/30";

  return (
    <div className="min-h-screen bg-grid">
      <Toaster theme="dark" position="top-right" />

      {/* Header */}
      <header className="border-b border-border/60 backdrop-blur supports-[backdrop-filter]:bg-background/40">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--gradient-primary)] glow-ring">
              <FileCode2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">
                DocuCode <span className="text-gradient">AI</span>
              </h1>
              <p className="text-xs text-muted-foreground">
                Auto-document messy code with AI
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1.5 border-primary/40 bg-primary/10 text-primary">
              <Sparkles className="h-3 w-3" /> Powered by Lovable AI
            </Badge>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex"
            >
              <Button variant="ghost" size="sm" className="gap-1.5">
                <Github className="h-4 w-4" /> Source
              </Button>
            </a>
          </div>
        </div>
      </header>

      {/* Hero blurb */}
      <section className="mx-auto max-w-7xl px-6 pt-10 pb-6 text-center">
        <h2 className="font-display text-3xl font-bold tracking-tight md:text-5xl">
          Turn messy code into <span className="text-gradient">clean docs</span> in seconds.
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">
          Paste any function — Python, JavaScript, SQL, Java — and get inline comments,
          a proper docstring, an explanation, a unit test, and a README snippet.
        </p>
      </section>

      {/* Workspace */}
      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 pb-24 lg:grid-cols-2">
        {/* Input column */}
        <div className="rounded-2xl border border-border bg-card/60 p-5 shadow-[var(--shadow-elegant)] backdrop-blur">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Input code
            </h3>
            <div className="flex items-center gap-2">
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="h-8 w-[160px] text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((l) => (
                    <SelectItem key={l.value} value={l.value}>
                      {l.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select onValueChange={(v) => loadExample(Number(v))}>
                <SelectTrigger className="h-8 w-[170px] text-xs">
                  <SelectValue placeholder="Load example" />
                </SelectTrigger>
                <SelectContent>
                  {EXAMPLES.map((ex, i) => (
                    <SelectItem key={ex.label} value={String(i)}>
                      {ex.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Paste your code here…"
            className="min-h-[420px] resize-y border-border/60 bg-[oklch(0.10_0.03_270)] font-mono text-[13px] leading-relaxed"
            spellCheck={false}
          />

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              Detected: <span className="text-foreground/80 font-mono">{effectiveLanguage}</span>{" "}
              · {code.length.toLocaleString()} chars
            </p>
            <Button
              onClick={handleGenerate}
              disabled={loading}
              size="lg"
              className="gap-2 bg-[var(--gradient-primary)] text-primary-foreground hover:opacity-90 glow-ring"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Generating…
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4" /> Generate Documentation
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Output column */}
        <div className="rounded-2xl border border-border bg-card/60 p-5 shadow-[var(--shadow-elegant)] backdrop-blur">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Documentation
            </h3>
            {result && (
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={complexityColor}>
                  {result.complexity_score}
                </Badge>
                <Dialog open={compareOpen} onOpenChange={setCompareOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline" className="gap-1.5" onClick={handleCompare}>
                      <BarChart3 className="h-3.5 w-3.5" /> Before vs After
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Before vs After</DialogTitle>
                    </DialogHeader>
                    {comparing && (
                      <div className="flex items-center gap-2 py-8 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" /> Analyzing impact…
                      </div>
                    )}
                    {comparison && (
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">{comparison.summary}</p>
                        <div className="grid grid-cols-2 gap-3">
                          <ScoreCard
                            label="Readability"
                            before={comparison.readability_before}
                            after={comparison.readability_after}
                          />
                          <ScoreCard
                            label="Maintainability"
                            before={comparison.maintainability_before}
                            after={comparison.maintainability_after}
                          />
                        </div>
                        <div className="rounded-lg border border-success/30 bg-success/10 p-3 text-sm">
                          <span className="font-semibold text-success">
                            ~{comparison.onboarding_minutes_saved} min
                          </span>{" "}
                          <span className="text-muted-foreground">
                            saved per new developer onboarding to this code.
                          </span>
                        </div>
                        <div>
                          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Key improvements
                          </h4>
                          <ul className="space-y-1.5 text-sm">
                            {comparison.key_improvements.map((k, i) => (
                              <li key={i} className="flex gap-2">
                                <span className="text-primary">›</span> {k}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>

          {!result && !rawError && !loading && (
            <EmptyState />
          )}

          {loading && (
            <div className="flex h-[420px] flex-col items-center justify-center gap-3 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm">Reading your code…</p>
            </div>
          )}

          {rawError && !result && (
            <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4">
              <p className="mb-2 text-sm font-semibold text-destructive">Raw model output</p>
              <pre className="max-h-[420px] overflow-auto whitespace-pre-wrap font-mono text-xs">
                {rawError}
              </pre>
            </div>
          )}

          {result && (
            <Tabs defaultValue="commented" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="commented">Code</TabsTrigger>
                <TabsTrigger value="docstring">Docstring</TabsTrigger>
                <TabsTrigger value="explanation">Explain</TabsTrigger>
                <TabsTrigger value="tests">Tests</TabsTrigger>
                <TabsTrigger value="readme">README</TabsTrigger>
              </TabsList>

              <TabsContent value="commented" className="mt-4">
                <CodeBlock code={result.commented_code} language={effectiveLanguage} />
                {result.edge_cases?.length > 0 && (
                  <div className="mt-4 rounded-lg border border-border bg-muted/40 p-4">
                    <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Edge cases
                    </h4>
                    <ul className="space-y-1.5 text-sm">
                      {result.edge_cases.map((e, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-primary">!</span> {e}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="docstring" className="mt-4">
                <CodeBlock code={result.docstring} language={effectiveLanguage} />
              </TabsContent>

              <TabsContent value="explanation" className="mt-4">
                <div className="rounded-lg border border-border bg-muted/30 p-5 text-sm leading-relaxed">
                  {result.explanation}
                </div>
              </TabsContent>

              <TabsContent value="tests" className="mt-4">
                <CodeBlock code={result.test_snippet} language={effectiveLanguage} />
              </TabsContent>

              <TabsContent value="readme" className="mt-4">
                <CodeBlock code={result.readme_snippet} language="markdown" />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>

      {/* Footer stats */}
      <footer className="fixed inset-x-0 bottom-0 border-t border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-2.5 text-xs">
          <div className="flex items-center gap-4 text-muted-foreground">
            <span>
              Model: <span className="font-mono text-foreground/80">{model || "google/gemini-3-flash-preview"}</span>
            </span>
            <span className="hidden sm:inline">
              Requests: <span className="text-foreground/80">{requestCount}</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            {lastCost !== null && (
              <Badge variant="outline" className="gap-1.5 border-primary/30 bg-primary/10 text-primary">
                Last: {formatCost(lastCost)}
              </Badge>
            )}
            <Badge variant="outline" className="gap-1.5 border-success/30 bg-success/10 text-success">
              Total: {formatCost(totalCost)}
            </Badge>
          </div>
        </div>
      </footer>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex h-[420px] flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border/60 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
        <Wand2 className="h-6 w-6 text-primary" />
      </div>
      <div>
        <p className="text-sm font-medium">Ready when you are</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Paste code on the left and hit <span className="text-foreground">Generate</span>.
        </p>
      </div>
    </div>
  );
}

function ScoreCard({ label, before, after }: { label: string; before: number; after: number }) {
  const delta = after - before;
  return (
    <div className="rounded-lg border border-border bg-muted/30 p-3">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <div className="mt-2 flex items-end gap-2">
        <span className="font-mono text-2xl font-semibold">{after}</span>
        <span className="pb-1 text-xs text-muted-foreground">/ 10</span>
        <span className={`ml-auto pb-1 text-xs ${delta >= 0 ? "text-success" : "text-destructive"}`}>
          {delta >= 0 ? "+" : ""}{delta} vs {before}
        </span>
      </div>
    </div>
  );
}
