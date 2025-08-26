# Trading Platform (MERN + FastAPI)

A full-stack trading platform using MongoDB, Express, React, Node.js, and FastAPI (Python) for financial data and strategies. All services run in Docker for easy development.

## Features

- User authentication (JWT)
- Dashboard with watchlist and portfolio
- Add/remove stocks to watchlist
- View historical price charts
- Virtual trading (buy/sell endpoints ready)
- FastAPI backend for stock data
- Dockerized setup

## Quick Start

1. Build and start all services:

   ```sh
   docker-compose up --build
   ```

2. Access:

   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend: [http://localhost:5001](http://localhost:5001)
   - Python API: [http://localhost:8000](http://localhost:8000)

## Next Steps

- Add trading strategies and real-time updates
- Expand portfolio analytics
- Improve documentation