import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

export default function PriceCard({ price }) {
  if (!price) return null;
  let displayPrice = price.price;
  if (displayPrice && typeof displayPrice === 'object') {
    const keys = Object.keys(displayPrice);
    displayPrice = keys.length ? displayPrice[keys[0]] : '';
  }
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6">Current Price</Typography>
        <Typography variant="h4" color="primary">{displayPrice}</Typography>
        <Typography variant="body2" color="text.secondary">{price.date}</Typography>
      </CardContent>
    </Card>
  );
}
