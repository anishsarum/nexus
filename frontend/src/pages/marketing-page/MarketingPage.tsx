import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import tradingBackground from '../../assets/trading_background.jpg';
import AppTheme from '../shared-theme/AppTheme';
import AppAppBar from './components/AppAppBar';
import Hero from './components/Hero';
import Box from '@mui/material/Box';

export default function MarketingPage(props: { disableCustomTheme?: boolean }) {
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage: `url(${tradingBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <AppAppBar />
        <Hero />
        <div>
          <Divider />
        </div>
        <Box sx={{ width: '100%', textAlign: 'center', mt: 4, mb: 2 }}>
          <Typography variant="caption" sx={{ color: 'white', opacity: 0.7 }}>
            Photo by <Link href="https://unsplash.com/@nampoh" target="_blank" rel="noopener" color="inherit">Maxim Hopman</Link> on Unsplash
          </Typography>
        </Box>
      </Box>
    </AppTheme>
  );
}
