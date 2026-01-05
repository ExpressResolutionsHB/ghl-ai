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

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ ok: false, error: "OPENAI_API_KEY missing in Render env" });
    }

    const ai = await client.responses.create({
      model: "gpt-4.1-mini",
      input: `Reply by SMS. Max 320 chars. Ask ONE question only.\n\nLead: ${first_name || "there"}\nInbound: ${message}`
    });

    const reply = (ai.output_text || "").trim();
    return res.json({ ok: true, reply });
  } catch (e) {
    console.error("AI ERROR:", e?.message || e);
    return res.status(500).json({ ok: false, error: "AI server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port", PORT));
