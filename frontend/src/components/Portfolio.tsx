import React, { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

interface Holding {
  symbol: string;
  quantity: number;
  avgPrice: number;
}

interface ValueData {
  symbol: string;
  change_pct?: number;
  value?: number;
  timestamp?: number | string;
}

interface PortfolioRowProps {
  holding: Holding;
  valueData?: ValueData | undefined;
  onSellAll: (holding: Holding) => void;
  sellLoading: boolean;
}

const PortfolioRow: React.FC<PortfolioRowProps> = ({
  holding,
  valueData,
  onSellAll,
  sellLoading,
}) => {
  const changePct = valueData ? valueData.change_pct : 0; // holding is unused
  const value = valueData ? valueData.value : 0;
  let priceTime = '';
  let isRecent = false;
  if (valueData && valueData.timestamp) {
    if (!isNaN(Number(valueData.timestamp))) {
      const date = new Date(Number(valueData.timestamp) * 1000);
      priceTime = date.toLocaleString();
      isRecent = Date.now() - date.getTime() < 30 * 60 * 1000;
    } else {
      priceTime = String(valueData.timestamp);
    }
  }
  return (
    <TableRow key={holding.symbol}>
      <TableCell>{holding.symbol}</TableCell>
      <TableCell align="right">{holding.quantity}</TableCell>
      <TableCell align="right">${holding.avgPrice.toFixed(2)}</TableCell>
      <TableCell align="right">
        ${typeof value === 'number' && !isNaN(value) ? value.toFixed(2) : '0.00'}
      </TableCell>
      <TableCell align="right">
        <span
          style={{
            color:
              typeof changePct === 'number' && changePct > 0
                ? 'green'
                : typeof changePct === 'number' && changePct < 0
                  ? 'red'
                  : undefined,
          }}
        >
          {typeof changePct === 'number' && changePct >= 0 ? '+' : ''}
          {typeof changePct === 'number' && !isNaN(changePct) ? changePct.toFixed(2) : '0.00'}%
        </span>
      </TableCell>
      <TableCell align="right">
        {priceTime ? (
          <span
            title={isRecent ? 'Live price' : 'Last close or delayed'}
            style={{ color: isRecent ? 'green' : 'orange' }}
          >
            {priceTime}
          </span>
        ) : (
          <span style={{ color: 'gray' }}>N/A</span>
        )}
      </TableCell>
      <TableCell align="right">
        <IconButton
          size="small"
          color="error"
          onClick={() => onSellAll(holding)}
          aria-label={`Sell all ${holding.symbol}`}
          disabled={sellLoading}
        >
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

interface PortfolioData {
  cash?: number;
  holdings?: Holding[];
  valueData?: {
    assets?: ValueData[];
  };
}

const Portfolio: React.FC = () => {
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [sellError, setSellError] = useState<string>('');
  const [sellSuccess, setSellSuccess] = useState<string>('');
  const [sellLoading, setSellLoading] = useState<boolean>(false);

  const fetchPortfolio = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/portfolio`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = res.data;
      setPortfolio(data);
      if (data.holdings && data.holdings.length > 0) {
        const symbols = data.holdings.map((h: Holding) => h.symbol).join(',');
        const quantities = data.holdings.map((h: Holding) => h.quantity).join(',');
        const avgPrices = data.holdings.map((h: Holding) => h.avgPrice).join(',');
        const pythonApiUrl = (window as any).REACT_APP_PYTHON_API_URL || '/pyapi';
        const valueRes = await axios.get(`${pythonApiUrl}/api/portfolio/value`, {
          params: { symbols, quantities, avgPrices },
        });
        setPortfolio((prev) => (prev ? { ...prev, valueData: valueRes.data } : prev));
      }
      setLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch portfolio');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const handleSellAll = async (holding: Holding) => {
    setSellError('');
    setSellSuccess('');
    setSellLoading(true);
    try {
      await axios.post(
        `/api/portfolio/sell`,
        {
          symbol: holding.symbol,
          quantity: holding.quantity,
          price: holding.avgPrice,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      setSellSuccess(`Sold all ${holding.symbol}`);
      fetchPortfolio();
    } catch (err: any) {
      setSellError(err.response?.data?.error || 'Failed to sell');
    }
    setSellLoading(false);
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: 'auto',
        mt: 4,
        fontFamily: 'sans-serif',
        flex: 1,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Portfolio
      </Typography>
      {loading && <CircularProgress />}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {sellError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {sellError}
        </Alert>
      )}
      {sellSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {sellSuccess}
        </Alert>
      )}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6">Cash Balance</Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          $
          {portfolio && typeof portfolio.cash === 'number'
            ? portfolio.cash.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            : '0.00'}
        </Typography>
      </Box>
      {portfolio && portfolio.holdings && portfolio.holdings.length > 0 && (
        <TableContainer component={Paper} sx={{ mb: 3 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Ticker</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Avg Price</TableCell>
                <TableCell align="right">Current Value</TableCell>
                <TableCell align="right">P/L (%)</TableCell>
                <TableCell align="right">Price Time</TableCell>
                <TableCell align="right">Sell All</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {portfolio.holdings.map((holding: Holding) => {
                const valueData = portfolio.valueData?.assets?.find(
                  (a: ValueData) => a.symbol === holding.symbol
                );
                return (
                  <PortfolioRow
                    key={holding.symbol}
                    holding={holding}
                    valueData={valueData}
                    onSellAll={handleSellAll}
                    sellLoading={sellLoading}
                  />
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {portfolio && (!portfolio.holdings || portfolio.holdings.length === 0) && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          No holdings yet.
        </Typography>
      )}
      <Typography variant="body1">
        Welcome to your portfolio. Here you can view your holdings, transaction history, and make
        trades.
      </Typography>
    </Box>
  );
};

export default Portfolio;
