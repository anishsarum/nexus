import yfinance as yf

class DataProvider:
    def fetch_stock_data(self, symbol, **kwargs):
        raise NotImplementedError

class YFinanceDataProvider(DataProvider):
    def fetch_stock_data(self, symbol, start=None, end=None, interval="1d", **kwargs):
        import pandas as pd
        try:
            df = yf.download(symbol, start=start, end=end, interval=interval, **kwargs)
            if df is None or df.empty:
                return pd.DataFrame([{"Date": "N/A", "Close": 0, "Error": "No data or rate limited"}])
            cols_to_drop = [col for col in df.columns if any(isinstance(x, (list, dict)) for x in df[col])]
            if cols_to_drop:
                df = df.drop(columns=cols_to_drop)
            return df
        except Exception as e:
            print(f"Error fetching data for {symbol}: {e}")
            return pd.DataFrame([{"Date": "N/A", "Close": 0, "Error": str(e)}])

# Usage example:
# provider = YFinanceDataProvider()
# df = provider.fetch_stock_data("AAPL", start="2022-01-01", end="2023-01-01")
