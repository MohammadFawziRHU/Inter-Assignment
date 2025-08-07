import React, { useState, useEffect } from "react";
import "./Styles/MainContent.css";

const STORAGE_KEY = "savedImages";
const EXPIRATION_MS = 2 * 24 * 60 * 60 * 1000; // 2 days expiration for saved images

const SIZE_OPTIONS = [
  { label: "512x512", width: 512, height: 512 },
  { label: "768x768", width: 768, height: 768 },
  { label: "1024x1024", width: 1024, height: 1024 },
  { label: "1280x720", width: 1280, height: 720 },
  { label: "1920x1080", width: 1920, height: 1080 },
];

// Helper to generate download URL based on prompt and size
const generateDownloadUrl = (prompt, width, height) => {
  const safePrompt = encodeURIComponent(
    prompt.trim().toLowerCase().replace(/\s+/g, "-")
  );
  return `https://picsum.photos/seed/${safePrompt}/${width}/${height}`;
};

export default function MainContent() {
  // --- State declarations ---
  const [prompt, setPrompt] = useState("");
  const [imageGroups, setImageGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeGroupIndex, setActiveGroupIndex] = useState(null);
  const [selectedSize, setSelectedSize] = useState(SIZE_OPTIONS[2]);
  const [savedMessageVisible, setSavedMessageVisible] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedPreviewUrl, setSelectedPreviewUrl] = useState(null);

  // --- Load saved images from localStorage on mount ---
  useEffect(() => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      try {
        const parsed = JSON.parse(data);
        const now = Date.now();
        const filtered = parsed.filter(
          (group) => now - group.savedAt < EXPIRATION_MS
        );
        setImageGroups(
          filtered.map((group) => {
            delete group.savedAt; 
            return group;
          })
        );
      } catch (e) {
        console.error("Invalid saved data", e);
      }
    }
  }, []);

  // --- Update selected size & preview URL when active image group changes ---
  useEffect(() => {
    if (activeGroupIndex !== null) {
      const group = imageGroups[activeGroupIndex];
      if (group) {
        const sizeOption =
          SIZE_OPTIONS.find((s) => s.label === group.size) || SIZE_OPTIONS[2];
        setSelectedSize(sizeOption);
        setSelectedPreviewUrl(group.versions[group.selectedVersion].url);
      }
    }
  }, [activeGroupIndex, imageGroups]);

  // --- Update preview URL when selected version changes ---
  useEffect(() => {
    if (activeGroupIndex !== null) {
      setSelectedPreviewUrl(
        imageGroups[activeGroupIndex].versions[
          imageGroups[activeGroupIndex].selectedVersion
        ].url
      );
    }
  }, [imageGroups[activeGroupIndex]?.selectedVersion]);

  // --- Helper to save images to localStorage with timestamp ---
  const persistImages = (groups) => {
    const now = Date.now();
    const dataToSave = groups.map((group) => ({
      ...group,
      savedAt: now,
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  };

  // --- Generate new image and add to groups ---
  const generateImage = () => {
    if (!prompt.trim()) return;
    setLoading(true);
    const trimmedPrompt = prompt.trim();
    const encodedPrompt = encodeURIComponent(trimmedPrompt);
    const url = `http://localhost:5000/api/image?prompt=${encodedPrompt}&t=${Date.now()}`;

    // Simulate API call delay
    setTimeout(() => {
      const newGroups = [
        {
          prompt: trimmedPrompt,
          size: selectedSize.label,
          versions: [{ url, id: Date.now() }],
          selectedVersion: 0,
        },
        ...imageGroups,
      ];
      setImageGroups(newGroups);
      persistImages(newGroups);
      setLoading(false);
    }, 1200);
  };

  // --- Retry generation for current active group ---
 const handleRetry = () => {
  if (activeGroupIndex === null) return;
  const group = imageGroups[activeGroupIndex];

  // Append a random suffix to the prompt for variability
  const randomSuffix = Math.floor(Math.random() * 10000);
  const encodedPrompt = encodeURIComponent(`${group.prompt}-${randomSuffix}`);

  // Construct the URL with the modified prompt seed
  const url = `http://localhost:5000/api/image?prompt=${encodedPrompt}`;

  setLoading(true);

  setTimeout(() => {
    const updatedGroups = [...imageGroups];
    updatedGroups[activeGroupIndex].versions.unshift({
      url,
      id: Date.now(),
    });
    setImageGroups(updatedGroups);
    persistImages(updatedGroups);
    setLoading(false);
  }, 1200);
};


  // --- Select a specific version of an image ---
  const handleSelectVersion = (versionIndex) => {
    if (activeGroupIndex === null) return;
    const updatedGroups = [...imageGroups];
    updatedGroups[activeGroupIndex].selectedVersion = versionIndex;
    setImageGroups(updatedGroups);
  };

  // --- Save size selection for active group ---
  const handleSaveSelection = () => {
    if (activeGroupIndex === null) return;
    const updatedGroups = [...imageGroups];
    updatedGroups[activeGroupIndex].size = selectedSize.label;
    setImageGroups(updatedGroups);
    persistImages(updatedGroups);
    setSavedMessageVisible(true);
    setTimeout(() => setSavedMessageVisible(false), 2000);
  };

  // --- Download selected image version ---
  const handleDownload = async () => {
    if (activeGroupIndex === null) return;
    const group = imageGroups[activeGroupIndex];
    const { width, height } = selectedSize;
    const downloadUrl = generateDownloadUrl(group.prompt, width, height);
    try {
      const response = await fetch(downloadUrl, { mode: "cors" });
      if (!response.ok) throw new Error("Network response was not ok");
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${group.prompt.replace(/\s+/g, "_")}_${width}x${height}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      alert("Failed to download image. Try opening it in a new tab and saving manually.");
      console.error("Download error:", error);
    }
  };

 return (
  <>
    {/* --- Main Content Container --- */}
    <div className={`main-content ${showPreview ? "blurred" : ""}`}>
      {/* --- Top Bar: Prompt input and generate button --- */}
      <div className="top-bar">
        <input
          type="text"
          placeholder="Describe your image..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button onClick={generateImage}>Generate</button>
      </div>

      {/* --- Output Section --- */}
      <div
        className="output-section"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0px",       // No gap, images will touch each other
          marginLeft: "250px",
          marginTop: "20px",
        }}
      >
        {loading && <div className="loader"></div>}

        {!loading &&
          imageGroups.map((group, groupIndex) => (
            <div
              key={groupIndex}
              className="image-card"
              onClick={() => setActiveGroupIndex(groupIndex)}
              style={{ width: 320, cursor: "pointer" }}
            >
              <img
                src={group.versions[group.selectedVersion].url}
                alt="Generated"
                style={{ width: "100%", height: "auto", display: "block" }}
              />
              {/* Removed prompt and size info here */}
            </div>
          ))}
      </div>

      {/* --- Side Panel --- */}
      {activeGroupIndex !== null && (
        <div className="side-panel">
          <button
            className="close-btn"
            onClick={() => {
              setActiveGroupIndex(null);
              setShowPreview(false);
            }}
          >
            ✕
          </button>

          <h3>Prompt:</h3>
          <p>{imageGroups[activeGroupIndex].prompt}</p>

          <h3>Size:</h3>
          <p>{imageGroups[activeGroupIndex].size}</p>

          {/* --- Preview Thumbnail to open preview modal --- */}
          <div
            className="preview-thumbnail"
            style={{ cursor: "pointer", margin: "10px 0" }}
          >
            <img
              src={selectedPreviewUrl}
              alt="Preview Thumbnail"
              style={{ maxWidth: "100%", borderRadius: "8px" }}
              onClick={() => setShowPreview(true)}
            />
            <small>Click image to preview</small>
          </div>

          {/* --- Size selector dropdown --- */}
          <div className="size-selector">
            <label>Select size:</label>
            <select
              className="styled-select"
              value={selectedSize.label}
              onChange={(e) =>
                setSelectedSize(
                  SIZE_OPTIONS.find((size) => size.label === e.target.value)
                )
              }
            >
              {SIZE_OPTIONS.map((size) => (
                <option key={size.label} value={size.label}>
                  {size.label}
                </option>
              ))}
            </select>
          </div>

          {/* --- Buttons: Retry, Save, Download --- */}
          <div className="button-row" style={{ alignItems: "center" }}>
            <button onClick={handleRetry}>Retry</button>
            <button onClick={handleSaveSelection}>OK (Save)</button>
            <button
              onClick={handleDownload}
              style={{ marginLeft: "auto", backgroundColor: "#187632" }}
            >
              Download
            </button>
            {savedMessageVisible && (
              <span
                className="saved-message"
                style={{ marginLeft: "10px", color: "#4caf50" }}
              >
                Saved ✓
              </span>
            )}
          </div>

          {/* --- Versions List --- */}
          <h4>All Versions:</h4>
          <div className="versions">
            {imageGroups[activeGroupIndex].versions.map((version, index) => (
              <div
                key={version.id}
                className={`version-thumb ${
                  index === imageGroups[activeGroupIndex].selectedVersion
                    ? "selected"
                    : ""
                }`}
                onClick={() => handleSelectVersion(index)}
              >
                <img src={version.url} alt={`Version ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>

    {/* --- Preview Modal --- */}
    {showPreview && selectedPreviewUrl && (
      <div
        className="preview-modal"
        onClick={() => {
          setShowPreview(false);
        }}
      >
        <img src={selectedPreviewUrl} alt="Preview" className="preview-image" />
      </div>
    )}
  </>
);

}