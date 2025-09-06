import os
import httpx
from fastapi import APIRouter, Query
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from strategy.finbert import FinBERTSentimentAnalyzer

load_dotenv()

router = APIRouter()

FINNHUB_API_KEY = os.getenv("FINNHUB_API_KEY")


@router.get("/api/semantic-analysis")
async def semantic_analysis(
    symbol: str = Query(..., description="Stock symbol, e.g. AAPL"),
    recent_count: int = Query(
        5, ge=1, description="Number of news items to show in recent_news"
    ),
    overall_count: int = Query(
        20, ge=1, description="Number of news items to use for overall sentiment"
    ),
) -> JSONResponse:
    """
    Get news for a stock symbol from Finnhub, then run FinBERT sentiment analysis on each headline.
    Parameters:
        symbol (str): Stock ticker symbol (e.g., AAPL)
    Returns:
        JSONResponse: List of news headlines and their FinBERT sentiment
    """
    if not FINNHUB_API_KEY:
        return JSONResponse(
            {"error": "Finnhub API key not set", "FINNHUB_API_KEY": FINNHUB_API_KEY},
            status_code=500,
        )
    url = f"https://finnhub.io/api/v1/company-news?symbol={symbol}&from=2025-09-01&to=2025-09-06&token={FINNHUB_API_KEY}"
    async with httpx.AsyncClient() as client:
        resp = await client.get(url)
        if resp.status_code != 200:
            try:
                error_data = resp.json()
            except Exception:
                error_data = resp.text
            return JSONResponse(
                {
                    "error": "Failed to fetch news",
                    "status": resp.status_code,
                    "response": error_data,
                },
                status_code=resp.status_code,
            )
        news_data = resp.json()
        analyzer = FinBERTSentimentAnalyzer()
        results = []
        for item in news_data:
            headline = item.get("headline")
            if not headline:
                continue
            sentiment = analyzer.analyze(headline)
            results.append(
                {
                    "headline": headline,
                    "datetime": item.get("datetime"),
                    "source": item.get("source"),
                    "url": item.get("url"),
                    "finbert_sentiment": sentiment,
                }
            )
        # Prepare recent_news (customizable count)
        recent_news = (
            results[:recent_count] if len(results) >= recent_count else results
        )

        # Use overall_count for overall sentiment calculation
        overall_news = (
            results[:overall_count] if len(results) >= overall_count else results
        )

        # Aggregate scores for overall_news
        total_scores = {"negative": 0.0, "neutral": 0.0, "positive": 0.0}
        for item in overall_news:
            scores = item["finbert_sentiment"]["scores"]
            total_scores["negative"] += scores["negative"]
            total_scores["neutral"] += scores["neutral"]
            total_scores["positive"] += scores["positive"]
        n = len(overall_news)
        avg_scores = {k: v / n if n else 0.0 for k, v in total_scores.items()}
        # Majority label
        overall_label = max(avg_scores, key=lambda k: avg_scores[k])

        return JSONResponse(
            {
                "symbol": symbol,
                "recent_news": recent_news,
                "overall_sentiment": {"label": overall_label, "scores": avg_scores},
                "news": results,
                "raw_news": news_data,
            }
        )
