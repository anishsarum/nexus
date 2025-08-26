# Trading Platform MERN + FastAPI

This project is a full-stack trading platform starter, combining a MERN stack (MongoDB, Express, React, Node.js) for user management and dashboard features, with a FastAPI Python backend for financial data and trading strategies. Docker is used for local development and orchestration.

## Structure

- `backend/`: Node.js/Express API for user authentication, dashboard, watchlist, and portfolio management (MongoDB).
- `frontend/`: React app with Material-UI for user interface, authentication, dashboard, charts, and watchlist.
- `python-backend/`: FastAPI service for stock data endpoints (price, info, history), caching (Redis), and trading strategies (e.g., MACD).
- `docker-compose.yml`: Orchestrates all services (frontend, backend, python-backend, MongoDB, Redis).

## Current Functionality

- **User Authentication:** Sign-up and login with JWT.
- **Dashboard:** Personalized home screen after login.
- **Watchlist:** Search stocks and add to a customizable watchlist.
- **Portfolio:** Virtual trading with a simulated cash balance.
- **Stock Data Endpoints:** FastAPI provides real-time price, company info, and historical OHLCV data.
- **Caching:** Redis used to cache financial data and reduce API rate limits.
- **Interactive Charts:** Historical price charts using Material-UI and Recharts.
- **Dockerized Development:** All services run together with live code updates via Docker volumes.

## Planned Features

- **Trading Strategies:** Implement and expose strategies (e.g., MACD) via the Python backend.
- **Real-Time Data:** Use WebSockets for live price updates on the dashboard and watchlist.
- **Scheduled Updates:** Background tasks to keep watched stocks up-to-date.
- **Portfolio Analytics:** Track performance and visualize trades.
- **Notifications:** Alerts for price movements or strategy signals.
- **Complete Documentation:** Usage, API reference, and developer setup instructions.

## Usage

1. Build and start all services:
   ```sh
   docker-compose up --build
   ```
2. Frontend: [http://localhost:3000](http://localhost:3000)
3. Backend (Node.js): [http://localhost:5001](http://localhost:5001)
4. Python Backend (FastAPI): [http://localhost:8000](http://localhost:8000)

## Next Steps

- Continue building trading strategy endpoints in FastAPI.
- Integrate real-time updates and notifications.
- Expand dashboard and portfolio features.
- Improve documentation and onboarding.