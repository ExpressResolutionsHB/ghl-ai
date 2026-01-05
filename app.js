import express from "express";
import OpenAI from "openai";

const app = express();
app.use(express.json({ limit: "1mb" }));

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.post("/ghl-ai", async (req, res) => {
  try {
    const { first_name, phone, message } = req.body || {};
    if (!phone || !message) {
      return res.status(400).json({ ok: false, error: "Missing phone or message" });
    }

    const instructions =
      "You are a real estate acquisitions assistant. Reply by SMS. " +
      "Max 320 characters. Direct, friendly, no fluff. " +
      "Goal: get condition + timeline + asking price. Ask ONE question only.";

    const input =
      `Lead name: ${first_name || "there"}\n` +
      `Inbound SMS: ${message}\n\n` +
      `Write the best single-question SMS reply now.`;

    const ai = await client.responses.create({
      model: "gpt-5", // you can change later
      instructions,
      input
    });

    const reply = (ai.output_text || "").trim();

    return res.json({ ok: true, reply });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, error: "AI server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port", PORT));
