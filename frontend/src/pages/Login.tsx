import React from 'react';
import AuthForm from '../components/AuthForm';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { setToken } = useAuth();
  const handleAuth = (data: { token?: string }) => {
    if (data.token) {
      setToken(data.token);
      navigate('/portfolio');
    }
  };
  return <AuthForm mode="login" onAuth={handleAuth} />;
};

export default Login;
