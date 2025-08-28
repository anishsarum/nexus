from fastapi import APIRouter
from strategy.data_fetcher import YFinanceDataProvider
from strategy.core_strategy import macd_strategy
import pandas as pd
from utils.cache import get_or_set_cache
import logging

router = APIRouter()


@router.get("/api/strategy/{symbol}")
async def get_strategy_signals(symbol: str):
    async def fetch():
        provider = YFinanceDataProvider()
        result = provider.fetch_stock_data(symbol)
        if not result.get("success") or result["data"] is None:
            logging.error(f"Strategy fetch failed for {symbol}: {result.get('error')}")
            return {
                "signals": [],
                "error": result.get("error", "No data found for symbol"),
            }
        data = result["data"]
        if not isinstance(data, pd.DataFrame):
            logging.warning(f"Strategy fetch: Data not DataFrame for {symbol}")
            return {"signals": [], "error": "No data found for symbol"}
        signals = macd_strategy(data)
        if not isinstance(signals, list):
            logging.warning(f"Strategy fetch: MACD signals not list for {symbol}")
            signals = []
        return {"signals": signals}

    return await get_or_set_cache(f"strategy:{symbol}", fetch, expire=120)
