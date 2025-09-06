import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './pages/sign-in/SignIn';
import SignUp from './pages/sign-up/SignUp';
import NewDashboard from './pages/new-dashboard/Dashboard';
import MarketingPage from './pages/marketing-page/MarketingPage';
import { AuthProvider, useAuth } from './context/AuthContext';

const AppContent: React.FC = () => {
  const { token } = useAuth();

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
        <Routes>
          <Route path="/new-dashboard" element={<NewDashboard />} />
          <Route path="*" element={<Navigate to="/new-dashboard" />} />
        </Routes>
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
