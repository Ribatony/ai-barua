import { useState } from 'react';
import LetterForm from './components/LetterForm';
import LetterOutput from './components/LetterOutput';
import EmailGenerator from './components/EmailGenerator';
import Chatbot from './components/Chatbot';
import AuthLocal from './components/AuthLocal';

// ✅ Safe HTML escaping for history rendering
function escapeHtml(text) {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function App() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || null;
    } catch {
      return null;
    }
  });

  const [letter, setLetter] = useState('');
  const [formData, setFormData] = useState(null);
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('letterHistory')) || [];
    } catch {
      return [];
    }
  });

  const [darkMode, setDarkMode] = useState(false);

  if (!user) {
    return <AuthLocal onAuth={setUser} />;
  }

  const saveHistory = (letterText) => {
    const newHistory = [{ letter: letterText, date: new Date() }, ...history];
    setHistory(newHistory);
    localStorage.setItem('letterHistory', JSON.stringify(newHistory));
  };

  const handleLetterGenerated = (letterText) => {
    setLetter(letterText);
    saveHistory(letterText);
  };

  const handleFormData = (form) => {
    setFormData(form);
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('letterHistory');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <div className={darkMode ? 'app dark' : 'app'} style={{ padding: '1rem' }}>
      <h1>AI Barua</h1>
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={() => setDarkMode((dm) => !dm)} style={{ marginRight: 8 }}>
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
        <button onClick={handleLogout} style={{ background: '#e67e22', color: '#fff' }}>
          Logout
        </button>
      </div>

      <Chatbot onGenerate={handleLetterGenerated} />
      <LetterForm onGenerate={handleLetterGenerated} onFormUpdate={handleFormData} />

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginTop: '2rem' }}>
        <div style={{ flex: 1, minWidth: 300 }}>
          <h2>Letter Preview</h2>
          <LetterOutput letter={letter} />
        </div>
        <div style={{ flex: 1, minWidth: 300 }}>
          <h2>Email Format</h2>
          <EmailGenerator form={formData} />
        </div>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h2>Letter History</h2>
        <button
          onClick={handleClearHistory}
          style={{ marginBottom: '1rem', background: '#e74c3c', color: '#fff' }}
        >
          Delete History
        </button>
        <ul>
          {history.map((item, idx) => (
            <li key={idx} style={{ marginBottom: '1rem' }}>
              {typeof item.letter === 'string' && item.letter.trim() ? (
                <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {escapeHtml(item.letter)}
                </pre>
              ) : (
                <em style={{ color: '#999' }}>No letter content available.</em>
              )}
              <small>{new Date(item.date).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;

