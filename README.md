# Trading Platform (MERN + FastAPI)

A full-stack trading platform using MongoDB, Express, React (Vite), Node.js (TypeScript), and FastAPI (Python) for financial data, strategies, and analytics. **All services (frontend, backend, Python API, MongoDB, Redis) run in Docker for both development and production.**
Development containers mount local code for instant updates and hot-reloading; production containers use built images only.



## Features

- User authentication (JWT, bcrypt password hashing)
- Responsive Material UI dashboard (watchlist, portfolio, price, info, charts)
- Add/remove stocks to watchlist
- View historical price charts
- Fully functional virtual trading (buy/sell)
- FastAPI backend for stock data, strategies, analytics, and semantic analysis of news
  - Semantic analysis uses both [finbert-tone](https://huggingface.co/yiyanghkust/finbert-tone) for sentiment classification and news from Finnhub for the news to be classified
- TypeScript backend (Express)
- All API routes versioned under `/api/v1/*` (Node) and `/pyapi/api/v1/*` (Python)
- Modular code for strategy builder, analytics, and real-time updates
- Dockerized setup for frontend, backend, Python, MongoDB, Redis



## Quick Start

### Development

Run with hot-reloading, local code volumes, and dev environment variables:

```sh
docker compose up --build
```

This uses both `docker-compose.yml` and `docker-compose.override.yml` for development settings.

#### Local Build Script (for non-override Docker Compose)

If you are running Docker Compose without the override file, you should build the frontend and backend locally first:

```sh
./build-all.sh
```

This script will build both the frontend and backend before starting Docker Compose. Make sure to run it from the project root.
For the Python backend, add your Finnhub API key to `backend/python/.env` (which is gitignored):

```sh
FINNHUB_API_KEY=your_finnhub_api_key_here
```
Each developer or deployment must set their own API key in this file.
For the Python backend, add your Finnhub API key to `backend/python/.env` (which is gitignored):

```sh
FINNHUB_API_KEY=your_finnhub_api_key_here
```
Each developer or deployment must set their own API key in this file.
**Dev mode details:**
- Frontend runs with Vite dev server (hot reload, API proxy enabled via `vite.config.ts`)
- Backend (Node/Express/TypeScript) and Python services run with local code mounted for instant updates
- API requests from frontend are proxied to backend using Vite proxy config
- All services run in Docker containers with local code mounting for instant updates

### Production

Run with production settings only:

```sh
docker compose -f docker-compose.yml up --build -d
```

This ignores the override file and uses only `docker-compose.yml`.

**Prod mode details:**

- Frontend is served as static files (no Vite proxy)
- API routing handled by NGINX or your cloud proxy
- No code mounting; containers use built images

### Access

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:5001/api/v1](http://localhost:5001/api/v1)
- Python API: [http://localhost:8000/pyapi/api/v1](http://localhost:8000/pyapi/api/v1)
- Production Website: [https://trading.anishsarum.dev](https://trading.anishsarum.dev)

### API Routes

- Node backend: `/api/v1/auth`, `/api/v1/portfolio`, `/api/v1/watchlist`, etc.
- Python backend: `/pyapi/api/v1/stock`, `/pyapi/api/v1/portfolio/value`, etc.

### Environment Variables

Use `.env.production` and `.env.development` files in each service directory for environment-specific configuration. **Never hardcode secrets or sensitive configuration.** Docker Compose and the override file will set the correct variables for each environment.

**Note:** The override file is only used for development. For production, use only `docker-compose.yml` and your proxy config.



## Security

- Passwords are securely hashed using bcrypt before storage; plain text passwords are never saved.
- User authentication is handled via JWT tokens for stateless and secure sessions.
- Sensitive configuration (e.g., secrets, API keys) is managed through environment variables and never hardcoded.
- All source code is public for transparency and auditability.



## Next Steps

- Manual strategy builder and backtesting (in progress)
- Add trading strategies and real-time updates
- Expand portfolio analytics
- Improve documentation

## Contributing & Documentation

- Please document new features or changes in this README.
- Keep code modular for strategy builder, analytics, and real-time updates.

## Semantic Analysis Details

The Python backend provides semantic analysis of stock-related news:
- News articles are fetched from Finnhub.
- Each article is classified for sentiment using [finbert-tone](https://huggingface.co/yiyanghkust/finbert-tone) (FinBERT model).
- The API is extensible, allowing configuration of news count and sentiment window.

Document new features or changes in this README as you extend semantic analysis or related functionality.
