

// Import required packages
const express = require("express");
const cors = require("cors");

const app = express(); // Create an Express app instance
const PORT = 5000; // Server will listen on this port

// Enable CORS for all origins (you can restrict this in production)
app.use(cors());

// Define the route to serve image requests
app.get("/api/image", (req, res) => {
  const prompt = req.query.prompt; // Get 'prompt' query parameter

  // Validate the prompt parameter: check if it exists
  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  // Encode the prompt to safely use it in a URL
  const encodedPrompt = encodeURIComponent(prompt);

  // Generate an image URL using the prompt as a seed
  const imageUrl = `https://picsum.photos/seed/${encodedPrompt}/600/400`;

  // Redirect the client to the generated image URL
  res.redirect(imageUrl);
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
