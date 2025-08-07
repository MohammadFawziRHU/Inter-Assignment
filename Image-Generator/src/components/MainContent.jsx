// src/components/MainContent.jsx
import React, { useState } from "react";
import "./Styles/MainContent.css";

export default function MainContent() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = () => {
    if (!prompt.trim()) return;

    setLoading(true);

    const encodedPrompt = encodeURIComponent(prompt.trim());
    const url = `https://picsum.photos/seed/${encodedPrompt}/600/400`;

    // simulate loading delay
    setTimeout(() => {
      setImageUrl(url);
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="main-content">
      <div className="top-bar">
        <input
          type="text"
          placeholder="Describe your image..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button onClick={handleGenerate}>Generate</button>
      </div>

      <div className="output-section">
        {loading && <div className="loader">Generating...</div>}

        {!loading && imageUrl && (
          <div className="image-card">
            <img src={imageUrl} alt="Generated" />
            <div className="image-info">
              <p><strong>Prompt:</strong> {prompt}</p>
              <p><strong>Size:</strong> 600x400 px</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
