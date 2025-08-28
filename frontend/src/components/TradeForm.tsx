import React, { useState } from 'react';
import { Card, CardContent, Typography, Button, Box, TextField, Alert, Stack } from '@mui/material';
import axios from 'axios';

interface TradeFormProps {
	symbol: string;
	token: string;
	price: number;
	onTrade?: (data: any) => void;
}

const TradeForm: React.FC<TradeFormProps> = ({ symbol, token, onTrade, price }) => {
	const [quantity, setQuantity] = useState<number>(0);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string>('');
	const [success, setSuccess] = useState<string>('');

	const total = Number(quantity) * Number(price);

	const handleTrade = async (type: 'buy' | 'sell') => {
		setLoading(true);
		setError('');
		setSuccess('');
		try {
			const url = `/api/portfolio/${type}`;
			const res = await axios.post(url, { symbol, quantity: Number(quantity), price: Number(price) }, {
				headers: { Authorization: `Bearer ${token}` }
			});
			setSuccess(`${type === 'buy' ? 'Bought' : 'Sold'} ${quantity} ${symbol} @ $${price}`);
			setQuantity(0);
			if (onTrade) onTrade(res.data);
		} catch (err: any) {
			setError(err.response?.data?.error || 'Trade failed');
		}
		setLoading(false);
	};

	return (
		<Card sx={{ mb: 2 }}>
			<CardContent>
				<Typography variant="h6">Trade {symbol}</Typography>
				<Stack spacing={2} sx={{ mt: 2 }}>
					<TextField label="Quantity" type="number" value={quantity} onChange={e => setQuantity(Number(e.target.value))} fullWidth />
					<Typography variant="subtitle1" sx={{ mt: 1 }}>
						Total: <b>${quantity ? total.toFixed(2) : '0.00'}</b>
					</Typography>
					<Box sx={{ display: 'flex', gap: 2 }}>
						<Button variant="contained" color="success" disabled={loading || !quantity || !price} onClick={() => handleTrade('buy')}>Buy</Button>
						<Button variant="contained" color="error" disabled={loading || !quantity || !price} onClick={() => handleTrade('sell')}>Sell</Button>
					</Box>
					{error && <Alert severity="error">{error}</Alert>}
					{success && <Alert severity="success">{success}</Alert>}
				</Stack>
			</CardContent>
		</Card>
	);
};

export default TradeForm;
