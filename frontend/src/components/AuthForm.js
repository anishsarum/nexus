import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Alert } from '@mui/material';

export default function AuthForm({ mode = 'login', onAuth }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const isSignup = mode === 'signup';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const payload = isSignup ? { username, email, password } : { username, password };
    try {
    const res = await fetch(`http://localhost:5001/api/v1/auth/${isSignup ? 'signup' : 'login'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Authentication failed');
      } else {
        onAuth(data);
      }
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ background: '#f8f8ff', p: 3, borderRadius: 2, maxWidth: 350, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" align="center" gutterBottom>{isSignup ? 'Sign Up' : 'Login'}</Typography>
      <TextField
        label="Username"
        variant="outlined"
        value={username}
        onChange={e => setUsername(e.target.value)}
        required
        fullWidth
        sx={{ mb: 2 }}
      />
      {isSignup && (
        <TextField
          label="Email"
          type="email"
          variant="outlined"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          fullWidth
          sx={{ mb: 2 }}
        />
      )}
      <TextField
        label="Password"
        type="password"
        variant="outlined"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        fullWidth
        sx={{ mb: 2 }}
      />
      <Button type="submit" variant="contained" color="primary" fullWidth sx={{ py: 1.2, mt: 1 }}>
        {isSignup ? 'Sign Up' : 'Login'}
      </Button>
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
    </Box>
  );
}
