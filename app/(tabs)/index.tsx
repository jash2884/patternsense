import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
} from "react-native";

export default function HomeScreen() {
  const [problem, setProblem] = useState("");
  const [pattern, setPattern] = useState("");

  const detectPattern = () => {
    Keyboard.dismiss(); // hide keyboard on button press
    const text = problem.toLowerCase();

    if (
      text.includes("subarray") ||
      text.includes("window") ||
      text.includes("contiguous")
    ) {
      setPattern("Sliding Window");
    } else if (
      text.includes("graph") ||
      text.includes("edges") ||
      text.includes("nodes") ||
      text.includes("shortest path")
    ) {
      setPattern("Graph / BFS / DFS");
    } else if (
      text.includes("maximize") ||
      text.includes("minimize") ||
      text.includes("dp") ||
      text.includes("dynamic")
    ) {
      setPattern("Dynamic Programming");
    } else if (
      text.includes("sorted") ||
      text.includes("two pointers") ||
      text.includes("left") ||
      text.includes("right")
    ) {
      setPattern("Two Pointers");
    } else {
      setPattern("Pattern unclear 🤔 Try adding more details.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Text style={styles.title}>PatternSense 🧠</Text>
          <Text style={styles.subtitle}>DSA Problem Pattern Detector</Text>

          <TextInput
            placeholder="Paste your DSA problem statement here..."
            placeholderTextColor="#94a3b8"
            multiline
            value={problem}
            onChangeText={setProblem}
            style={styles.input}
          />

          <Pressable style={styles.button} onPress={detectPattern}>
            <Text style={styles.buttonText}>Detect Pattern</Text>
          </Pressable>

          {pattern !== "" && (
            <View style={styles.resultBox}>
              <Text style={styles.resultTitle}>Detected Pattern</Text>
              <Text style={styles.resultText}>{pattern}</Text>
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#38bdf8",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#e5e7eb",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#020617",
    color: "#e5e7eb",
    minHeight: 120,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#334155",
    marginBottom: 16,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#38bdf8",
    paddingVertical: 14,
    borderRadius: 10,
  },
  buttonText: {
    color: "#020617",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  resultBox: {
    marginTop: 20,
    padding: 16,
    borderRadius: 10,
    backgroundColor: "#020617",
    borderWidth: 1,
    borderColor: "#334155",
  },
  resultTitle: {
    color: "#94a3b8",
    fontSize: 14,
    marginBottom: 6,
  },
  resultText: {
    color: "#38bdf8",
    fontSize: 18,
    fontWeight: "bold",
  },
});
