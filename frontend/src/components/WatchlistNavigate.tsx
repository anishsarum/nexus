import React from 'react';
import type { ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';

interface WatchlistNavigateProps {
  onSelectTicker?: (symbol: string) => void;
  children: ReactElement<{ onSelectTicker?: (symbol: string) => void }>;
}

const WatchlistNavigate: React.FC<WatchlistNavigateProps> = ({ onSelectTicker, children }) => {
  const navigate = useNavigate();

  // Wrap onSelectTicker to also navigate to dashboard
  const handleSelectTicker = (symbol: string) => {
    if (onSelectTicker) onSelectTicker(symbol);
    navigate('/dashboard');
  };

  // Clone children and inject handleSelectTicker as prop
  return React.cloneElement(children, { onSelectTicker: handleSelectTicker });
};

export default WatchlistNavigate;
