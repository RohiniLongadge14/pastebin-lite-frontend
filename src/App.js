import { useState } from "react";
import "./App.css";

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
      // ✅ RELATIVE API CALL
      const res = await fetch("/api/pastes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: content,
          maxViews: 5,
        }),
      });

      if (!res.ok) {
        throw new Error("Backend error");
      }

      const data = await res.json();
      console.log("Backend response:", data);

      // ✅ BACKEND RETURNS { id, url }
      if (data.url) {
        // ✅ url already = /p/{id}
        setPasteUrl(data.url);
      } else {
        alert("Paste created but URL not returned");
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
