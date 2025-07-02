import { useState } from 'react';

import LetterForm from './components/LetterForm';
import LetterOutput from './components/LetterOutput';
import EmailGenerator from './components/EmailGenerator';
import Chatbot from './components/Chatbot';
import AuthLocal from './components/AuthLocal';

// Escape HTML to prevent XSS in letter history
function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function App() {
  // Auth state
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')) || null);

  // App states
  const [letter, setLetter] = useState('');
  const [formData, setFormData] = useState(null);
  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('letterHistory')) || []);
  const [darkMode, setDarkMode] = useState(false);

  // Show Auth screen if not logged in
  if (!user) {
    return <AuthLocal onAuth={setUser} />;
  }

  // Save letter to history
  const saveHistory = (letterText) => {
    const newHistory = [{ letter: letterText, date: new Date() }, ...history];
    setHistory(newHistory);
    localStorage.setItem('letterHistory', JSON.stringify(newHistory));
  };

  // Handler for generated letters from children
  const handleLetterGenerated = (letterText) => {
    setLetter(letterText);
    saveHistory(letterText);
  };

  // Handler for generated form data (optional, for EmailGenerator)
  const handleFormData = (form) => {
    setFormData(form);
  };

  // Clear history
  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('letterHistory');
  };

  // Logout function
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <div className={darkMode ? 'app dark' : 'app'}>
      <h1>AI Barua</h1>
      <button onClick={() => setDarkMode(dm => !dm)} style={{ float: 'right' }}>
        {darkMode ? 'Light Mode' : 'Dark Mode'}
      </button>
      <button onClick={handleLogout} style={{ float: 'right', marginRight: 8, background: '#e67e22', color: '#fff' }}>
        Logout
      </button>
      <Chatbot onGenerate={handleLetterGenerated} />
      <LetterForm onGenerate={handleLetterGenerated} />
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 300 }}>
          <h2>Letter Preview</h2>
          <LetterOutput letter={letter} />
        </div>
        <div style={{ flex: 1, minWidth: 300 }}>
          <EmailGenerator form={formData} />
        </div>
      </div>
      <div>
        <h2>History</h2>
        <button onClick={handleClearHistory} style={{ marginBottom: '1rem', background: '#e74c3c', color: '#fff' }}>
          Delete History
        </button>
        <ul>
          {history.map((item, idx) => (
            <li key={idx}>
              <pre style={{ whiteSpace: 'pre-wrap' }}>
                {escapeHtml(item.letter)}
              </pre>
              <small>{new Date(item.date).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;