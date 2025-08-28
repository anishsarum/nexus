import React, { useState } from 'react';
import { PriceCard, InfoCard, HistoryChart, TradeForm } from './StockWidgets';
import WatchlistSidebar from './WatchlistSidebar';
import { Box, Button, Typography, Alert, Stack } from '@mui/material';
import useStockData from '../hooks/useStockData';
import TickerSearchBar from './TickerSearchBar';
import DateRangePicker from './DateRangePicker';
import useTickerList from '../hooks/useTickerList';

// Type definitions for props
interface DashboardProps {
  token: string;
  onLogout: () => void;
  symbol: string;
  onWatchlistRefresh: () => void;
  onSymbolChange: (symbol: string) => void;
}

declare const process: {
  env: {
    REACT_APP_PYTHON_API_URL?: string;
    [key: string]: any;
  };
};

const Dashboard: React.FC<DashboardProps> = ({
  token,
  onLogout,
  symbol,
  onWatchlistRefresh,
  onSymbolChange,
}) => {
  const today = new Date().toISOString().slice(0, 10);
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  const defaultStartDate = oneMonthAgo.toISOString().slice(0, 10);

  const [showJson, setShowJson] = useState(false);
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(today);
  const [watchlistRefreshKey, setWatchlistRefreshKey] = useState(0);

  const handleStockAdded = () => setWatchlistRefreshKey((k) => k + 1);

  // Use custom hook for all stock data
  const { price, info, history, loading, error } = useStockData({
    symbol,
    token,
    startDate,
    endDate,
  });

  // Use custom hook for ticker list
  const { tickerList, tickerLoading, tickerError } = useTickerList();

  // State for input value to force uppercase
  const [inputValue, setInputValue] = useState(symbol || '');

  return (
    <Box sx={{ display: 'flex' }}>
      <Box
        sx={{
          maxWidth: 600,
          mx: 'auto',
          mt: 4,
          fontFamily: 'sans-serif',
          flex: 1,
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h4">Market Dashboard</Typography>
          <Button onClick={onLogout} variant="outlined" color="secondary">
            Logout
          </Button>
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
            {error.map((errMsg: string, idx: number) => (
              <div key={idx}>{errMsg}</div>
            ))}
          </Alert>
        )}
        <PriceCard price={price ? { price: price.price, date: price.date } : null} />
        <InfoCard info={info} symbol={symbol} token={token} onAdded={onWatchlistRefresh} />
        {symbol && (
          <TradeForm
            symbol={symbol}
            token={token}
            price={
              price &&
              (typeof price.price === 'object' ? Object.values(price.price)[0] : price.price)
            }
          />
        )}
        <HistoryChart
          history={history ?? []}
          symbol={symbol}
          showJson={showJson}
          setShowJson={setShowJson}
        />
      </Box>
    </Box>
  );
};

export default Dashboard;
