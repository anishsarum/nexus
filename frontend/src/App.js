import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AppBar, Toolbar, Button, Typography, Box } from '@mui/material';
import AuthForm from './components/AuthForm';
import Dashboard from './components/Dashboard';
import Portfolio from './components/Portfolio';
import SidebarLayout from './components/SidebarLayout';

function App() {
  // All hooks at the top, always called
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [authMode, setAuthMode] = useState('login');
  const [selectedSymbol, setSelectedSymbol] = useState('');
  const [watchlistRefreshKey, setWatchlistRefreshKey] = useState(0);

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

  const handleSelectTicker = (symbol) => {
    setSelectedSymbol(symbol);
  };

  const handleWatchlistRefresh = () => {
    setWatchlistRefreshKey(k => k + 1);
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

  return (
    <Router>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Trading Platform
          </Typography>
          <Button component={Link} to="/portfolio" color="primary" sx={{ mr: 2 }}>Portfolio</Button>
          <Button component={Link} to="/dashboard" color="primary" sx={{ mr: 2 }}>Dashboard</Button>
          <Button onClick={handleLogout} color="secondary" variant="outlined">Logout</Button>
        </Toolbar>
      </AppBar>
      <SidebarLayout token={token} onSelectTicker={handleSelectTicker} refreshKey={watchlistRefreshKey}>
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, fontFamily: 'sans-serif', flex: 1 }}>
          <Routes>
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/dashboard" element={<Dashboard token={token} onLogout={handleLogout} symbol={selectedSymbol} onWatchlistRefresh={handleWatchlistRefresh} onSymbolChange={setSelectedSymbol} />} />
            <Route path="*" element={<Navigate to="/portfolio" />} />
          </Routes>
        </Box>
      </SidebarLayout>
    </Router>
  );
}

export default App;
