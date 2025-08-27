from fastapi import APIRouter
from strategy.data_fetcher import YFinanceDataProvider
import pandas as pd
from typing import Optional
from utils.cache import get_or_set_cache
import logging

router = APIRouter()

@router.get("/api/v1/stock/{symbol}/price")
async def get_stock_price(symbol: str):
    async def fetch():
        provider = YFinanceDataProvider()
        result = provider.fetch_stock_data(symbol)
        if not result.get("success") or result["data"] is None:
            logging.error(f"Price fetch failed for {symbol}: {result.get('error')}")
            return {"symbol": symbol, "price": None, "error": result.get('error', 'No data found for symbol')}
        data = result["data"]
        if not isinstance(data, pd.DataFrame) or data.empty:
            logging.warning(f"Price fetch: Data empty for {symbol}")
            return {"symbol": symbol, "price": None, "error": "No data found for symbol"}
        latest = data.iloc[-1]
        price = latest["Close"] if "Close" in latest else None
        date = str(latest.name)
        return {"symbol": symbol, "price": price, "date": date}
    return await get_or_set_cache(f"price:{symbol}", fetch, expire=300)

@router.get("/api/v1/stock/{symbol}/history")
async def get_stock_history(symbol: str, start: Optional[str] = None, end: Optional[str] = None, interval: str = "1d"):
    async def fetch():
        provider = YFinanceDataProvider()
        result = provider.fetch_stock_data(symbol, start=start, end=end, interval=interval)
        expected_cols = ["Date", "Open", "High", "Low", "Close", "Volume"]
        if not result.get("success") or result["data"] is None:
            logging.error(f"History fetch failed for {symbol}: {result.get('error')}")
            return {"symbol": symbol, "history": [], "error": result.get('error', 'No data found for symbol or date range')}
        data = result["data"].reset_index() if isinstance(result["data"], pd.DataFrame) else None
        missing = [col for col in expected_cols if data is None or col not in data.columns]
        if data is None or data.empty or missing:
            error_msg = "No data found for symbol or date range (weekend/holiday?)"
            if missing:
                error_msg = f"Missing columns: {missing}. Likely no trading data for this date (weekend/holiday?)"
            logging.warning(f"History fetch: {error_msg}")
            return {"symbol": symbol, "history": [], "error": error_msg}
        records = data[expected_cols].to_dict(orient="records")
        return {"symbol": symbol, "history": records}
    return await get_or_set_cache(f"history:{symbol}:{start}:{end}:{interval}", fetch, expire=600)

@router.get("/api/v1/stock/{symbol}/info")
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
            logging.error(f"Info fetch failed for {symbol}: {e}")
            return {"symbol": symbol, "error": str(e)}
    return await get_or_set_cache(f"info:{symbol}", fetch, expire=3600)
