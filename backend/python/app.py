from fastapi import FastAPI
from strategy.data_fetcher import YFinanceDataProvider
from strategy.core_strategy import macd_strategy
import pandas as pd

app = FastAPI()

@app.get("/api/stock/{symbol}")
def get_stock_data(symbol: str):
    provider = YFinanceDataProvider()
    data = provider.fetch_stock_data(symbol)
    if data is None or not isinstance(data, pd.DataFrame):
        return {"error": "No data found for symbol"}
    try:
        result = data.reset_index().to_dict(orient="records")
        return result
    except Exception as e:
        return {"error": f"Serialization error: {str(e)}"}

@app.get("/api/strategy/{symbol}")
def get_strategy_signals(symbol: str):
    provider = YFinanceDataProvider()
    data = provider.fetch_stock_data(symbol)
    if data is None or not isinstance(data, pd.DataFrame):
        return {"error": "No data found for symbol"}
    signals = macd_strategy(data)
    try:
        return {"signals": signals}
    except Exception as e:
        return {"error": f"Serialization error: {str(e)}"}
