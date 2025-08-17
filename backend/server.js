require("dotenv").config();  // Load environment variables
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Restrict CORS (only allow your frontend)
const allowedOrigins = [
  "http://localhost:5173",              // React dev server
  "https://your-frontend-domain.com"    // Replace with deployed frontend
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
}));

// Route: GET /api/image
app.get("/api/image", (req, res) => {
  const prompt = req.query.prompt;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  const encodedPrompt = encodeURIComponent(prompt);
  const imageUrl = `https://picsum.photos/seed/${encodedPrompt}/600/400`;

  res.redirect(imageUrl);
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
