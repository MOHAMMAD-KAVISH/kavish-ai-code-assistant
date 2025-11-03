import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import Groq from "groq-sdk";
import path from "path";
import { fileURLToPath } from "url";

// ✅ Load environment variables
dotenv.config({
  path: "C:/Users/Mohammad Kavish/projects/kavish-ai-code-assistant/backend/.env",
});

console.log("🔑 Loaded GROQ_API_KEY =", process.env.GROQ_API_KEY ? "✅ Present" : "❌ Missing");

// ✅ Initialize Express app
const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());

// 🧱 Apply rate limiter (before routes)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
});
app.use(limiter);

// 🧠 Initialize Groq client
const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ✅ Test route
app.get("/", (req, res) => {
  res.send("✅ Groq-powered AI Server is running successfully!");
});

// 💬 Chat route with detailed debugging
app.post("/api/chat", async (req, res) => {
  console.log("🔥 POST request received at /api/chat");
  console.log("📦 Request body:", req.body);

  try {
    const { message } = req.body;

    if (!message) {
      console.log("⚠️ No message found in body!");
      return res.status(400).json({ error: "Message is required" });
    }

    console.log("🟢 Sending message to Groq:", message);

    // 🔥 Call Groq API
    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: message }],
    });

    console.log("✅ Groq API raw response received");

    // ✅ Extract reply safely
    const aiReply = response?.choices?.[0]?.message?.content || "⚠️ No reply received from Groq";
    console.log("🤖 AI Reply:", aiReply);

    res.json({ reply: aiReply });
  } catch (err) {
    console.error("💥 Error in /api/chat:", err.message);
    console.error("📄 Stack:", err.stack);
    res.status(500).json({ error: "Internal server error", details: err.message });
  }
});

// 🚀 Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Groq Server started on port ${PORT}`));
