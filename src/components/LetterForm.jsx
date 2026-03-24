/* eslint-disable no-unused-vars */
import { useState } from "react";
import { OpenRouter } from "@openrouter/sdk";

const openRouter = new OpenRouter({
  apiKey: import.meta.env.VITE_OPENROUTER_API_KEY,
});

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

    const isSwahili = /kiswahili|swahili|barua ya kiswahili/i.test(userPrompt);
    const lang = isSwahili ? "Kiswahili" : "English";
    setLanguage(lang);

    const openrouterPrompt = `
You are AI Barua—a warm, bilingual assistant. Write a heartfelt letter or email based on this request:
"${userPrompt}"

Sender: ${name || "Your Name"}
Recipient: ${recipient || "Recipient"}
Language: ${lang}

Guidelines:
- Sound human
- Be clear and empathetic
`;

    try {
      const completion = await openRouter.chat.send({
        model: "mistralai/mixtral-8x7b-instruct",
        messages: [
          { role: "system", content: "You are AI Barua, a bilingual assistant." },
          { role: "user", content: openrouterPrompt }
        ],
        stream: false,
      });

      const message = completion.choices?.[0]?.message?.content?.trim()
        || "Sorry, no message received.";
      setLetter(message);
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
    <div>
      <h2>Letter Form</h2>
      <input
        type="text"
        placeholder="Enter your request..."
        value={userPrompt}
        onChange={(e) => setUserPrompt(e.target.value)}
      />
      <input
        type="text"
        placeholder="Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Recipient"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />
      <button onClick={generateLetter} disabled={loading}>
        {loading ? "Generating..." : "Generate Letter"}
      </button>
      <button onClick={handleReset}>Reset</button>

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

