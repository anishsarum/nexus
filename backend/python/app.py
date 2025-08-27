from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.tickers import router as tickers_router
from routes.stock import router as stock_router
from routes.strategy import router as strategy_router
from routes.portfolio import router as portfolio_router


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development; restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(tickers_router)
app.include_router(stock_router)
app.include_router(strategy_router)
app.include_router(portfolio_router)
