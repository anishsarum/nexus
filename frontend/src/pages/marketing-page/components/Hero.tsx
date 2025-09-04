import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function Hero() {
  return (
    <Box
      sx={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        px: 2,
      }}
    >
      <Box
        sx={{
          background: 'rgba(255,255,255,0.85)',
          boxShadow: 3,
          borderRadius: 4,
          px: { xs: 2, sm: 6 },
          py: { xs: 3, sm: 5 },
          maxWidth: 600,
          width: '100%',
        }}
      >
        <Typography
          variant="h3"
          gutterBottom
          sx={{
            fontFamily: 'Inter, Roboto, Arial, sans-serif',
            fontWeight: 800,
            letterSpacing: '-1px',
          }}
        >
          Nexus
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ fontSize: '1.2rem' }}
        >
          Welcome to your all-in-one trading dashboard. Track stocks, manage your portfolio, and explore trading strategies all in one place.
        </Typography>
      </Box>
    </Box>
  );
}
