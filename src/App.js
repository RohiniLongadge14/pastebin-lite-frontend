import { useState } from "react";
import "./App.css";

// ✅ HARD-CODE BACKEND URL (NO ENV ISSUES)
const API_BASE = "https://pastebin-lite--rohinilon875.replit.app";

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
      const res = await fetch(`${API_BASE}/api/pastes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          maxViews: 5,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create paste");
      }

      const data = await res.json();

      // ✅ THIS IS WHAT GENERATES THE LINK
      if (data && data.id) {
        const finalUrl = `${API_BASE}/p/${data.id}`;
        setPasteUrl(finalUrl);
      } else {
        alert("Paste created but ID missing");
      }
    } catch (err) {
      console.error(err);
      alert("Backend not responding. Try again in 5 seconds.");
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
