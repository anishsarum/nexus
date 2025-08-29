import React, { useEffect } from 'react';
import { Typography, Box, CircularProgress, Alert } from '@mui/material';
import PortfolioOverview from '../components/PortfolioOverview';
import Holdings from '../components/Holdings';
import { usePortfolio } from '../hooks/usePortfolio';

const Portfolio: React.FC = () => {
  const {
    portfolio,
    loading,
    error,
    sellError,
    sellSuccess,
    sellLoading,
    fetchPortfolio,
    handleSellAll,
  } = usePortfolio();

  useEffect(() => {
    fetchPortfolio();
  }, []);

  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: 'auto',
        mt: 4,
        fontFamily: 'sans-serif',
        flex: 1,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Portfolio
      </Typography>
      {loading && <CircularProgress />}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {sellError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {sellError}
        </Alert>
      )}
      {sellSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {sellSuccess}
        </Alert>
      )}
      <PortfolioOverview cash={portfolio?.cash ?? undefined} />
      {portfolio && portfolio.holdings && portfolio.holdings.length > 0 && (
        <Holdings
          holdings={portfolio.holdings}
          valueData={portfolio.valueData}
          onSellAll={handleSellAll}
          sellLoading={sellLoading}
        />
      )}
      {portfolio && (!portfolio.holdings || portfolio.holdings.length === 0) && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          No holdings yet.
        </Typography>
      )}
      <Typography variant="body1">
        Welcome to your portfolio. Here you can view your holdings, transaction history, and make
        trades.
      </Typography>
    </Box>
  );
};

export default Portfolio;
