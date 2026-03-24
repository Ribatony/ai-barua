/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { OpenRouter } from '@openrouter/sdk';

const funnyFallbacks = [
  "Why did the letter go to school? To become a little b-r-i-g-h-t-e-r! 😄",
  "I'm an AI, but I promise not to write you a love letter... unless you ask nicely!",
  "If you need a letter and a laugh, I'm your bot!",
  "I tried to write a joke about letters, but it was too 'envelope'-ing.",
  "Did you hear about the AI who wrote a love letter? It was full of 'byte'-sized affection!",
  "I can write letters, but I can't lick the stamp. Yet."
];

const openRouter = new OpenRouter({
  apiKey: import.meta.env.VITE_OPENROUTER_API_KEY,
});

function Chatbot({ onGenerate }) {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [fullLetter, setFullLetter] = useState('');
  const [name, setName] = useState('');
  const [recipient, setRecipient] = useState('');
  const [language, setLanguage] = useState('English');
  const [loading, setLoading] = useState(false);

  const handlePrompt = async (promptText) => {
    if (/joke|funny|laugh|humor|bored|make me smile/i.test(promptText)) {
      const joke = funnyFallbacks[Math.floor(Math.random() * funnyFallbacks.length)];
      setResponse(joke);
      setFullLetter('');
      return;
    }

    setLoading(true);
    setResponse('');
    setFullLetter('');

    const isSwahili = /kiswahili|swahili|barua ya kiswahili/i.test(promptText);
    const lang = isSwahili ? 'Kiswahili' : 'English';
    setLanguage(lang);

    const openrouterPrompt = `
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
      setFullLetter(message);

      onGenerate && onGenerate({
        name,
        recipient,
        recipientEmail: '',
        language: lang,
        customMessage: message,
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
    <div>
      <h2>AI Barua Chatbot</h2>
      <input
        type="text"
        placeholder="Enter your request..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={() => handlePrompt(input)} disabled={loading}>
        {loading ? "Generating..." : "Generate Letter"}
      </button>
      <button onClick={handleReset}>Reset</button>

      <div>
        <h3>Examples:</h3>
        {examplePrompts.map((ex, i) => (
          <button key={i} onClick={() => handlePrompt(ex)}>
            {ex}
          </button>
        ))}
      </div>

      {response && (
        <div>
          <strong>Response:</strong> {response}
        </div>
      )}

      {fullLetter && (
        <div>
          <strong>Generated Letter:</strong>
          <p>{fullLetter}</p>
        </div>
      )}
    </div>
  );
}

export default Chatbot;

