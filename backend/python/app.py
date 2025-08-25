
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from strategy.data_fetcher import YFinanceDataProvider
from strategy.core_strategy import macd_strategy
import pandas as pd
from typing import Optional

import redis.asyncio as redis
import json
import numpy as np

def to_jsonable(obj):
    if isinstance(obj, pd.DataFrame):
        return obj.to_dict(orient="records")
    elif isinstance(obj, pd.Series):
        return obj.to_dict()
    elif isinstance(obj, np.generic):
        return obj.item()
    elif isinstance(obj, pd.Timestamp):
        return obj.isoformat()
    elif isinstance(obj, dict):
        return {str(k): to_jsonable(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [to_jsonable(v) for v in obj]
    else:
        return obj

redis_client = redis.Redis(host='redis', port=6379, db=0)

async def get_or_set_cache(key, fetch_func, expire=300):
    cached = await redis_client.get(key)
    if cached:
        return json.loads(cached.decode("utf-8"))
    result = await fetch_func()
    result_jsonable = to_jsonable(result)
    await redis_client.setex(key, expire, json.dumps(result_jsonable))
    return result_jsonable

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development; restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# GET /api/v1/stock/{ticker}/price
@app.get("/api/v1/stock/{symbol}/price")
async def get_stock_price(symbol: str):
    async def fetch():
        provider = YFinanceDataProvider()
        data = provider.fetch_stock_data(symbol)
        if data is None or not isinstance(data, pd.DataFrame) or data.empty:
            return {"symbol": symbol, "price": None, "error": "No data found for symbol"}
        latest = data.iloc[-1]
        price = latest["Close"] if "Close" in latest else None
        date = str(latest.name)
        return {"symbol": symbol, "price": price, "date": date}
    return await get_or_set_cache(f"price:{symbol}", fetch, expire=300)

# GET /api/v1/stock/{ticker}/history
@app.get("/api/v1/stock/{symbol}/history")
async def get_stock_history(symbol: str, start: Optional[str] = None, end: Optional[str] = None, interval: str = "1d"):
    async def fetch():
        provider = YFinanceDataProvider()
        data = provider.fetch_stock_data(symbol, start=start, end=end, interval=interval)
        expected_cols = ["Date", "Open", "High", "Low", "Close", "Volume"]
        data = data.reset_index() if isinstance(data, pd.DataFrame) else None

        missing = [col for col in expected_cols if data is None or col not in data.columns]
        if data is None or data.empty or missing:
            error_msg = "No data found for symbol or date range (weekend/holiday?)"
            if missing:
                error_msg = f"Missing columns: {missing}. Likely no trading data for this date (weekend/holiday?)"
            return {"symbol": symbol, "history": [], "error": error_msg}

        records = data[expected_cols].to_dict(orient="records")
        return {"symbol": symbol, "history": records}
    return await get_or_set_cache(f"history:{symbol}:{start}:{end}:{interval}", fetch, expire=600)

# GET /api/v1/stock/{ticker}/info
@app.get("/api/v1/stock/{symbol}/info")
async def get_stock_info(symbol: str):
    async def fetch():
        import yfinance as yf
        try:
            ticker = yf.Ticker(symbol)
            info = ticker.info
            return {
                "symbol": symbol,
                "shortName": info.get("shortName"),
                "sector": info.get("sector"),
                "industry": info.get("industry"),
                "summary": info.get("longBusinessSummary"),
            }
        except Exception as e:
            return {"symbol": symbol, "error": str(e)}
    return await get_or_set_cache(f"info:{symbol}", fetch, expire=3600)

# MACD strategy endpoint (unchanged)
@app.get("/api/strategy/{symbol}")
async def get_strategy_signals(symbol: str):
    async def fetch():
        provider = YFinanceDataProvider()
        data = provider.fetch_stock_data(symbol)
        if data is None or not isinstance(data, pd.DataFrame):
            return {"signals": [], "error": "No data found for symbol"}
        signals = macd_strategy(data)
        if not isinstance(signals, list):
            signals = []
        return {"signals": signals}
    # Optionally cache strategy signals for a short time
    return await get_or_set_cache(f"strategy:{symbol}", fetch, expire=120)
