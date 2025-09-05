import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';


const HeroCard = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
  background: theme.palette.background.paper,
  borderRadius: 16,
  px: theme.spacing(3),
  py: theme.spacing(4),
  maxWidth: 600,
  width: '100%',
  margin: 'auto',
}));

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
      <HeroCard variant="outlined">
        <Typography
          variant="h3"
          gutterBottom
          sx={{
            fontFamily: 'Inter, Roboto, Arial, sans-serif',
            fontWeight: 800,
            letterSpacing: '-1px',
            color: 'var(--mui-palette-text-primary)',
            transition: 'color 0.2s',
          }}
        >
          Nexus
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: '1.2rem',
            color: 'var(--mui-palette-text-secondary)',
            transition: 'color 0.2s',
          }}
        >
          Welcome to your all-in-one trading dashboard. Track stocks, manage your portfolio, and
          explore trading strategies all in one place.
        </Typography>
      </HeroCard>
    </Box>
  );
}
