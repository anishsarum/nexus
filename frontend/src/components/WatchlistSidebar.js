import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, List, ListItemText, Typography, IconButton, CircularProgress, ListItemButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const WatchlistSidebar = ({ token, onSelectTicker, refreshKey }) => {
  const [tickers, setTickers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    axios.get('/api/watchlist', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setTickers(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token, refreshKey]);

  const handleDelete = (symbol) => {
    axios.delete(`/api/watchlist/${symbol}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setTickers(res.data));
  };

  return (
  <Box sx={{ width: 240, p: 2, bgcolor: '#fafafa', height: '100vh', borderRight: '1px solid #eee', overflow: 'auto' }}>
      <Typography variant="h6" gutterBottom>Watchlist</Typography>
      {loading ? <CircularProgress /> : (
        <List>
          {tickers.length === 0 ? (
            <ListItemButton disabled><ListItemText primary="No tickers subscribed." /></ListItemButton>
          ) : tickers.map(ticker => (
            <ListItemButton key={ticker.symbol} onClick={() => {
              if (onSelectTicker) onSelectTicker(ticker.symbol);
              navigate('/dashboard');
            }}>
              <ListItemText primary={ticker.symbol} secondary={ticker.name} />
              <IconButton edge="end" onClick={e => { e.stopPropagation(); handleDelete(ticker.symbol); }}>
                <DeleteIcon />
              </IconButton>
            </ListItemButton>
          ))}
        </List>
      )}
    </Box>
  );
};

export default WatchlistSidebar;
