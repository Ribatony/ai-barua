import { useState } from 'react';

function AuthLocal({ onAuth }) {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const getUsers = () => JSON.parse(localStorage.getItem('users') || '{}');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const users = getUsers();

    if (mode === 'register') {
      if (!email || !password) {
        setError('Email and password required.');
        return;
      }
      if (users[email]) {
        setError('Account already exists.');
        return;
      }
      users[email] = password;
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('user', JSON.stringify({ email }));
      onAuth({ email });
    } else {
      if (users[email] === password) {
        localStorage.setItem('user', JSON.stringify({ email }));
        onAuth({ email });
      } else {
        setError('Invalid email or password.');
      }
    }
  };

  return (
    <div style={{ maxWidth: 340, margin: '3rem auto', padding: 24, border: '1px solid #eee', borderRadius: 8 }}>
      <h2>{mode === 'login' ? 'Login' : 'Create Account'}</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input
          type="email"
          placeholder="Email"
          autoComplete="username"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">{mode === 'login' ? 'Login' : 'Create Account'}</button>
      </form>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      <div style={{ marginTop: 16 }}>
        {mode === 'login' ? (
          <>
            Don't have an account?{' '}
            <button onClick={() => { setMode('register'); setError(''); }} style={{ color: '#7b61ff', background: 'none', border: 'none', cursor: 'pointer' }}>
              Create one
            </button>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <button onClick={() => { setMode('login'); setError(''); }} style={{ color: '#7b61ff', background: 'none', border: 'none', cursor: 'pointer' }}>
              Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default AuthLocal;