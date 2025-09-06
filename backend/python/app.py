from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from routes.tickers import router as tickers_router
from routes.stock import router as stock_router
from routes.strategy import router as strategy_router
from routes.portfolio import router as portfolio_router
from routes.semantic_analysis import router as semantic_analysis_router


app = FastAPI()
allowed_origins = os.getenv("ALLOWED_ORIGINS", "https://trading.anishsarum.dev").split(
    ","
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(tickers_router)
app.include_router(stock_router)
app.include_router(strategy_router)
app.include_router(portfolio_router)
app.include_router(semantic_analysis_router)
