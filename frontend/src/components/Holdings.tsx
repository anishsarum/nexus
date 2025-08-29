import React from 'react';
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import PortfolioRow from './PortfolioRow';

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

interface HoldingsProps {
  holdings: Holding[];
  valueData?: { assets?: ValueData[] } | undefined;
  onSellAll: (holding: Holding) => void;
  sellLoading: boolean;
}

const Holdings: React.FC<HoldingsProps> = ({ holdings, valueData, onSellAll, sellLoading }) => (
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
        {holdings.map((holding) => {
          const assetValue = valueData?.assets?.find((a) => a.symbol === holding.symbol);
          return (
            <PortfolioRow
              key={holding.symbol}
              holding={holding}
              valueData={assetValue}
              onSellAll={onSellAll}
              sellLoading={sellLoading}
            />
          );
        })}
      </TableBody>
    </Table>
  </TableContainer>
);

export default Holdings;
