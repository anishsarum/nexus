import React from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';

export default function HistoryChart({ history, symbol, showJson, setShowJson }) {
  if (!history || !Array.isArray(history) || history.length === 0) return null;
  const { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Label } = require('recharts');
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>Historical Prices</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={history.map(item => ({
              date: item["('Date', '')"],
              close: item[`('Close', '${symbol}')`]
            }))}
            margin={{ top: 10, right: 50, left: 0, bottom: 15 }}
          >
            <XAxis dataKey="date" tickFormatter={d => d && d.slice(0, 10)}>
              <Label value="Date" position="insideBottom" offset={-10} />
            </XAxis>
            <YAxis>
              <Label value="Price" angle={-90} position="insideLeft" offset={10} />
            </YAxis>
            <Tooltip />
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <Line type="monotone" dataKey="close" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
        <Box sx={{ mt: 2 }}>
          <Button onClick={() => setShowJson(v => !v)} variant="outlined" size="small">
            {showJson ? 'Hide Raw Data' : 'Show Raw Data'}
          </Button>
        </Box>
        {showJson && (
          <Box component="pre" sx={{ background: '#f4f4f4', p: 2, mt: 2, borderRadius: 1, fontSize: '0.9em', overflow: 'auto' }}>{JSON.stringify(history, null, 2)}</Box>
        )}
      </CardContent>
    </Card>
  );
}
