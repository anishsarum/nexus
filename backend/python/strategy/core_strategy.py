
import pandas as pd
from strategy.data_fetcher import YFinanceDataProvider
from strategy.sentiment_analysis import analyze_sentiment
from strategy.technical_analysis import calculate_technical_indicators

def should_buy(data, sentiment):
    """
    Determines if a stock meets the buy criteria.
    """
    indicators = calculate_technical_indicators(data)
    return (
        sentiment > 0
        and indicators["SMA_1"].iloc[-1] > indicators["SMA_10"].iloc[-1]
        and indicators["MACD"].iloc[-1] > indicators["MACD_Signal"].iloc[-1]
    )

def analyze_stock(stock, provider=None, start=None, end=None, interval="1d"):
    """
    Analyzes a single stock and returns details if it meets buy criteria.
    """
    if provider is None:
        provider = YFinanceDataProvider()
    data = provider.fetch_stock_data(stock, start=start, end=end, interval=interval)
    if data is not None and not data.empty:
        sentiment = analyze_sentiment(stock)
        if should_buy(data, sentiment):
            indicators = calculate_technical_indicators(data)
            return {
                "Stock": stock,
                "Sentiment": sentiment,
                "SMA_1": indicators["SMA_1"].iloc[-1],
                "SMA_10": indicators["SMA_10"].iloc[-1],
                "MACD": indicators["MACD"].iloc[-1],
                "MACD_Signal": indicators["MACD_Signal"].iloc[-1],
            }
    return None

def filter_stocks(stocks, provider=None, start=None, end=None, interval="1d"):
    """
    Filters stocks based on sentiment and technical indicators.
    """
    if provider is None:
        provider = YFinanceDataProvider()
    results = []
    for stock in stocks:
        result = analyze_stock(stock, provider=provider, start=start, end=end, interval=interval)
        if result:
            results.append(result)
    return pd.DataFrame(results)

def macd_strategy(data: pd.DataFrame):
    """
    Simple MACD strategy: returns buy/sell signals as a list of dicts.
    Each dict contains 'action', 'date', and 'price'.
    """
    if data is None or data.empty or 'Close' not in data:
        return []
    data = data.copy()
    data['EMA12'] = data['Close'].ewm(span=12, adjust=False).mean()
    data['EMA26'] = data['Close'].ewm(span=26, adjust=False).mean()
    data['MACD'] = data['EMA12'] - data['EMA26']
    data['Signal'] = data['MACD'].ewm(span=9, adjust=False).mean()
    signals = []
    for i in range(1, len(data)):
        prev_macd = data['MACD'].iloc[i-1]
        prev_signal = data['Signal'].iloc[i-1]
        curr_macd = data['MACD'].iloc[i]
        curr_signal = data['Signal'].iloc[i]
        date = str(data.index[i])
        price = data['Close'].iloc[i]
        if prev_macd < prev_signal and curr_macd > curr_signal:
            signals.append({'action': 'buy', 'date': date, 'price': price})
        elif prev_macd > prev_signal and curr_macd < curr_signal:
            signals.append({'action': 'sell', 'date': date, 'price': price})
    return signals
