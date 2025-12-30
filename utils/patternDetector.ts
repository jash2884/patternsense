import { semanticMatch } from "./semanticMatcher";

export type DetectionResult = {
  pattern: string;
  confidence: number;
  reason: string;
};

export type RankedDetection = DetectionResult[];

export function detectPatternFromText(text: string): RankedDetection {
  const input = text.toLowerCase();
  const results: RankedDetection = [];

  // Binary Search
  if (
    input.includes("binary search") ||
    (input.includes("sorted") &&
      (input.includes("search") ||
        input.includes("find") ||
        input.includes("first") ||
        input.includes("last")))
  ) {
    results.push({
      pattern: "Binary Search",
      confidence: 90,
      reason:
        "Searching or finding elements in a sorted structure strongly suggests binary search.",
    });
  }

  // Greedy – Activity Selection
  if (
    input.includes("activity") ||
    input.includes("activities") ||
    input.includes("interval") ||
    (input.includes("maximum") && input.includes("select"))
  ) {
    results.push({
      pattern: "Greedy",
      confidence: 85,
      reason:
        "Selecting the maximum number of activities or intervals is a classic greedy problem.",
    });
  }

  // Sorting
  if (
    input.includes("sort") ||
    input.includes("sorting") ||
    (input.includes("arrange") && input.includes("order"))
  ) {
    results.push({
      pattern: "Core Algorithm: Sorting",
      confidence: 80,
      reason: "The problem explicitly asks to arrange elements in order.",
    });
  }

  // Sliding Window
  if (
    input.includes("subarray") ||
    input.includes("window") ||
    input.includes("contiguous")
  ) {
    results.push({
      pattern: "Sliding Window",
      confidence: 75,
      reason: "Mentions contiguous subarrays or windows.",
    });
  }

  // Graph
  if (
    input.includes("graph") ||
    input.includes("edges") ||
    input.includes("nodes")
  ) {
    results.push({
      pattern: "Graph (BFS / DFS)",
      confidence: 70,
      reason: "Nodes and edges indicate graph traversal.",
    });
  }

  // DP
  if (
    input.includes("dp") ||
    input.includes("dynamic programming") ||
    input.includes("maximize") ||
    input.includes("minimize")
  ) {
    results.push({
      pattern: "Dynamic Programming",
      confidence: 65,
      reason: "Optimization language suggests DP.",
    });
  }
  // 🧠 Semantic ML boost
  const semanticResults = semanticMatch(input);

  semanticResults.forEach((s) => {
    results.push({
      pattern: s.pattern,
      confidence: Math.round(60 + s.score * 40),
      reason:
        "Detected using semantic similarity between the problem description and known pattern definitions.",
    });
  });

  // Fallback
  if (results.length === 0) {
    return [
      {
        pattern: "Unclear",
        confidence: 40,
        reason: "The description does not strongly match known DSA patterns.",
      },
    ];
  }

  // Sort by confidence (descending) and return top 3
  return results.sort((a, b) => b.confidence - a.confidence).slice(0, 3);
}
