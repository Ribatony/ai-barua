import { useState } from 'react';

const funnyFallbacks = [
  "Why did the letter go to school? To become a little b-r-i-g-h-t-e-r! 😄",
  "I'm an AI, but I promise not to write you a love letter... unless you ask nicely!",
  "If you need a letter and a laugh, I'm your bot!",
  "I tried to write a joke about letters, but it was too 'envelope'-ing.",
  "Did you hear about the AI who wrote a love letter? It was full of 'byte'-sized affection!",
  "I can write letters, but I can't lick the stamp. Yet."
];

function Chatbot({ onGenerate }) {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [fullLetter, setFullLetter] = useState('');
  const [name, setName] = useState('');
  const [recipient, setRecipient] = useState('');
  const [language, setLanguage] = useState('English');
  const [loading, setLoading] = useState(false);

  const handlePrompt = async (promptText) => {
    // Joke intent
    if (/joke|funny|laugh|humor|bored|make me smile/i.test(promptText)) {
      const joke = funnyFallbacks[Math.floor(Math.random() * funnyFallbacks.length)];
      setResponse(joke);
      setFullLetter('');
      return;
    }

    setLoading(true);
    setResponse('');
    setFullLetter('');

    // Infer language
    const isSwahili = /kiswahili|swahili|barua ya kiswahili/i.test(promptText);
    const lang = isSwahili ? 'Kiswahili' : 'English';
    setLanguage(lang);

    // Compose the prompt for Cohere
    const coherePrompt = `
You are AI Barua—a warm, bilingual assistant. Write a heartfelt letter or email based on this request:
"${promptText}"

Sender: ${name || 'Your Name'}
Recipient: ${recipient || 'Recipient'}
Language: ${lang}

Guidelines:
- Sound human
- Be clear and empathetic
`;

    try {
      const res = await fetch("https://api.cohere.ai/v1/generate", {
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
      const data = await res.json();
      setFullLetter(data.generations?.[0]?.text?.trim() || "Sorry, no message received.");
      // Optionally, send to parent
      onGenerate && onGenerate({
        name,
        recipient,
        recipientEmail: '',
        language: lang,
        customMessage: data.generations?.[0]?.text?.trim() || "",
        subject: ''
      });
    } catch (err) {
      setFullLetter("Oops, something went wrong.");
      console.error("❌ Error generating letter:", err);
    }
    setLoading(false);
  };

  const handleReset = () => {
    setInput('');
    setResponse('');
    setFullLetter('');
    setName('');
    setRecipient('');
    setLanguage('English');
  };

  const examplePrompts = [
    "Apologize for missing a meeting and promise to do better.",
    "Congratulate a friend on their graduation.",
    "Request for a job reference letter.",
    "Invite someone to a birthday party.",
    "Write a condolence message for a loss.",
    "Make me smile with a joke.",
    "Thank a teacher for their support.",
    "Request for a business partnership.",
    "Barua ya Kiswahili ya kuomba msamaha.",
    "Barua ya Kiswahili ya pongezi."
  ];

  return (
    <div style={{ margin: '2rem 0', padding: '1rem', border: '1px solid #eee', borderRadius: '8px' }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
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
      <div style={{ marginBottom: 12, fontWeight: 'bold' }}>Choose a prompt or type your own:</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
        {examplePrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handlePrompt(prompt)}
            style={{
              background: '#f1f1f1',
              border: '1px solid #ccc',
              borderRadius: 6,
              padding: '0.5rem 1rem',
              cursor: 'pointer'
            }}
            disabled={loading}
          >
            {prompt}
          </button>
        ))}
      </div>
      <form
        onSubmit={e => {
          e.preventDefault();
          if (input.trim()) handlePrompt(input.trim());
        }}
        style={{ display: 'flex', gap: '0.5rem', marginBottom: 8 }}
      >
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Or type your own prompt here"
          style={{ flex: 1, fontSize: '1rem' }}
          disabled={loading}
        />
        <button type="submit" disabled={loading}>{loading ? "Generating..." : "Send"}</button>
        <button type="button" onClick={handleReset} style={{ background: '#eee', color: '#333' }} disabled={loading}>
          Reset
        </button>
      </form>
      {response && (
        <div style={{ marginTop: '1rem', color: '#2c3e50', fontStyle: 'italic' }}>
          {response}
        </div>
      )}
      {fullLetter && (
        <div style={{ marginTop: '1rem', background: '#f9f9f9', padding: '1rem', borderRadius: 8 }}>
          <div style={{ marginBottom: 8, fontWeight: 'bold' }}>AI-Generated Letter/Email:</div>
          <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: '1rem' }}>
            {fullLetter}
          </pre>
        </div>
      )}
    </div>
  );
}

export default Chatbot;