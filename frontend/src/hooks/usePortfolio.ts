import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export interface Holding {
  symbol: string;
  quantity: number;
  avgPrice: number;
}

export interface ValueData {
  symbol: string;
  change_pct?: number;
  value?: number;
  timestamp?: number | string;
}

export interface PortfolioData {
  cash?: number;
  holdings?: Holding[];
  valueData?: {
    assets?: ValueData[];
  };
}

export function usePortfolio() {
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [sellError, setSellError] = useState<string>('');
  const [sellSuccess, setSellSuccess] = useState<string>('');
  const [sellLoading, setSellLoading] = useState<boolean>(false);
  const { token } = useAuth();

  const fetchPortfolio = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/v1/portfolio`, {
        headers: { Authorization: token ? `Bearer ${token}` : '' },
      });
      const data = res.data;
      setPortfolio(data);
      if (data.holdings && data.holdings.length > 0) {
        const symbols = data.holdings.map((h: Holding) => h.symbol).join(',');
        const quantities = data.holdings.map((h: Holding) => h.quantity).join(',');
        const avgPrices = data.holdings.map((h: Holding) => h.avgPrice).join(',');
        const pythonApiUrl = (window as any).REACT_APP_PYTHON_API_URL || '/pyapi';
        const valueRes = await axios.get(`${pythonApiUrl}/api/portfolio/value`, {
          params: { symbols, quantities, avgPrices },
        });
        setPortfolio((prev) => (prev ? { ...prev, valueData: valueRes.data } : prev));
      }
      setLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch portfolio');
      setLoading(false);
    }
  };

  const handleSellAll = async (holding: Holding) => {
    setSellError('');
    setSellSuccess('');
    setSellLoading(true);
    try {
      await axios.post(
        `/api/v1/portfolio/sell`,
        {
          symbol: holding.symbol,
          quantity: holding.quantity,
          price: holding.avgPrice,
        },
        {
          headers: { Authorization: token ? `Bearer ${token}` : '' },
        }
      );
      setSellSuccess(`Sold all ${holding.symbol}`);
      fetchPortfolio();
    } catch (err: any) {
      setSellError(err.response?.data?.error || 'Failed to sell');
    }
    setSellLoading(false);
  };

  return {
    portfolio,
    loading,
    error,
    sellError,
    sellSuccess,
    sellLoading,
    fetchPortfolio,
    handleSellAll,
  };
}
