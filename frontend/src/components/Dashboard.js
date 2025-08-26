import React, { useState } from 'react';
import { PriceCard, InfoCard, HistoryChart, TradeForm } from './StockWidgets';
import WatchlistSidebar from './WatchlistSidebar';
import { Box, Button, TextField, Typography, Alert, Stack } from '@mui/material';
import useStockData from '../hooks/useStockData';

export default function Dashboard({ token, onLogout, symbol, onWatchlistRefresh, onSymbolChange }) {
  const today = new Date().toISOString().slice(0, 10);
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  const defaultStartDate = oneMonthAgo.toISOString().slice(0, 10);

  const [showJson, setShowJson] = useState(false);
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(today);
  const [watchlistRefreshKey, setWatchlistRefreshKey] = useState(0);

  const handleStockAdded = () => setWatchlistRefreshKey(k => k + 1);

  // Use custom hook for all stock data
  const { price, info, history, loading, error } = useStockData({ symbol, token, startDate, endDate });

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar is now handled by SidebarLayout */}
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, fontFamily: 'sans-serif', flex: 1 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h4">Market Dashboard</Typography>
          <Button onClick={onLogout} variant="outlined" color="secondary">Logout</Button>
        </Stack>
        <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
          <TextField
            label="Stock Symbol"
            value={symbol}
            onChange={e => onSymbolChange && onSymbolChange(e.target.value)}
            placeholder="e.g. AAPL"
            size="small"
            sx={{ flex: 2 }}
          />
          <TextField
            label="Start Date"
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            size="small"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="End Date"
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            size="small"
            InputLabelProps={{ shrink: true }}
          />
        </Box>
        {loading && <Typography>Loading...</Typography>}
        {error && error.length > 0 && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error.map((errMsg, idx) => (
              <div key={idx}>{errMsg}</div>
            ))}
          </Alert>
        )}
        <PriceCard price={price} />
        <InfoCard
          info={info}
          symbol={symbol}
          token={token}
          onAdded={onWatchlistRefresh}
        />
        {/* Buy/Sell Card */}
        {symbol && (
          <TradeForm 
            symbol={symbol} 
            token={token} 
            price={price && (typeof price.price === 'object' ? Object.values(price.price)[0] : price.price)} 
          />
        )}
        <HistoryChart history={history} symbol={symbol} showJson={showJson} setShowJson={setShowJson} />
      </Box>
    </Box>
  );
}
