import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

router.post("/examples", async (req, res) => {
  try {
    console.log("✅ AI endpoint hit");

    const { problem, patterns } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      throw new Error("Missing GEMINI_API_KEY in environment variables.");
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // We use gemini-2.0-flash which is the current standard.
    // If you still get a 404, try "gemini-1.5-pro" as a backup.
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const prompt = `
      You are a DSA mentor. Provide clear examples for this problem.
      Problem: "${problem}"
      Patterns: ${patterns ? patterns.join(", ") : "None"}

      Return ONLY a JSON object:
      {
        "examples": ["string"],
        "approach": "string",
        "complexity": { "time": "string", "space": "string" }
      }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    res.json(JSON.parse(responseText));
  } catch (err) {
    console.error("❌ Gemini AI error:", err.message);

    // Provide a helpful error message to the frontend
    const statusCode = err.message.includes("not found") ? 404 : 500;
    res.status(statusCode).json({
      error: "AI service unavailable",
      message: err.message,
      tip: "If you see 404, check if your API Key is restricted or try model 'gemini-1.5-pro'.",
    });
  }
});

export default router;
