# Trading Platform (MERN + FastAPI)

## Project Overview
A full-stack trading platform for virtual stock trading, analytics, and financial news sentiment analysis. Built with MongoDB, Express, React (Vite), Node.js (TypeScript), and FastAPI (Python).

## Live Demo
- Production: [https://trading.anishsarum.dev](https://trading.anishsarum.dev)

## Features
- User authentication (JWT, bcrypt password hashing)
- Responsive Material UI dashboard (watchlist, portfolio, price, info, charts)
- Add/remove stocks to watchlist
- View historical price charts
- Virtual trading (buy/sell)
- Semantic analysis of financial news using [distilroberta-finetuned-financial-news-sentiment-analysis](https://huggingface.co/mrm8488/distilroberta-finetuned-financial-news-sentiment-analysis)
- Modular code for strategy builder, analytics, and real-time updates

## Tech Stack
- Frontend: React (Vite, TypeScript, Material UI)
- Backend: Node.js (Express, TypeScript)
- Python API: FastAPI (semantic analysis, strategies)
- Database: MongoDB
- Caching: Redis
- Containerization: Docker Compose

## Architecture & Infrastructure
- All services run in Docker (dev & prod)
- Hot-reloading in development via mounted code
- API routes: `/api/v1/*` (Node), `/pyapi/api/v1/*` (Python)
- Production deployment: Google Cloud Compute Engine, nginx reverse proxy, Let's Encrypt SSL

## Security Practices
- Passwords hashed with bcrypt
- JWT authentication
- Secrets managed via environment variables

## API Routes
- Node backend: `/api/v1/auth`, `/api/v1/portfolio`, `/api/v1/watchlist`, etc.
- Python backend: `/pyapi/api/v1/stock`, `/pyapi/api/v1/portfolio/value`, etc.

## Semantic Analysis
- News fetched from Finnhub
- Sentiment classified using [distilroberta-finetuned-financial-news-sentiment-analysis](https://huggingface.co/mrm8488/distilroberta-finetuned-financial-news-sentiment-analysis)
- Extensible API for news count and sentiment window

## Setup & Usage

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

## Environment Variables
Use `.env.production` and `.env.development` files in each service directory for environment-specific configuration. Docker Compose and the override file will set the correct variables for each environment.

---
