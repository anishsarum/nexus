const marketingBackgrounds = {
  light: 'url(/trading_background_light.jpg)',
  dark: 'url(/trading_background_dark.jpg)',
};

const MarketingBackground = styled(Box)((_theme) => ({
  minHeight: '100vh',
  width: '100%',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  transition: 'background-image 0.3s',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
}));

const CreditLabel = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: 12,
  marginTop: theme.spacing(2),
}));
import React from 'react';
import { styled } from '@mui/material/styles';
import { useEffectiveColorScheme } from '../../hooks/useEffectiveColorScheme';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import AppAppBar from './components/AppAppBar';
import Hero from './components/Hero';
import Box from '@mui/material/Box';

const MarketingPage: React.FC = () => {
  const effectiveMode = useEffectiveColorScheme();

  React.useEffect(() => {
    document.documentElement.style.setProperty(
      '--marketing-bg',
      marketingBackgrounds[effectiveMode]
    );
  }, [effectiveMode]);

  const backgroundImage = marketingBackgrounds[effectiveMode];

  return (
    <>
      <CssBaseline enableColorScheme />
      <MarketingBackground style={{ backgroundImage }}>
        <Box sx={{ position: 'relative', zIndex: 1, width: '100%' }}>
          <AppAppBar />
          <Hero />
          <Box sx={{ width: '100%', textAlign: 'center', mt: 4, mb: 2 }}>
            <CreditLabel variant="caption">
              {effectiveMode === 'light' ? (
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
            <Box sx={{ mt: 2 }}>
              <Link
                href="https://github.com/anishsarum/nexus"
                target="_blank"
                rel="noopener"
                color="primary"
                underline="hover"
                fontWeight={600}
              >
                View Nexus on GitHub
              </Link>
            </Box>
          </Box>
        </Box>
      </MarketingBackground>
    </>
  );
};

export default MarketingPage;
