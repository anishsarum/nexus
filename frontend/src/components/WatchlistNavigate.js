import React from "react";
import { useNavigate } from "react-router-dom";

const WatchlistNavigate = ({ onSelectTicker, children }) => {
  const navigate = useNavigate();

  // Wrap onSelectTicker to also navigate to dashboard
  const handleSelectTicker = (symbol) => {
    if (onSelectTicker) onSelectTicker(symbol);
    navigate('/dashboard');
  };

  // Clone children and inject handleSelectTicker as prop
  return React.cloneElement(children, { onSelectTicker: handleSelectTicker });
};

export default WatchlistNavigate;
