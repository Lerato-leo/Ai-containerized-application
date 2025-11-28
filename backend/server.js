import "dotenv/config";
import express from "express";
import { InferenceClient } from "@huggingface/inference";

const app = express();
app.use(express.json());

// Validate API key
if (!process.env.HF_TOKEN) {
  console.error("❌ ERROR: HF_TOKEN missing in .env");
  process.exit(1);
}

console.log("✓ Hugging Face Token Loaded");

// Initialize HuggingFace Client
const client = new InferenceClient(process.env.HF_TOKEN);

/**
 * Query DeepSeek-V3 using the HuggingFace Inference SDK
 */
async function queryDeepSeek(messages) {
  try {
    const response = await client.chatCompletion({
      model: "deepseek-ai/DeepSeek-V3:novita",
      messages,
      max_tokens: 2000,
      temperature: 0.7
    });

    const output = response?.choices?.[0]?.message?.content;

    if (!output) throw new Error("No content returned from DeepSeek-V3");

    return output;

  } catch (error) {
    console.error("🔴 DeepSeek-V3 Error:", error);
    throw new Error(error.message || "Failed calling DeepSeek-V3");
  }
}

/**
 * POST /api/chat
 * Generic financial coach chat endpoint
 */
app.post("/api/chat", async (req, res) => {
  try {
    const { userMessage, conversationHistory } = req.body;

    if (!userMessage || typeof userMessage !== "string") {
      return res.status(400).json({
        success: false,
        error: "Valid userMessage is required"
      });
    }

    // Build message history
    const messages = [
      {
        role: "system",
        content: `You are an AI Finance Coach. 
Your job is to help users understand budgeting, saving, investing, debt management, and overall financial literacy.
Be friendly, supportive, and give practical, actionable advice.`
      }
    ];

    if (Array.isArray(conversationHistory)) {
      messages.push(...conversationHistory);
    }

    messages.push({
      role: "user",
      content: userMessage
    });

    const aiResponse = await queryDeepSeek(messages);

    res.json({
      success: true,
      user: userMessage,
      aiResponse,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Failed to process your request",
      details: error.message
    });
  }
});

/**
 * POST /api/analyze-budget
 */
app.post("/api/analyze-budget", async (req, res) => {
  try {
    const { income, expenses, savings } = req.body;

    if (!income || !expenses) {
      return res.status(400).json({
        success: false,
        error: "Income and expenses are required"
      });
    }

    const prompt = `
Analyze the following budget as a financial advisor:

Monthly Income: ${income}
Monthly Expenses: ${expenses}
Current Savings: ${savings ?? 0}

Provide:
1. Budget health rating
2. Savings rate analysis
3. How sustainable this lifestyle is
4. Practical improvement recommendations
5. Financial goal suggestions
`;

    const aiResponse = await queryDeepSeek([
      { role: "user", content: prompt }
    ]);

    res.json({
      success: true,
      analysis: aiResponse,
      metrics: {
        savingsRate: savings ? Number((savings / income) * 100).toFixed(1) : 0,
        expenseRatio: Number((expenses / income) * 100).toFixed(1)
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Budget analysis failed",
      details: error.message
    });
  }
});

/**
 * Health Check
 */
app.get("/", (req, res) => {
  res.json({
    status: "online",
    model: "DeepSeek-V3 Novita",
    service: "AI Financial Coach API"
  });
});

/**
 * 404 Handler
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found"
  });
});

/**
 * Start Server
 */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════╗
║  AI Finance Coach Server Online  ║
║  Model: DeepSeek-V3 Novita       ║
║  Port: ${PORT}                         ║
╚══════════════════════════════════╝
`);
});
