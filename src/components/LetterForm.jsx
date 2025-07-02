import { useState } from "react";

function LetterForm() {
  const [userPrompt, setUserPrompt] = useState("");
  const [letter, setLetter] = useState("");
  const [name, setName] = useState("");
  const [recipient, setRecipient] = useState("");
  const [language, setLanguage] = useState("English");
  const [loading, setLoading] = useState(false);

  const generateLetter = async () => {
    setLoading(true);
    setLetter("");
    // Infer language
    const isSwahili = /kiswahili|swahili|barua ya kiswahili/i.test(userPrompt);
    const lang = isSwahili ? "Kiswahili" : "English";
    setLanguage(lang);

    const coherePrompt = `
You are AI Barua—a warm, bilingual assistant. Write a heartfelt letter or email based on this request:
"${userPrompt}"

Sender: ${name || 'Your Name'}
Recipient: ${recipient || 'Recipient'}
Language: ${lang}

Guidelines:
- Sound human
- Be clear and empathetic
`;

    try {
      const response = await fetch("https://api.cohere.ai/v1/generate", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_COHERE_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "command-r-plus",
          prompt: coherePrompt,
          max_tokens: 400,
          temperature: 0.7
        })
      });
      const data = await response.json();
      setLetter(data.generations?.[0]?.text?.trim() || "Sorry, no message received.");
    } catch (err) {
      console.error("❌ Error generating letter:", err);
      setLetter("Oops, something went wrong.");
    }
    setLoading(false);
  };

  const handleReset = () => {
    setUserPrompt("");
    setLetter("");
    setName("");
    setRecipient("");
    setLanguage("English");
  };

  return (
    <div style={{ margin: "2rem 0", padding: "1rem", border: "1px solid #eee", borderRadius: "8px" }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Your Name"
          style={{ flex: 1 }}
        />
        <input
          type="text"
          value={recipient}
          onChange={e => setRecipient(e.target.value)}
          placeholder="Recipient Name"
          style={{ flex: 1 }}
        />
      </div>
      <textarea
        value={userPrompt}
        onChange={e => setUserPrompt(e.target.value)}
        placeholder="Describe the letter or email you want..."
        rows={4}
        style={{ width: "100%" }}
        disabled={loading}
      />
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <button onClick={generateLetter} disabled={loading || !userPrompt.trim()}>
          {loading ? "Generating..." : "Generate Letter"}
        </button>
        <button type="button" onClick={handleReset} style={{ background: "#eee", color: "#333" }} disabled={loading}>
          Reset
        </button>
      </div>
      <pre style={{ marginTop: 16, background: "#f9f9f9", padding: 12 }}>
        {letter}
      </pre>
    </div>
  );
}

export default LetterForm;