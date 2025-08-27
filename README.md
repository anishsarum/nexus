# Trading Platform (MERN + FastAPI)

A full-stack trading platform using MongoDB, Express, React, Node.js, and FastAPI (Python) for financial data, strategies, and analytics. All services run in Docker for easy development.


## Features

- User authentication (JWT)
- Responsive Material UI dashboard (watchlist, portfolio, price, info, charts)
- Add/remove stocks to watchlist
- View historical price charts
- Fully functional virtual trading (buy/sell)
- FastAPI backend for stock data, strategies, and analytics
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

- Manual strategy builder and backtesting (in progress)
- Add trading strategies and real-time updates
- Expand portfolio analytics
- Improve documentation