import React, { useState } from 'react';
import { IconButton, Tooltip, Snackbar } from '@mui/material';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import axios from 'axios';

const AddToWatchlistButton = ({ token, symbol, name, onAdded }) => {
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleAdd = async () => {
    setLoading(true);
    try {
      await axios.post('/api/watchlist', { symbol, name }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSnackbarOpen(true);
      if (onAdded) onAdded(symbol);
    } catch (err) {
      // Optionally handle error
    }
    setLoading(false);
  };

  return (
    <>
      <Tooltip title="Add to Watchlist">
        <span>
          <IconButton onClick={handleAdd} disabled={loading || !token} color="primary">
            <BookmarkAddIcon />
          </IconButton>
        </span>
      </Tooltip>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        message="Added to Watchlist"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </>
  );
};

export default AddToWatchlistButton;
