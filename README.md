# DocuCode AI

> Auto-document messy code with AI — paste any function, get clean docstrings, inline comments, tests, and a README in seconds.

**Live demo:** https://docucodeai.lovable.app

![DocuCode AI](https://img.shields.io/badge/stack-TanStack%20Start-6366F1) ![React](https://img.shields.io/badge/React-19-61DAFB) ![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6) ![AI](https://img.shields.io/badge/AI-Lovable%20Gateway-A78BFA)

---

## Table of Contents

- [What is DocuCode AI?](#what-is-docucode-ai)
- [Why it exists](#why-it-exists)
- [Features](#features)
- [Supported languages](#supported-languages)
- [How it works](#how-it-works)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Configuration](#configuration)
- [API reference](#api-reference)
- [Design system](#design-system)
- [Deployment](#deployment)
- [Roadmap](#roadmap)
- [License](#license)

---

## What is DocuCode AI?

DocuCode AI is a single-page web app that turns messy, undocumented source code into production-grade documentation. A developer pastes a function, query, or class into the editor; the app calls a large language model and returns a structured bundle:

- **Commented code** — original source, annotated line-by-line
- **Docstring** — properly formatted for the target language
- **Plain explanation** — 2–4 sentences in human English
- **Unit test** — runnable in the language's standard test framework
- **README snippet** — Markdown ready to paste into a repo
- **Complexity score** + **edge cases** the model flagged

Everything is rendered with syntax highlighting and one-click copy. A built-in *Before vs After* analyzer scores the readability and maintainability gain.

## Why it exists

Developers spend roughly **75 % of their time reading code**, not writing it. Legacy codebases lack docstrings, READMEs, and inline comments — which means every new engineer pays an "onboarding tax" of days deciphering cryptic functions. DocuCode AI compresses that documentation step from hours to seconds, and produces output structured enough to drop straight into the codebase, test suite, and project README.

## Features

| Feature | Description |
|---|---|
| **Inline comments** | Original code with helpful `# / //` annotations on every meaningful line |
| **Docstring** | Google-style for Python, JSDoc for JS/TS, Javadoc for Java, SQL block comments for SQL |
| **Plain explanation** | 2–4 sentence summary suitable for non-authors of the code |
| **Unit test** | pytest / Jest / JUnit / SQL assertion snippet, ready to run |
| **README snippet** | Markdown section with heading, usage example, and notes |
| **Complexity score** | `simple`, `moderate`, or `complex` tag rendered as a colored badge |
| **Edge cases** | 3–6 failure modes the model identified |
| **Before vs After** | `/api/compare` scores readability + maintainability uplift and estimates onboarding minutes saved |
| **Auto language detection** | Heuristic regex-based detector for Python, JS, TS, SQL, Java, Go, Rust |
| **Cost transparency** | Per-request and cumulative token cost shown in the UI |
| **Example loader** | Pre-loaded messy snippets to demo the app instantly |

## Supported languages

`Python` · `JavaScript` · `TypeScript` · `SQL` · `Java` · `Go` · `Rust` · *(auto-detect)*

The model handles other languages too — just paste the code and pick the closest match (or leave on **Auto**).

## How it works

```
┌─────────┐   POST /api/document   ┌─────────────┐   chat.completions   ┌──────────────┐
│ Browser │ ─────────────────────► │ Server fn   │ ───────────────────► │ AI Gateway   │
│  (UI)   │                        │ (edge)      │                      │ → Gemini 2.5 │
└─────────┘ ◄───── JSON ────────── └─────────────┘ ◄─── JSON object ─── └──────────────┘
```

The system prompt instructs the model to return **only** a JSON object with this exact shape:

```ts
{
  commented_code: string;
  docstring: string;
  explanation: string;
  test_snippet: string;
  readme_snippet: string;
  complexity_score: "simple" | "moderate" | "complex";
  edge_cases: string[];
}
```

The frontend parses the JSON, validates the shape, and renders each field into its own tab with Prism.js syntax highlighting.

## Tech stack

| Layer | Technology |
|---|---|
| **Framework** | [TanStack Start](https://tanstack.com/start) v1 (React 19 + TypeScript, SSR) |
| **Bundler** | Vite 7 |
| **Styling** | Tailwind CSS v4 with custom Midnight Indigo theme |
| **UI primitives** | [shadcn/ui](https://ui.shadcn.com/) (Radix under the hood) |
| **Highlighting** | `react-syntax-highlighter` (Prism) |
| **AI SDK** | [Vercel AI SDK](https://sdk.vercel.ai/) + `@ai-sdk/openai-compatible` |
| **LLM** | Gemini 2.5 Flash via [Lovable AI Gateway](https://docs.lovable.dev/features/ai) (swappable) |
| **Runtime** | TanStack server functions on Cloudflare Workers (edge) |
| **Notifications** | `sonner` toasts |

## Project structure

```
src/
├── components/
│   ├── CodeBlock.tsx          # Prism syntax-highlighted block + copy button
│   └── ui/                    # shadcn primitives (button, dialog, tabs, …)
├── lib/
│   ├── ai-gateway.ts          # Lovable AI Gateway provider factory
│   ├── examples.ts            # Pre-loaded messy code samples
│   ├── pricing.ts             # Token cost estimation
│   └── prompts.ts             # System prompts (document + compare)
├── routes/
│   ├── __root.tsx             # HTML shell + global providers
│   ├── index.tsx              # Main two-column workspace
│   └── api/
│       ├── document.ts        # POST /api/document  — generate docs
│       └── compare.ts         # POST /api/compare   — before/after scoring
├── styles.css                 # Midnight Indigo design tokens (oklch)
├── router.tsx                 # TanStack Router config
└── start.ts                   # SSR entry
```

## Getting started

### Prerequisites

- **Node.js 20+**
- **Bun** (recommended) or npm/pnpm

### Install & run

```bash
# install dependencies
bun install

# start the dev server (http://localhost:5173)
bun dev

# production build
bun run build
```

That's it — no API keys required when running on the Lovable platform. The Lovable AI Gateway is wired in by default and free to use during the promotional period (Gemini models).

## Configuration

DocuCode AI defaults to the Lovable AI Gateway, but the AI client is built on `@ai-sdk/openai-compatible`, so you can swap in **any** OpenAI-compatible provider — OpenAI, DeepSeek, Groq, Together, Mistral, a self-hosted vLLM, etc. — by setting environment variables:

```bash
# .env
LLM_API_KEY=sk-...
LLM_BASE_URL=https://api.openai.com/v1
LLM_MODEL=gpt-4o-mini
```

Token pricing is configured in `src/lib/pricing.ts` so the on-screen cost estimator reflects whichever provider you wire up:

```ts
export const PRICING = {
  inputPerMillion: 0.15,   // USD per 1M input tokens
  outputPerMillion: 0.60,  // USD per 1M output tokens
};
```

## API reference

### `POST /api/document`

Generate documentation for a single code snippet.

**Request**

```json
{
  "code": "def p(d):\n    r=[]\n    ...",
  "language": "python"
}
```

**Response**

```json
{
  "ok": true,
  "model": "google/gemini-2.5-flash",
  "doc": {
    "commented_code": "...",
    "docstring": "...",
    "explanation": "...",
    "test_snippet": "...",
    "readme_snippet": "...",
    "complexity_score": "moderate",
    "edge_cases": ["empty input", "missing 'a' key", "..."]
  },
  "usage": { "inputTokens": 412, "outputTokens": 980, "cost": 0.000651 }
}
```

If the model returns malformed JSON, the response is `{ ok: false, raw: "<raw text>" }` and the UI shows the raw output for debugging.

### `POST /api/compare`

Score the readability and maintainability gain between an original snippet and its documented version.

**Request**

```json
{
  "original": "def p(d): ...",
  "documented": "def parse(data): ...",
  "language": "python"
}
```

**Response**

```json
{
  "ok": true,
  "comparison": {
    "readability_before": 3,
    "readability_after": 8,
    "maintainability_before": 4,
    "maintainability_after": 9,
    "onboarding_minutes_saved": 25,
    "key_improvements": ["meaningful names", "type hints", "..."],
    "summary": "The documented version replaces single-letter names …"
  }
}
```

## Design system

The visual direction is **Midnight Indigo** — a deep navy canvas with electric indigo and soft violet accents.

| Token | Value | Usage |
|---|---|---|
| `--background` | `oklch(0.10 0.03 270)` | Page background |
| `--foreground` | `oklch(0.96 0.01 250)` | Primary text |
| `--primary` | `oklch(0.62 0.20 275)` | Buttons, accents, focus rings |
| `--accent` | `oklch(0.74 0.16 295)` | Secondary highlights, italics |
| `--muted-foreground` | `oklch(0.65 0.02 260)` | Secondary text |

Fonts: **Space Grotesk** for display, **JetBrains Mono** for code. All tokens live in `src/styles.css` and are consumed via Tailwind's `bg-background`, `text-foreground`, etc. — components never hardcode hex values.

## Deployment

The app deploys to **Cloudflare Workers** via the Lovable hosting pipeline. Click *Publish* in the Lovable editor and a build is shipped to:

```
https://docucodeai.lovable.app
```

Custom domains can be wired up under **Project → Settings → Domains**. Preview deployments are produced on every commit so you can share work-in-progress URLs.

## Roadmap

- [x] Single-function documentation
- [x] Before / after impact analysis
- [x] 7+ languages with auto-detection
- [x] Cost transparency
- [ ] Multi-file project ingestion
- [ ] GitHub repository connector (drop a repo URL → get a PR with docs)
- [ ] Export full documentation set to Markdown / PDF
- [ ] VS Code extension
- [ ] CI/CD documentation gate (fail builds on undocumented public APIs)
- [ ] Team-shared style guides

## License

MIT — feel free to fork, remix, and ship.

---

*Built with [Lovable](https://lovable.dev) on TanStack Start + the Lovable AI Gateway.*
