import { useState } from "react";
import "./App.css";

function App() {
  const [content, setContent] = useState("");
  const [pasteUrl, setPasteUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const createPaste = async () => {
    if (!content.trim()) return;

    setLoading(true);
    setPasteUrl("");

    try {
      const response = await fetch(
        "https://pastebin-lite--rohinilon875.replit.app/api/pastes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: content,
            maxViews: 5,
          }),
        }
      );

      const data = await response.json();
      console.log("Backend response:", data);

      // ✅ CORRECT LINK GENERATION
      if (data && data.id) {
        const fullUrl = `https://pastebin-lite--rohinilon875.replit.app/p/${data.id}`;
        setPasteUrl(fullUrl);
      } else {
        alert("Paste created but ID not returned");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to connect to backend");
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
            <br />
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
