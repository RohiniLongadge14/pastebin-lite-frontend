import { useState } from "react";
import "./App.css";

const API_BASE = "https://pastebin-lite--rohinilon875.replit.app";

function App() {
  const [content, setContent] = useState("");
  const [pasteUrl, setPasteUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const createPaste = async () => {
    if (!content.trim()) {
      alert("Please enter some content");
      return;
    }

    setLoading(true);
    setPasteUrl("");

    try {
      const res = await fetch(`${API_BASE}/api/pastes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, maxViews: 5 }),
      });

      const data = await res.json();
      console.log("API RESPONSE:", data);

      if (data.url) {
        setPasteUrl(API_BASE + data.url);
      } else {
        alert("Paste created but URL missing");
      }
    } catch (err) {
      console.error(err);
      alert("Backend not responding");
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
