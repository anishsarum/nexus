import os
import httpx
from fastapi import APIRouter, Query
from fastapi.responses import JSONResponse
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

FINNHUB_API_KEY = os.getenv("FINNHUB_API_KEY")


@router.get("/api/semantic-analysis")
async def semantic_analysis(
    symbol: str = Query(..., description="Stock symbol, e.g. AAPL"),
) -> JSONResponse:
    """
    Get Finnhub news sentiment signal strength for a given stock symbol.
    Parameters:
        symbol (str): Stock ticker symbol (e.g., AAPL)
    Returns:
        JSONResponse: Sentiment signal and details from Finnhub
    """
    if not FINNHUB_API_KEY:
        return JSONResponse({"error": "Finnhub API key not set"}, status_code=500)
    url = f"https://finnhub.io/api/v1/news-sentiment?symbol={symbol}&token={FINNHUB_API_KEY}"
    async with httpx.AsyncClient() as client:
        resp = await client.get(url)
    if resp.status_code != 200:
        return JSONResponse(
            {"error": "Failed to fetch sentiment", "status": resp.status_code},
            status_code=resp.status_code,
        )
    data = resp.json()
    return JSONResponse(
        {
            "symbol": symbol,
            "signal": data.get("signal"),
            "sentiment": data.get("sentiment"),
            "data": data,
        }
    )
