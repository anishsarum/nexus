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
        sx={(_theme) => ({
          background: 'rgba(255,255,255,0.85)',
          boxShadow: 3,
          borderRadius: 4,
          px: { xs: 2, sm: 6 },
          py: { xs: 3, sm: 5 },
          maxWidth: 600,
          width: '100%',
        })}
      >
        <Typography
          variant="h3"
          gutterBottom
          sx={(theme) => ({
            fontFamily: 'Inter, Roboto, Arial, sans-serif',
            fontWeight: 800,
            letterSpacing: '-1px',
            color: theme.palette.mode === 'light' ? '#222' : theme.palette.text.primary,
          })}
        >
          Nexus
        </Typography>
        <Typography
          variant="body1"
          sx={(theme) => ({
            fontSize: '1.2rem',
            color: theme.palette.mode === 'light' ? '#333' : theme.palette.text.secondary,
          })}
        >
          Welcome to your all-in-one trading dashboard. Track stocks, manage your portfolio, and explore trading strategies all in one place.
        </Typography>
      </Box>
    </Box>
  );
}
