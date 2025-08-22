
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

function App() {
  const [symbol, setSymbol] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStockData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/stock/${symbol}`);
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError('Failed to fetch data');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h2>Trading Platform Frontend</h2>
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          value={symbol}
          onChange={e => setSymbol(e.target.value)}
          placeholder="Enter stock symbol (e.g. AAPL)"
          style={{ padding: '0.5rem', width: '60%' }}
        />
        <button onClick={fetchStockData} style={{ padding: '0.5rem', marginLeft: '1rem' }}>
          Fetch Data
        </button>
      </div>
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {data && Array.isArray(data) && (
        <div>
          <h3>Stock Data</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={data.map(item => ({
                date: item.Date,
                close: item["('Close', '" + symbol.toUpperCase() + "')"]
              }))}
            >
              <XAxis dataKey="date" tickFormatter={d => d && d.slice(0, 10)} />
              <YAxis />
              <Tooltip />
              <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
              <Line type="monotone" dataKey="close" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
          <pre style={{ background: '#f4f4f4', padding: '1rem' }}>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
      {data && data.error && (
        <div style={{ color: 'red' }}>{data.error}</div>
      )}
    </div>
  );
}

export default App;
