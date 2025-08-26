import React, { useEffect, useState } from "react";
import { Typography, Box, CircularProgress, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import axios from "axios";

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sellError, setSellError] = useState("");
  const [sellSuccess, setSellSuccess] = useState("");

  const fetchPortfolio = () => {
    setLoading(true);
    axios.get("/api/portfolio", {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => {
        setPortfolio(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.response?.data?.error || "Failed to fetch portfolio");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const handleSellAll = async (holding) => {
    setSellError("");
    setSellSuccess("");
    try {
      await axios.post("/api/portfolio/sell", {
        symbol: holding.symbol,
        quantity: holding.quantity,
        price: holding.avgPrice
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSellSuccess(`Sold all ${holding.symbol}`);
      fetchPortfolio();
    } catch (err) {
      setSellError(err.response?.data?.error || "Failed to sell");
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, fontFamily: 'sans-serif', flex: 1 }}>
      <Typography variant="h4" gutterBottom>
        Portfolio
      </Typography>
      {loading && <CircularProgress />}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {sellError && <Alert severity="error" sx={{ mb: 2 }}>{sellError}</Alert>}
      {sellSuccess && <Alert severity="success" sx={{ mb: 2 }}>{sellSuccess}</Alert>}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6">Cash Balance</Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          ${portfolio && typeof portfolio.cash === 'number'
            ? portfolio.cash.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
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
                <TableCell align="right">Sell All</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {portfolio.holdings.map((holding) => (
                <TableRow key={holding.symbol}>
                  <TableCell>{holding.symbol}</TableCell>
                  <TableCell align="right">{holding.quantity}</TableCell>
                  <TableCell align="right">${holding.avgPrice.toFixed(2)}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" color="error" onClick={() => handleSellAll(holding)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
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
        Welcome to your portfolio. Here you can view your holdings, transaction history, and make trades.
      </Typography>
    </Box>
  );
};

export default Portfolio;
