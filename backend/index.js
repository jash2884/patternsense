import dotenv from "dotenv";
dotenv.config();
// console.log("OPENAI KEY FOUND:", !!process.env.OPENAI_API_KEY);

import express from "express";
import cors from "cors";
import aiRoutes from "./routes/ai.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/ai", aiRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
