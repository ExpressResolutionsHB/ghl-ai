import express from "express";

const app = express();
app.use(express.json({ limit: "1mb" }));

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.post("/ghl-ai", (req, res) => {
  console.log("BODY:", req.body);

  res.json({
    ok: true,
    reply: "Test reply from Render server"
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
