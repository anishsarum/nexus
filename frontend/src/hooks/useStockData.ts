declare const process: {
  env: {
    REACT_APP_PYTHON_API_URL?: string;
    [key: string]: any;
  };
};
import { useState, useEffect } from 'react';

interface UseStockDataProps {
  symbol: string;
  token?: string;
  startDate?: string;
  endDate?: string;
}

interface StockPrice {
  [key: string]: any;
}

interface StockInfo {
  [key: string]: any;
}

interface StockHistory {
  history: any[];
}

interface UseStockDataResult {
  price: StockPrice | null;
  info: StockInfo | null;
  history: any[] | null;
  loading: boolean;
  error: string[];
}

export default function useStockData({
  symbol,
  token,
  startDate,
  endDate,
}: UseStockDataProps): UseStockDataResult {
  const [price, setPrice] = useState<StockPrice | null>(null);
  const [info, setInfo] = useState<StockInfo | null>(null);
  const [history, setHistory] = useState<any[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string[]>([]);

  useEffect(() => {
    if (!symbol) return;
    setLoading(true);
    setError([]);
    setPrice(null);
    setInfo(null);
    setHistory(null);
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const pricePromise = fetch(`/pyapi/api/v1/stock/${symbol}/price`, {
      headers,
    }).then((r) => r.json());
    const infoPromise = fetch(`/pyapi/api/v1/stock/${symbol}/info`, {
      headers,
    }).then((r) => r.json());
    let historyUrl = `/pyapi/api/v1/stock/${symbol}/history`;
    const params: string[] = [];
    if (startDate) params.push(`start=${startDate}`);
    if (endDate) params.push(`end=${endDate}`);
    if (params.length) historyUrl += `?${params.join('&')}`;
    const historyPromise = fetch(historyUrl, { headers }).then((r) => r.json());

    Promise.all([pricePromise, infoPromise, historyPromise])
      .then(([priceResult, infoResult, historyResult]) => {
        const errors: string[] = [];
        if (priceResult.error) errors.push(priceResult.error);
        else setPrice(priceResult);
        if (infoResult.error) errors.push(infoResult.error);
        else setInfo(infoResult);
        if (historyResult.error) errors.push(historyResult.error);
        else setHistory(historyResult.history);
        if (errors.length) setError(errors);
      })
      .catch(() => setError(['Failed to fetch data']))
      .finally(() => setLoading(false));
  }, [symbol, token, startDate, endDate]);

  return { price, info, history, loading, error };
}
