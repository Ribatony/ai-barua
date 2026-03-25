import { useState } from "react";

function LetterForm() {
  const [userPrompt, setUserPrompt] = useState("");
  const [letter, setLetter] = useState("");
  const [loading, setLoading] = useState(false);

  const generateLetter = async () => {
    setLoading(true);
    setLetter("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "mistralai/mixtral-8x7b-instruct",
          messages: [
            { role: "system", content: "You are AI Barua, a bilingual assistant." },
            { role: "user", content: userPrompt }
          ]
        }),
      });

      const data = await response.json();
      setLetter(data.choices?.[0]?.message?.content?.trim() || "No message received.");
    } catch (err) {
      console.error("Error:", err);
      setLetter("Oops, something went wrong.");
    }

    setLoading(false);
  };

  return (
    <div>
      <h2>Letter Form</h2>
      <input
        type="text"
        placeholder="Enter your request..."
        value={userPrompt}
        onChange={(e) => setUserPrompt(e.target.value)}
      />
      <button onClick={generateLetter} disabled={loading}>
        {loading ? "Generating..." : "Generate Letter"}
      </button>

      {letter && (
        <div>
          <strong>Generated Letter:</strong>
          <p>{letter}</p>
        </div>
      )}
    </div>
  );
}

export default LetterForm;

