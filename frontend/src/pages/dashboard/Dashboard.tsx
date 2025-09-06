import React, { useState } from 'react';
import PriceCard from './components/PriceCard';
import InfoCard from './components/InfoCard';
import HistoryChart from './components/HistoryChart';
import TradeForm from './components/TradeForm';
import { Box, Typography, Alert, Stack } from '@mui/material';
import useSemanticAnalysis from './hooks/useSemanticAnalysis';
import useStockData from './hooks/useStockData';
import TickerSearchBar from './components/TickerSearchBar';
import DateRangePicker from './components/DateRangePicker';
import useTickerList from './hooks/useTickerList';
import NewsCard from './components/NewsCard';
import OverallSignalCard from './components/OverallSignalCard';

interface DashboardProps {
  token: string;
  symbol: string;
  onWatchlistRefresh: () => void;
  onSymbolChange: (symbol: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  token,
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

  const { price, info, history, loading, error } = useStockData({
    symbol,
    startDate,
    endDate,
  });

  const { tickerList, tickerLoading, tickerError } = useTickerList();

  const [inputValue, setInputValue] = useState(symbol || '');

  const { recent_news, overall_sentiment, error: semanticError, loading: semanticLoading } = useSemanticAnalysis(symbol);

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
          <NewsCard
            news={recent_news}
            loading={semanticLoading}
            error={semanticError ?? null}
          />
        )}
        {symbol && (
          <OverallSignalCard
            overallSentiment={overall_sentiment}
            loading={semanticLoading}
            error={semanticError ?? null}
          />
        )}
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
