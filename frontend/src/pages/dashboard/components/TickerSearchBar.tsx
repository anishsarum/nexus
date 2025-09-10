import React from 'react';
import { Autocomplete, TextField, Alert } from '@mui/material';

interface TickerSearchBarProps {
  tickerList: string[];
  tickerLoading: boolean;
  tickerError: string | null;
  symbol: string;
  inputValue: string;
  setInputValue: (val: string) => void;
  onSymbolChange: (symbol: string) => void;
}

const TickerSearchBar: React.FC<TickerSearchBarProps> = ({
  tickerList,
  tickerLoading,
  tickerError,
  symbol,
  inputValue,
  setInputValue,
  onSymbolChange,
}) => {
  return (
    <>
      <Autocomplete
        freeSolo
        options={tickerList}
        value={symbol}
        inputValue={inputValue}
        loading={tickerLoading}
        onInputChange={(_event, newInputValue) => {
          setInputValue(newInputValue.toUpperCase());
        }}
        onChange={(_event, newValue) => {
          if (newValue && onSymbolChange) {
            onSymbolChange(newValue);
            setInputValue(newValue);
          }
        }}
        renderInput={(params) => {
          return (
            <TextField
              {...params}
              label="Stock Symbol"
              placeholder="e.g. AAPL"
              size="small"
              sx={{ flex: 2, pt: 1 }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          );
        }}
        sx={{ flex: 2 }}
      />
      {tickerError && <Alert severity="error">{tickerError}</Alert>}
    </>
  );
};

export default TickerSearchBar;
