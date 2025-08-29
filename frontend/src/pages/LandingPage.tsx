import React from 'react';
import { Button, Typography, Container, Box, Card } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #e3f0ff 0%, #f8f8ff 100%)',
      }}
    >
      <Container maxWidth="sm">
        <Card sx={{ p: 4, textAlign: 'center', boxShadow: 3, borderRadius: 4 }}>
          <Typography
            variant="h3"
            gutterBottom
            sx={{
              fontFamily: 'Inter, Roboto, Arial, sans-serif',
              fontWeight: 800,
            }}
          >
            Trading Platform
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            gutterBottom
            sx={{ fontSize: '1.2rem' }}
          >
            Welcome to your all-in-one trading dashboard. Track stocks, manage your portfolio, and
            explore trading strategies all in one place.
          </Typography>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              onClick={() => navigate('/signup')}
            >
              Sign Up
            </Button>
          </Box>
        </Card>
      </Container>
    </Box>
  );
};

export default LandingPage;
