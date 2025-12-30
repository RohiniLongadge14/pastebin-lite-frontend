import { useState } from "react";
import "./App.css";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

function App() {
  const [content, setContent] = useState("");
  const [pasteUrl, setPasteUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const createPaste = async () => {
    if (!content.trim()) {
      alert("Please enter some text");
      return;
    }

    setLoading(true);
    setPasteUrl("");

    try {
      // 🔹 STEP 1: Wake up backend (Replit cold start)
      await fetch(`${API_BASE}/api/healthz`, {
        method: "GET",
        cache: "no-store",
      });

      // 🔹 STEP 2: Wait for backend to fully start
      await new Promise((resolve) => setTimeout(resolve, 8000));

      // 🔹 STEP 3: Create paste
      const response = await fetch(`${API_BASE}/api/pastes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: content,
          maxViews: 5,
        }),
      });

      if (!response.ok) {
        throw new Error("Paste API failed");
      }

      const data = await response.json();

      // 🔹 STEP 4: Extract ID safely
      const pasteId =
        data.id || (data.url && data.url.split("/").pop());

      if (!pasteId) {
        throw new Error("Paste ID not returned");
      }

      // 🔹 STEP 5: Generate final link
      setPasteUrl(`${API_BASE}/p/${pasteId}`);
    } catch (error) {
      alert(
        "Backend is waking up. Please wait 10 seconds and click Create Paste again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="card">
        <h1>Pastebin Lite</h1>

        <p className="subtitle">
          Lightweight Pastebin-style app built with React & Spring Boot
        </p>

        <textarea
          placeholder="Enter your paste here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button onClick={createPaste} disabled={loading}>
          {loading ? "Creating..." : "Create Paste"}
        </button>

        {/* ✅ LINK WILL SHOW HERE */}
        {pasteUrl && (
          <div className="result">
            <strong>Paste created:</strong>
            <a href={pasteUrl} target="_blank" rel="noreferrer">
              {pasteUrl}
            </a>
          </div>
        )}

        <p className="footer">
          Built by <strong>Rohini Longadge</strong>
        </p>
      </div>
    </div>
  );
}

export default App;
