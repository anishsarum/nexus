import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

interface Price {
  price: number | Record<string, number>;
  date?: string;
}

interface PriceCardProps {
  price?: Price | null;
}

const PriceCard: React.FC<PriceCardProps> = ({ price }) => {
  if (!price) return null;
  let displayPrice = price.price;
  if (displayPrice && typeof displayPrice === 'object') {
    const priceObj = displayPrice as Record<string, number>;
    const keys = Object.keys(priceObj);
    displayPrice = keys.length && keys[0] !== undefined ? (priceObj[keys[0]] ?? 0) : 0;
  }
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6">Current Price</Typography>
        <Typography variant="h4" color="primary">
          {displayPrice}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {price.date}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default PriceCard;
