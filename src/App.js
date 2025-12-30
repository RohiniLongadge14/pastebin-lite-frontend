import { useState } from "react";
import "./App.css";

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

  const backendBase = "https://pastebin-lite--rohinilon875.replit.app";

  try {
    // Retry logic (up to 5 attempts)
    let response;
    for (let i = 0; i < 5; i++) {
      try {
        response = await fetch(`${backendBase}/api/pastes`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content,
            maxViews: 5,
          }),
        });

        if (response.ok) break;
      } catch (e) {
        await new Promise((res) => setTimeout(res, 4000));
      }
    }

    if (!response || !response.ok) {
      alert("Backend is waking up. Please click Create Paste again.");
      return;
    }

    const data = await response.json();

    if (data?.id) {
      setPasteUrl(`${backendBase}/p/${data.id}`);
    } else {
      alert("Unexpected backend response");
    }
  } catch (err) {
    alert("Backend unavailable. Please try again.");
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
