import "dotenv/config";
import express from "express";
import { GoogleGenAI } from "@google/genai";

const app = express();
app.use(express.json());

// Initialize Gemini client
const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

// Quick log check
console.log("Google API Key Loaded:", process.env.GOOGLE_API_KEY ? "YES" : "NO");

/**
 * Function to query Gemini 2.5 Flash
 */
async function queryGemini(prompt) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    // response.text is the final output
    const output = response?.text || null;

    if (!output) throw new Error("Empty AI output received.");

    return output;

  } catch (error) {
    console.error("Gemini API Error:", error.message);
    throw error;
  }
}

/**
 * POST /api/chat
 * AI Finance Chatbot Endpoint
 */
app.post("/api/chat", async (req, res) => {
  try {
    const { userMessage } = req.body;

    if (!userMessage || userMessage.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "Missing userMessage",
      });
    }

    // Finance-focused system prompt
    const financePrompt = `
You are an AI Finance Coach. Respond clearly, with practical financial guidance.

User: ${userMessage}
`;

    const aiResponse = await queryGemini(financePrompt);

    return res.json({
      success: true,
      user: userMessage,
      aiResponse,
    });

  } catch (error) {
    console.error("Error in /api/chat:", error);

    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      details: error.message,
    });
  }
});

/**
 * Health Check
 */
app.get("/", (req, res) => {
  res.json({
    status: "AI Financial Wellness Coach Backend Running",
  });
});

/**
 * Start Server
 */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend running at: http://localhost:${PORT}`);
});
