
import React, { useState } from 'react';
import { PriceCard, InfoCard, HistoryChart, TradeForm } from './StockWidgets';
import WatchlistSidebar from './WatchlistSidebar';
import { Box, Button, TextField, Typography, Alert, Stack, Autocomplete } from '@mui/material';
import useStockData from '../hooks/useStockData';

// Ticker search bar subcomponent
function TickerSearchBar({ tickerList, tickerLoading, tickerError, symbol, inputValue, setInputValue, onSymbolChange }) {
  return (
    <>
      <Autocomplete
        freeSolo
        options={tickerList}
        value={symbol}
        inputValue={inputValue}
        loading={tickerLoading}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue.toUpperCase());
        }}
        onChange={(event, newValue) => {
          if (newValue && onSymbolChange) {
            onSymbolChange(newValue);
            setInputValue(newValue);
          }
        }}
        renderInput={(params) => (
          <TextField {...params} label="Stock Symbol" placeholder="e.g. AAPL" size="small" sx={{ flex: 2 }} />
        )}
        sx={{ flex: 2 }}
      />
      {tickerError && <Alert severity="error">{tickerError}</Alert>}
    </>
  );
}

// Date range picker subcomponent
function DateRangePicker({ startDate, endDate, setStartDate, setEndDate }) {
  return (
    <>
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
    </>
  );
}


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

  // Fetch ticker list from backend API
  const [tickerList, setTickerList] = useState([]);
  const [tickerLoading, setTickerLoading] = useState(true);
  const [tickerError, setTickerError] = useState(null);

  React.useEffect(() => {
    setTickerLoading(true);
    const pythonApiUrl = process.env.REACT_APP_PYTHON_API_URL || 'http://localhost:8000';
    fetch(`${pythonApiUrl}/api/tickers`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTickerList(data.map(t => t.symbol));
        } else {
          setTickerError('Failed to load ticker list');
        }
        setTickerLoading(false);
      })
      .catch(err => {
        setTickerError('Failed to load ticker list');
        setTickerLoading(false);
      });
  }, []);

  // State for input value to force uppercase
  const [inputValue, setInputValue] = useState(symbol || "");

  return (
    <Box sx={{ display: 'flex' }}>
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, fontFamily: 'sans-serif', flex: 1 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h4">Market Dashboard</Typography>
          <Button onClick={onLogout} variant="outlined" color="secondary">Logout</Button>
        </Stack>
        <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
          <TickerSearchBar
            tickerList={tickerList}
            tickerLoading={tickerLoading}
            tickerError={tickerError}
            symbol={symbol}
            inputValue={inputValue}
            setInputValue={setInputValue}
            onSymbolChange={onSymbolChange}
          />
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
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
