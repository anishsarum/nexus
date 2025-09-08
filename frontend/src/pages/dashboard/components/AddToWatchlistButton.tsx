import React, { useState } from 'react';
import { IconButton, Tooltip, Snackbar } from '@mui/material';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

export interface AddToWatchlistButtonProps {
  token: string;
  symbol: string;
  name: string;
  onAdded?: ((symbol: string) => void) | undefined;
}

const AddToWatchlistButton: React.FC<AddToWatchlistButtonProps> = ({
  token,
  symbol,
  name,
  onAdded,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [subscribed, setSubscribed] = useState<boolean>(false);
  const [lastAction, setLastAction] = useState<'add' | 'remove'>('add');

  React.useEffect(() => {
    if (!token || !symbol) return;
    axios
      .get(`/api/v1/watchlist`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setSubscribed(res.data.some((item: any) => item.symbol === symbol));
      });
  }, [token, symbol]);

  const handleToggle = async () => {
    setLoading(true);
    try {
      await axios.post(
        `/api/v1/watchlist`,
        { symbol, name },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setLastAction(subscribed ? 'remove' : 'add');
      // Re-fetch watchlist to get updated state
      const res = await axios.get(`/api/v1/watchlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubscribed(res.data.some((item: any) => item.symbol === symbol));
      setSnackbarOpen(true);
      if (onAdded) onAdded(symbol);
    } catch {
      // Optionally handle error
    }
    setLoading(false);
  };

  return (
    <>
      <Tooltip title={subscribed ? "Unsubscribe from Watchlist" : "Add to Watchlist"}>
        <span>
          <IconButton
            onClick={handleToggle}
            disabled={loading || !token}
          >
            {subscribed ? <DeleteIcon /> : <BookmarkAddIcon />}
          </IconButton>
        </span>
      </Tooltip>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        message={lastAction === 'add' ? "Added to Watchlist" : "Removed from Watchlist"}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </>
  );
};

export default AddToWatchlistButton;
