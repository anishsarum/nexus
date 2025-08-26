from fastapi import APIRouter
from fastapi.responses import JSONResponse

sp500 = [
    'AAPL', 'MSFT', 'GOOG', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX', 'AMD', 'INTC',
    'BABA', 'JPM', 'V', 'DIS', 'PYPL', 'ADBE', 'CSCO', 'ORCL', 'CRM', 'QCOM',
    'SPY', 'QQQ', 'DIA', 'XOM', 'CVX', 'BA', 'T', 'KO', 'PEP', 'MCD', 'WMT',
    'UNH', 'HD', 'VZ', 'PG', 'MA', 'ABBV', 'LLY', 'MRK', 'TMO', 'AVGO', 'COST',
    'SBUX', 'BKNG', 'AXP', 'GS', 'BLK', 'FDX', 'UPS', 'CAT', 'DE', 'GM', 'F',
]

router = APIRouter()

@router.get("/api/tickers")
async def get_tickers():
    result = [{"symbol": symbol, "name": symbol} for symbol in sp500]
    return JSONResponse(result)
