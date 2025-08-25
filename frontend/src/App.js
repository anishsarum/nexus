
import React, { useState } from 'react';
import AuthForm from './components/AuthForm';
import Dashboard from './components/Dashboard';

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [authMode, setAuthMode] = useState('login');

  const handleAuth = (data) => {
    if (data.token) {
      setToken(data.token);
      localStorage.setItem('token', data.token);
    }
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
  };

  if (!token) {
    return (
      <div style={{ maxWidth: 400, margin: '2rem auto', fontFamily: 'sans-serif' }}>
        <AuthForm mode={authMode} onAuth={handleAuth} />
        <button onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')} style={{ marginTop: 10 }}>
          {authMode === 'login' ? 'Need an account? Sign Up' : 'Already have an account? Login'}
        </button>
      </div>
    );
  }
  return <Dashboard token={token} onLogout={handleLogout} />;
}

export default App;
