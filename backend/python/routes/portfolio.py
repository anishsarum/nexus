from fastapi import APIRouter, Query
from fastapi.responses import JSONResponse
from strategy.data_fetcher import YFinanceDataProvider
import pandas as pd
import math
import logging

router = APIRouter()


# Example: expects holdings as a query param (in production, fetch from DB)
@router.get("/api/portfolio/value")
async def get_portfolio_value(
    symbols: str = Query(..., description="Comma-separated ticker symbols"),
    quantities: str = Query(..., description="Comma-separated quantities"),
    avgPrices: str = Query(..., description="Comma-separated average prices"),
):
    symbol_list = symbols.split(",")
    quantity_list = [float(q) for q in quantities.split(",")]
    avg_price_list = [float(p) for p in avgPrices.split(",")]
    if len(symbol_list) != len(quantity_list) or len(symbol_list) != len(
        avg_price_list
    ):
        return JSONResponse(
            {"error": "Symbols, quantities, and avgPrices length mismatch"},
            status_code=400,
        )

    def get_fallback_price(provider, symbol):
        try:
            data_result = provider.fetch_stock_data(symbol)
            if not data_result.get("success") or data_result["data"] is None:
                logging.warning(
                    f"Fallback: No data for {symbol}: {data_result.get('error')}"
                )
                return 0.0, None, data_result.get("error")
            data = data_result["data"]
            if isinstance(data, pd.DataFrame) and not data.empty:
                latest = data.iloc[-1]
                price = float(latest["Close"]) if "Close" in latest else 0.0
                timestamp = str(latest.name) if hasattr(latest, "name") else None
                return price, timestamp, None
            else:
                logging.warning(f"Fallback: Data empty for {symbol}")
                return 0.0, None, "Data empty"
        except Exception as e:
            logging.error(f"Fallback: Exception for {symbol}: {e}")
            return 0.0, None, str(e)

    prices = []
    timestamps = []
    errors = []
    provider = YFinanceDataProvider()
    for symbol in symbol_list:
        result = provider.fetch_latest_price(symbol)
        price = result.get("price")
        timestamp = result.get("timestamp")
        error = result.get("error") if not result.get("success") else None
        if price is None:
            price, timestamp, error = get_fallback_price(provider, symbol)
        prices.append(price)
        timestamps.append(timestamp)
        errors.append(error)

    assets = []
    total_value = 0
    for symbol, qty, avg_price, price, timestamp, error in zip(
        symbol_list, quantity_list, avg_price_list, prices, timestamps, errors
    ):
        price = float(price) if price is not None else 0.0
        qty = float(qty) if qty is not None else 0.0
        avg_price = float(avg_price) if avg_price is not None else 0.0
        value = qty * price
        # Calculate profit/loss percentage
        if avg_price > 0:
            change_pct = ((price - avg_price) / avg_price) * 100
        else:
            change_pct = 0.0
        # Sanitize float values for JSON compliance
        if not math.isfinite(value):
            value = 0.0
        if not math.isfinite(change_pct):
            change_pct = 0.0
        if not math.isfinite(price):
            price = 0.0
        asset = {
            "symbol": symbol,
            "quantity": qty,
            "avgPrice": avg_price,
            "price": price,
            "value": value,
            "change_pct": change_pct,
            "timestamp": timestamp,
        }
        if error:
            asset["error"] = error
        assets.append(asset)
        total_value += value if math.isfinite(value) else 0.0

    return {"assets": assets, "total_value": total_value}
