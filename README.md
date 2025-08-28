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

### Development

Run with hot-reloading, local code volumes, and dev environment variables:

```sh
docker compose up --build
```

This uses both `docker-compose.yml` and `docker-compose.override.yml` for development settings.

**Dev mode details:**
- Frontend runs with `npm start` (hot reload, API proxy enabled via `package.json`)
- Backend and Python services run with local code mounted for instant updates
- API requests from frontend are proxied to backend using the React proxy field

### Production

Run with production settings only:

```sh
docker compose -f docker-compose.yml up --build -d
```

This ignores the override file and uses only `docker-compose.yml`.

**Prod mode details:**
- Frontend is served as static files (no React proxy)
- API routing handled by NGINX or your cloud proxy
- No code mounting; containers use built images

### Access

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:5001](http://localhost:5001)
- Python API: [http://localhost:8000](http://localhost:8000)

### Environment Variables

Use `.env.production` and `.env.development` files in each service directory for environment-specific configuration. Docker Compose and the override file will set the correct variables for each environment.

**Note:** The override file is only used for development. For production, use only `docker-compose.yml` and your proxy config.


## Next Steps

- Manual strategy builder and backtesting (in progress)
- Add trading strategies and real-time updates
- Expand portfolio analytics
- Improve documentation