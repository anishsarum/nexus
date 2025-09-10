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
  - Semantic analysis uses [distilroberta-finetuned-financial-news-sentiment-analysis](https://huggingface.co/mrm8488/distilroberta-finetuned-financial-news-sentiment-analysis) for sentiment classification and news from Finnhub for the news to be classified
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

# Trading Platform (MERN + FastAPI)

## Features

- User authentication (JWT, bcrypt password hashing)
- Responsive Material UI dashboard (watchlist, portfolio, price, info, charts)
- Add/remove stocks to watchlist
- View historical price charts
- Virtual trading (buy/sell)
- Semantic analysis of financial news using [distilroberta-finetuned-financial-news-sentiment-analysis](https://huggingface.co/mrm8488/distilroberta-finetuned-financial-news-sentiment-analysis)
- FastAPI backend for stock data, strategies, analytics
- TypeScript backend (Express)
- Modular code for strategy builder, analytics, and real-time updates
- Dockerized setup for frontend, backend, Python, MongoDB, Redis

## Setup & Usage

### Development

Run with hot-reloading and local code volumes:

```sh
docker compose up --build
```

This uses both `docker-compose.yml` and `docker-compose.override.yml` for development settings.

If you are running Docker Compose without the override file, build the frontend and backend locally first:

```sh
./build-all.sh
```

For the Python backend, add your Finnhub API key to `backend/python/.env` (gitignored):

```sh
FINNHUB_API_KEY=your_finnhub_api_key_here
```

### Production

Run with production settings only:

```sh
docker compose -f docker-compose.yml up --build -d
```

## Access

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:5001/api/v1](http://localhost:5001/api/v1)
- Python API: [http://localhost:8000/pyapi/api/v1](http://localhost:8000/pyapi/api/v1)
- Production Website: [https://trading.anishsarum.dev](https://trading.anishsarum.dev)

## API Routes

- Node backend: `/api/v1/auth`, `/api/v1/portfolio`, `/api/v1/watchlist`, etc.
- Python backend: `/pyapi/api/v1/stock`, `/pyapi/api/v1/portfolio/value`, etc.

## Environment Variables

Use `.env.production` and `.env.development` files in each service directory for environment-specific configuration. Docker Compose and the override file will set the correct variables for each environment.

## Security

- Passwords are securely hashed using bcrypt before storage
- User authentication via JWT tokens
- Sensitive configuration managed through environment variables

## Semantic Analysis

- News articles are fetched from Finnhub
- Sentiment is classified using [distilroberta-finetuned-financial-news-sentiment-analysis](https://huggingface.co/mrm8488/distilroberta-finetuned-financial-news-sentiment-analysis)
- The API is extensible for news count and sentiment window
- News articles are fetched from Finnhub.
