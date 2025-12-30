import { PATTERN_DESCRIPTIONS } from "./mlConfig";

function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, "")
      .split(" ")
      .filter(Boolean)
  );
}

function similarity(a: Set<string>, b: Set<string>): number {
  const intersection = new Set([...a].filter((x) => b.has(x)));
  const union = new Set([...a, ...b]);
  return intersection.size / union.size;
}

export function semanticMatch(inputText: string) {
  const inputTokens = tokenize(inputText);

  return PATTERN_DESCRIPTIONS.map((p) => {
    const patternTokens = tokenize(p.description);
    const score = similarity(inputTokens, patternTokens);

    return {
      pattern: p.pattern,
      score,
    };
  })
    .sort((a, b) => b.score - a.score)
    .slice(0, 2); // top semantic hints
}
