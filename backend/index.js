const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Trading Platform Backend');
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
