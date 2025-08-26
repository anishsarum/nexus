import React, { useState, useEffect } from 'react';
import { PriceCard, InfoCard, HistoryChart } from './StockWidgets';
import WatchlistSidebar from './WatchlistSidebar';
import { Box, Button, TextField, Typography, Alert, Stack } from '@mui/material';

export default function Dashboard({ token, onLogout }) {
  const today = new Date().toISOString().slice(0, 10);
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  const defaultStartDate = oneMonthAgo.toISOString().slice(0, 10);

  const [symbol, setSymbol] = useState('');
  const [price, setPrice] = useState(null);
  const [info, setInfo] = useState(null);
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState([]);
  const [showJson, setShowJson] = useState(false);
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(today);
  const [watchlistRefreshKey, setWatchlistRefreshKey] = useState(0);

  const handleStockAdded = () => setWatchlistRefreshKey(k => k + 1);

  const fetchStockData = async () => {
    setLoading(true);
    setError([]);
    setPrice(null);
    setInfo(null);
    setHistory(null);
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const pricePromise = fetch(`http://127.0.0.1:8000/api/v1/stock/${symbol}/price`, { headers }).then(r => r.json());
      const infoPromise = fetch(`http://127.0.0.1:8000/api/v1/stock/${symbol}/info`, { headers }).then(r => r.json());
      let historyUrl = `http://127.0.0.1:8000/api/v1/stock/${symbol}/history`;
      const params = [];
      if (startDate) params.push(`start=${startDate}`);
      if (endDate) params.push(`end=${endDate}`);
      if (params.length) historyUrl += `?${params.join('&')}`;
      const historyPromise = fetch(historyUrl, { headers }).then(r => r.json());

      const [priceResult, infoResult, historyResult] = await Promise.all([pricePromise, infoPromise, historyPromise]);

      const errors = [];
      if (priceResult.error) errors.push(priceResult.error);
      else setPrice(priceResult);

      if (infoResult.error) errors.push(infoResult.error);
      else setInfo(infoResult);

      if (historyResult.error) errors.push(historyResult.error);
      else setHistory(historyResult.history);

      if (errors.length) setError(errors);
    } catch (err) {
      setError(['Failed to fetch data']);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (symbol) {
      fetchStockData();
    }
    // eslint-disable-next-line
  }, [symbol]);

  return (
    <Box sx={{ display: 'flex' }}>
      <WatchlistSidebar
        token={token}
        onSelectTicker={setSymbol}
        refreshKey={watchlistRefreshKey}
      />
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, fontFamily: 'sans-serif', flex: 1 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h4">Trading Platform Frontend</Typography>
          <Button onClick={onLogout} variant="outlined" color="secondary">Logout</Button>
        </Stack>
        <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
          <TextField
            label="Stock Symbol"
            value={symbol}
            onChange={e => setSymbol(e.target.value)}
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
          <Button onClick={fetchStockData} variant="contained" color="primary" sx={{ minWidth: 120 }}>
            Fetch Data
          </Button>
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
          onAdded={handleStockAdded}
        />
        <HistoryChart history={history} symbol={symbol} showJson={showJson} setShowJson={setShowJson} />
      </Box>
    </Box>
  );
}
