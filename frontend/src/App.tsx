import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AppBar, Toolbar, Button, Typography, Box } from '@mui/material';
import AuthForm from './components/AuthForm';
import Dashboard from './components/Dashboard';
import Portfolio from './components/Portfolio';
import SidebarLayout from './components/SidebarLayout';
import LandingPage from './components/LandingPage';

const App: React.FC = () => {
  const [token, setToken] = useState<string>(() => localStorage.getItem('token') || '');
  // Removed unused authMode and setAuthMode
  const [selectedSymbol, setSelectedSymbol] = useState<string>('');
  const [watchlistRefreshKey, setWatchlistRefreshKey] = useState<number>(0);

  const handleAuth = (data: { token?: string }) => {
    if (data.token) {
      setToken(data.token);
      localStorage.setItem('token', data.token);
    }
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
  };

  const handleSelectTicker = (symbol: string) => {
    setSelectedSymbol(symbol);
  };

  const handleWatchlistRefresh = () => {
    setWatchlistRefreshKey((k) => k + 1);
  };

  return (
    <Router>
      {!token ? (
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<AuthForm mode="login" onAuth={handleAuth} />} />
          <Route path="/signup" element={<AuthForm mode="signup" onAuth={handleAuth} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      ) : (
        <>
          <AppBar position="static" color="default" elevation={1}>
            <Toolbar>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                Trading Platform
              </Typography>
              <Button component={Link} to="/portfolio" color="primary" sx={{ mr: 2 }}>
                Portfolio
              </Button>
              <Button component={Link} to="/dashboard" color="primary" sx={{ mr: 2 }}>
                Dashboard
              </Button>
              <Button onClick={handleLogout} color="secondary" variant="outlined">
                Logout
              </Button>
            </Toolbar>
          </AppBar>
          <SidebarLayout
            token={token}
            onSelectTicker={handleSelectTicker}
            refreshKey={watchlistRefreshKey}
          >
            <Box
              sx={{
                maxWidth: 600,
                mx: 'auto',
                mt: 4,
                fontFamily: 'sans-serif',
                flex: 1,
              }}
            >
              <Routes>
                <Route path="/portfolio" element={<Portfolio />} />
                <Route
                  path="/dashboard"
                  element={
                    <Dashboard
                      token={token}
                      onLogout={handleLogout}
                      symbol={selectedSymbol}
                      onWatchlistRefresh={handleWatchlistRefresh}
                      onSymbolChange={setSelectedSymbol}
                    />
                  }
                />
                <Route path="*" element={<Navigate to="/portfolio" />} />
              </Routes>
            </Box>
          </SidebarLayout>
        </>
      )}
    </Router>
  );
};

export default App;
