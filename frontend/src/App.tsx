import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import TopBar from './components/TopBar';
import SignIn from './pages/sign-in/SignIn';
import SignUp from './pages/sign-up/SignUp';
import Dashboard from './pages/dashboard/Dashboard';
import NewDashboard from './pages/new-dashboard/Dashboard';
import Portfolio from './pages/portfolio/Portfolio';
import SidebarLayout from './components/SidebarLayout';
import MarketingPage from './pages/marketing-page/MarketingPage';
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
          <Route path="/" element={<MarketingPage />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
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
                <Route path="/new-dashboard" element={<NewDashboard />} />
                <Route path="*" element={<Navigate to="/portfolio" />} />
              </Routes>
            </Box>
          </SidebarLayout>
        </>
      )}
    </Router>
  );
};

import AppTheme from './pages/shared-theme/AppTheme';

const App: React.FC = () => (
  <AppTheme>
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  </AppTheme>
);

export default App;
