from fastapi import APIRouter
from strategy.data_fetcher import YFinanceDataProvider
from strategy.core_strategy import macd_strategy
import pandas as pd
from utils.cache import get_or_set_cache

router = APIRouter()

@router.get("/api/strategy/{symbol}")
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
    return await get_or_set_cache(f"strategy:{symbol}", fetch, expire=120)
