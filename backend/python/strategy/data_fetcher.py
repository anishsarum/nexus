import yfinance as yf
import logging

class DataProvider:
    def fetch_stock_data(self, symbol, **kwargs):
        raise NotImplementedError

class YFinanceDataProvider(DataProvider):
    def __init__(self, yf_module=None):
        self.yf = yf_module if yf_module is not None else yf

    def fetch_latest_price(self, symbol):
        try:
            ticker = self.yf.Ticker(symbol)
            price = ticker.info.get("regularMarketPrice")
            timestamp = ticker.info.get("regularMarketTime")
            if price is not None:
                return {"success": True, "price": price, "timestamp": timestamp}
            else:
                logging.warning(f"No price found for {symbol}")
                return {"success": False, "error": "No price found", "price": None, "timestamp": None}
        except Exception as e:
            logging.error(f"Error fetching latest price for {symbol}: {e}")
            return {"success": False, "error": str(e), "price": None, "timestamp": None}
        
    def fetch_stock_data(self, symbol, start=None, end=None, interval="1d", **kwargs):
        try:
            df = self.yf.download(symbol, start=start, end=end, interval=interval, **kwargs)
            if df is None or df.empty:
                logging.warning(f"No data or rate limited for {symbol}")
                return {"success": False, "error": "No data or rate limited", "data": None}
            cols_to_drop = [col for col in df.columns if any(isinstance(x, (list, dict)) for x in df[col])]
            if cols_to_drop:
                df = df.drop(columns=cols_to_drop)
            return {"success": True, "data": df}
        except Exception as e:
            logging.error(f"Error fetching data for {symbol}: {e}")
            return {"success": False, "error": str(e), "data": None}

# Usage example:
# provider = YFinanceDataProvider()
# df = provider.fetch_stock_data("AAPL", start="2022-01-01", end="2023-01-01")
