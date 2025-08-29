import React from 'react';
import AuthForm from '../components/AuthForm';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { setToken } = useAuth();
  const handleAuth = (data: { token?: string }) => {
    // If backend returns a token after signup, log in automatically
    if (data.token) {
      setToken(data.token);
      navigate('/portfolio');
    } else {
      navigate('/login');
    }
  };
  return <AuthForm mode="signup" onAuth={handleAuth} />;
};

export default Signup;
