// Prompt Library — curated documentation styles users can pick from.
// Each preset adds an extra instruction appended to the documentation system prompt.

export type PromptPreset = {
  id: string;
  label: string;
  description: string;
  instruction: string;
};

export const PROMPT_LIBRARY: PromptPreset[] = [
  {
    id: "standard",
    label: "Standard",
    description: "Balanced docs for working engineers.",
    instruction: "",
  },
  {
    id: "beginner",
    label: "Beginner-friendly",
    description: "Plain-English, assumes little prior knowledge.",
    instruction:
      "Write the explanation and inline comments for a junior developer with 6 months of experience. Avoid jargon, define every non-obvious term, and prefer short sentences.",
  },
  {
    id: "enterprise",
    label: "Enterprise / strict",
    description: "Formal tone, complete docstrings, type contracts.",
    instruction:
      "Use a formal, enterprise tone. Docstrings must be exhaustive: parameters, return values, raised exceptions, thread-safety, and side effects. Inline comments should reference invariants and contracts.",
  },
  {
    id: "security",
    label: "Security review",
    description: "Highlight injection, auth, and data-exposure risks.",
    instruction:
      "Treat the code as a security review. In edge_cases, focus on injection, authn/authz, secret handling, unsafe deserialization, SSRF, and data exposure. The explanation must call out the trust boundary.",
  },
  {
    id: "performance",
    label: "Performance audit",
    description: "Call out hot paths, allocations, and complexity.",
    instruction:
      "Focus on performance. In the explanation, identify hot paths, big-O, memory allocations, and N+1 patterns. Edge cases should include large-input behavior and worst-case complexity.",
  },
  {
    id: "refactor",
    label: "Refactor suggestions",
    description: "Inline comments propose improvements.",
    instruction:
      "In addition to documenting, the inline comments should propose concrete refactors (rename, extract function, replace magic numbers, simplify control flow). Mark suggestions with `// REFACTOR:` or `# REFACTOR:`.",
  },
  {
    id: "tutorial",
    label: "Tutorial / blog post",
    description: "README snippet reads like a tutorial.",
    instruction:
      "The readme_snippet should read like a short tutorial blog post: motivation, walk-through, and a 'try it yourself' section. The explanation should be narrative, not bullet-point.",
  },
  {
    id: "api-docs",
    label: "Public API docs",
    description: "Optimized for an external SDK reference page.",
    instruction:
      "Treat this code as a public SDK surface. Docstring must include a stability marker, version, and a fully runnable usage example. The readme_snippet should match the style of Stripe / Twilio API reference pages.",
  },
];

export const getPromptPreset = (id: string | undefined): PromptPreset =>
  PROMPT_LIBRARY.find((p) => p.id === id) ?? PROMPT_LIBRARY[0];
