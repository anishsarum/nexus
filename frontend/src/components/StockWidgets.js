import React from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import AddToWatchlistButton from './AddToWatchlistButton';

export function PriceCard({ price }) {
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

export function InfoCard({ info, symbol, token, onAdded }) {
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

export function HistoryChart({ history, symbol, showJson, setShowJson }) {
  if (!history || !Array.isArray(history) || history.length === 0) return null;
  const { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Label } = require('recharts');
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>Historical Prices</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={history.map(item => ({
              date: item["('Date', '')"],
              close: item[`('Close', '${symbol}')`]
            }))}
            margin={{ top: 10, right: 50, left: 0, bottom: 15 }}
          >
            <XAxis dataKey="date" tickFormatter={d => d && d.slice(0, 10)}>
              <Label value="Date" position="insideBottom" offset={-10} />
            </XAxis>
            <YAxis>
              <Label value="Price" angle={-90} position="insideLeft" offset={10} />
            </YAxis>
            <Tooltip />
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <Line type="monotone" dataKey="close" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
        <Box sx={{ mt: 2 }}>
          <Button onClick={() => setShowJson(v => !v)} variant="outlined" size="small">
            {showJson ? 'Hide Raw Data' : 'Show Raw Data'}
          </Button>
        </Box>
        {showJson && (
          <Box component="pre" sx={{ background: '#f4f4f4', p: 2, mt: 2, borderRadius: 1, fontSize: '0.9em', overflow: 'auto' }}>{JSON.stringify(history, null, 2)}</Box>
        )}
      </CardContent>
    </Card>
  );
}
