import * as React from 'react';
import { useColorScheme, styled } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import AppAppBar from './components/AppAppBar';
import Hero from './components/Hero';
import Box from '@mui/material/Box';


const MarketingBackground = styled(Box)(() => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  position: 'relative',
}));

const CreditLabel = styled(Typography)(() => ({
  color: 'var(--mui-palette-text-secondary)',
  opacity: 0.7,
  textAlign: 'center',
}));

function MarketingPage() {
  const { mode } = useColorScheme();
  const isLight = mode === 'light';
  const backgroundImage = isLight
    ? 'url(/trading_background_light.jpg)'
    : 'url(/trading_background_dark.jpg)';
  return (
    <>
      <CssBaseline enableColorScheme />
        <MarketingBackground style={{ backgroundImage }}>
        <Box sx={{ position: 'relative', zIndex: 1, width: '100%' }}>
          <AppAppBar />
          <Hero />
          <div>
            <Divider />
          </div>
          <Box sx={{ width: '100%', textAlign: 'center', mt: 4, mb: 2 }}>
            <CreditLabel variant="caption">
              {isLight ? (
                <>
                  Photo by{' '}
                  <Link
                    href="https://www.pexels.com/@arturoaez225"
                    target="_blank"
                    rel="noopener"
                    color="inherit"
                  >
                    Arthur A
                  </Link>{' '}
                  on Pexels
                </>
              ) : (
                <>
                  Photo by{' '}
                  <Link
                    href="https://unsplash.com/@nampoh"
                    target="_blank"
                    rel="noopener"
                    color="inherit"
                  >
                    Maxim Hopman
                  </Link>{' '}
                  on Unsplash
                </>
              )}
            </CreditLabel>
          </Box>
        </Box>
      </MarketingBackground>
    </>
  );
}

export default MarketingPage;
