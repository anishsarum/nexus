import React from 'react';
import { TableRow, TableCell, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

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
  valueData: ValueData | undefined;
  onSellAll: (holding: Holding) => void;
  sellLoading: boolean;
}

const PortfolioRow: React.FC<PortfolioRowProps> = ({
  holding,
  valueData,
  onSellAll,
  sellLoading,
}) => {
  const changePct = valueData ? valueData.change_pct : 0;
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

export default PortfolioRow;
