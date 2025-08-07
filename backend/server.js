// backend/server.js
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());

// Route: GET /api/image?prompt=your_prompt
app.get("/api/image", (req, res) => {
  const prompt = req.query.prompt;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  const encodedPrompt = encodeURIComponent(prompt);
  const imageUrl = `https://picsum.photos/seed/${encodedPrompt}/600/400`;

  // Redirect to the image URL
  res.redirect(imageUrl);
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
