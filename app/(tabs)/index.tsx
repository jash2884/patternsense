import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { detectPatternFromText } from "../../utils/patternDetector";

export default function HomeScreen() {
  const [problem, setProblem] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [aiData, setAiData] = useState<any | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);

  const aiErrorLogged = useRef(false);

  const detectPattern = async () => {
    Keyboard.dismiss();

    // Local detection (always works)
    const detected = detectPatternFromText(problem);
    setResults(detected);

    // AI suggestions
    try {
      setLoadingAI(true);
      setAiData(null);

      const response = await fetch(
        "https://patternsense.onrender.com/api/ai/examples",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            problem,
            patterns: detected.map((d) => d.pattern),
          }),
        }
      );

      const data = await response.json();

      // HARD GUARD
      if (!data || !Array.isArray(data.examples)) {
        throw new Error("Invalid AI response");
      }

      setAiData(data);
    } catch (err) {
      if (!aiErrorLogged.current) {
        console.warn("AI unavailable, falling back");
        aiErrorLogged.current = true;
      }
      setAiData(null);
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* HEADER */}
          <Text style={styles.title}>PatternSense 🧠</Text>
          <Text style={styles.subtitle}>DSA Problem Pattern Detector</Text>

          {/* INPUT */}
          <TextInput
            style={styles.input}
            placeholder="Paste your DSA problem statement here..."
            placeholderTextColor="#64748b"
            multiline
            value={problem}
            onChangeText={setProblem}
          />

          {/* BUTTON */}
          <TouchableOpacity
            style={styles.button}
            onPress={detectPattern}
            disabled={!problem.trim()}
          >
            <Text style={styles.buttonText}>Detect Pattern</Text>
          </TouchableOpacity>

          {/* LOCAL RESULTS */}
          {results.length > 0 && (
            <View style={styles.resultBox}>
              <Text style={styles.resultTitle}>Top Suggested Approaches</Text>

              {results.map((res, idx) => (
                <View key={idx} style={styles.resultItem}>
                  <Text style={styles.resultText}>
                    {idx + 1}. {res.pattern} ({res.confidence}%)
                  </Text>
                  <Text style={styles.reason}>{res.reason}</Text>
                </View>
              ))}
            </View>
          )}

          {/* LOADING */}
          {loadingAI && (
            <Text style={styles.loadingText}>Thinking like a mentor 🤔...</Text>
          )}

          {/* AI SUGGESTIONS */}
          {aiData?.examples && (
            <View style={styles.resultBox}>
              <Text style={styles.resultTitle}>AI Suggestions</Text>

              <Text style={styles.knowledgeTitle}>Example Problems</Text>

              {aiData.examples.map((ex: any, i: number) => {
                // STRING EXAMPLE
                if (typeof ex === "string") {
                  return (
                    <Text key={i} style={styles.knowledgeText}>
                      • {ex}
                    </Text>
                  );
                }

                // OBJECT EXAMPLE (input/output/explanation)
                if (typeof ex === "object") {
                  return (
                    <View key={i} style={{ marginTop: 8 }}>
                      <Text style={styles.knowledgeText}>
                        • Input: {ex.input}
                      </Text>
                      <Text style={styles.knowledgeText}>
                        Output: {ex.output}
                      </Text>
                      {ex.explanation && (
                        <Text
                          style={[styles.knowledgeText, { color: "#94a3b8" }]}
                        >
                          {ex.explanation}
                        </Text>
                      )}
                    </View>
                  );
                }

                return null;
              })}

              {/* APPROACH */}
              {aiData.approach && (
                <>
                  <Text style={styles.knowledgeTitle}>Approach</Text>
                  <Text style={styles.knowledgeText}>{aiData.approach}</Text>
                </>
              )}

              {/* COMPLEXITY */}
              {aiData.complexity && (
                <>
                  <Text style={styles.knowledgeTitle}>Complexity</Text>
                  <Text style={styles.knowledgeText}>
                    Time: {aiData.complexity.time}
                  </Text>
                  <Text style={styles.knowledgeText}>
                    Space: {aiData.complexity.space}
                  </Text>
                </>
              )}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#020617",
  },
  container: {
    padding: 16,
    paddingBottom: 140,
    backgroundColor: "#020617",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#38bdf8",
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#cbd5f5",
    textAlign: "center",
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#020617",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1e293b",
    padding: 14,
    color: "#e5e7eb",
    minHeight: 100,
    marginBottom: 14,
  },
  button: {
    backgroundColor: "#38bdf8",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonText: {
    fontWeight: "bold",
    color: "#020617",
    fontSize: 16,
  },
  resultBox: {
    backgroundColor: "#020617",
    borderRadius: 12,
    padding: 14,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#1e293b",
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#38bdf8",
    marginBottom: 8,
  },
  resultItem: {
    marginBottom: 10,
  },
  resultText: {
    color: "#e5e7eb",
    fontWeight: "600",
  },
  reason: {
    color: "#94a3b8",
    fontSize: 13,
    marginTop: 2,
  },
  loadingText: {
    color: "#94a3b8",
    marginTop: 10,
    textAlign: "center",
  },
  knowledgeTitle: {
    color: "#38bdf8",
    fontWeight: "bold",
    marginTop: 10,
  },
  knowledgeText: {
    color: "#e5e7eb",
    marginTop: 4,
    fontSize: 13,
  },
});
