import { useState, useEffect } from 'react';

export default function useTickerList() {
  const [tickerList, setTickerList] = useState<string[]>([]);
  const [tickerLoading, setTickerLoading] = useState<boolean>(true);
  const [tickerError, setTickerError] = useState<string | null>(null);

  useEffect(() => {
    setTickerLoading(true);
    fetch('/pyapi/api/tickers')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTickerList(data.map((t: any) => t.symbol));
        } else {
          setTickerError('Failed to load ticker list');
        }
        setTickerLoading(false);
      })
      .catch(() => {
        setTickerError('Failed to load ticker list');
        setTickerLoading(false);
      });
  }, []);

  return { tickerList, tickerLoading, tickerError };
}
