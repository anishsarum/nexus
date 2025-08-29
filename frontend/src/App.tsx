import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AppBar, Toolbar, Button, Typography, Box } from '@mui/material';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Portfolio from './pages/Portfolio';
import SidebarLayout from './components/SidebarLayout';
import LandingPage from './pages/LandingPage';
import { AuthProvider, useAuth } from './context/AuthContext';

const AppContent: React.FC = () => {
  const { token, logout } = useAuth();
  const [selectedSymbol, setSelectedSymbol] = React.useState<string>('');
  const [watchlistRefreshKey, setWatchlistRefreshKey] = React.useState<number>(0);

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
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
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
              <Button onClick={logout} color="secondary" variant="outlined">
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
                      onLogout={logout}
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

const App: React.FC = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;
