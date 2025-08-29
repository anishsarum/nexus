import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import TopBar from './components/TopBar';
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
          <TopBar onLogout={logout} />
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
                pt: 8, // Add top padding to prevent content from being hidden behind AppBar
              }}
            >
              <Routes>
                <Route path="/portfolio" element={<Portfolio />} />
                <Route
                  path="/dashboard"
                  element={
                    <Dashboard
                      token={token}
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
