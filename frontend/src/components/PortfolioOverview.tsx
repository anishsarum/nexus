import React from 'react';
import { Typography, Box } from '@mui/material';

interface PortfolioOverviewProps {
  cash: number | undefined;
}

const PortfolioOverview: React.FC<PortfolioOverviewProps> = ({ cash }) => (
  <Box sx={{ mb: 2 }}>
    <Typography variant="h6">Cash Balance</Typography>
    <Typography variant="body1" sx={{ mb: 2 }}>
      $
      {typeof cash === 'number'
        ? cash.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        : '0.00'}
    </Typography>
  </Box>
);

export default PortfolioOverview;
