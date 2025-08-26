import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import AddToWatchlistButton from './AddToWatchlistButton';

export default function InfoCard({ info, symbol, token, onAdded }) {
  if (!info) return null;
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">{info.shortName || symbol.toUpperCase()}</Typography>
          <AddToWatchlistButton token={token} symbol={symbol} name={info.shortName || symbol} onAdded={onAdded} />
        </Box>
        <Typography variant="body2">Sector: {info.sector || 'N/A'}</Typography>
        <Typography variant="body2">Industry: {info.industry || 'N/A'}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{info.summary}</Typography>
      </CardContent>
    </Card>
  );
}
