
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from strategy.data_fetcher import YFinanceDataProvider
from strategy.core_strategy import macd_strategy
import pandas as pd


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development; restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/stock/{symbol}")
def get_stock_data(symbol: str):
    provider = YFinanceDataProvider()
    data = provider.fetch_stock_data(symbol)
    if data is None or not isinstance(data, pd.DataFrame):
        return [{"Date": "N/A", "Close": 0, "Error": "No data found for symbol"}]
    data.columns = [str(col) for col in data.columns]
    data = data.reset_index()
    if any(isinstance(x, (list, dict)) for x in data.index):
        data.index = pd.Index([str(x) for x in data.index])
    cols_to_drop = []
    for col in data.columns:
        if any(isinstance(x, (list, dict)) for x in data[col]):
            cols_to_drop.append(col)
    if cols_to_drop:
        data = data.drop(columns=cols_to_drop)
    try:
        result = data.to_dict(orient="records")
        return result
    except Exception as e:
        return [{"Date": "N/A", "Close": 0, "Error": f"Serialization error: {str(e)}"}]

@app.get("/api/strategy/{symbol}")
def get_strategy_signals(symbol: str):
    provider = YFinanceDataProvider()
    data = provider.fetch_stock_data(symbol)
    if data is None or not isinstance(data, pd.DataFrame):
        return {"signals": [], "error": "No data found for symbol"}
    signals = macd_strategy(data)
    if not isinstance(signals, list):
        signals = []
    return {"signals": signals}
