from fastapi import APIRouter
from fastapi.responses import JSONResponse
import pandas as pd
import os
import logging

router = APIRouter()


@router.get("/api/tickers")
async def get_tickers():
    csv_path = os.path.join(os.path.dirname(__file__), "../data/sp500_companies.csv")
    try:
        df = pd.read_csv(csv_path)
        required_cols = {"Symbol", "Shortname"}
        if not required_cols.issubset(df.columns):
            logging.error(
                f"CSV missing required columns: {required_cols - set(df.columns)}"
            )
            return JSONResponse(
                {
                    "error": f"CSV missing required columns: {required_cols - set(df.columns)}"
                },
                status_code=500,
            )
        result = [
            {"symbol": row["Symbol"], "name": row["Shortname"]}
            for _, row in df.iterrows()
        ]
        return JSONResponse(result)
    except Exception as e:
        logging.error(f"Error loading tickers CSV: {e}")
        return JSONResponse(
            {"error": f"Error loading tickers CSV: {str(e)}"}, status_code=500
        )
