import pandas as pd
from ta.trend import MACD, SMAIndicator


def get_sma(data, window):
    """
    Calculate Simple Moving Average (SMA) for a given window.

    Parameters:
    - data (pandas.Series): Closing prices.
    - window (int): Window size for SMA.

    Returns:
    - pandas.Series: SMA values.
    """
    return SMAIndicator(data, window=window).sma_indicator()


def get_macd(data):
    """
    Calculate MACD and MACD Signal Line.

    Parameters:
    - data (pandas.Series): Closing prices.

    Returns:
    - tuple: (macd, macd_signal) as pandas.Series
    """
    macd_indicator = MACD(data)
    return macd_indicator.macd(), macd_indicator.macd_signal()


def calculate_technical_indicators(data):
    """
    Calculate technical indicators: SMA(1), SMA(10), MACD, MACD Signal.

    Parameters:
    - data (pandas.DataFrame): Stock data with a 'close' column.

    Returns:
    - pandas.DataFrame: DataFrame containing all indicators.
    """
    close_prices = data["close"].squeeze()

    sma_1 = get_sma(close_prices, window=1)
    sma_10 = get_sma(close_prices, window=10)
    macd, macd_signal = get_macd(close_prices)

    return pd.DataFrame(
        {
            "SMA_1": sma_1,
            "SMA_10": sma_10,
            "MACD": macd,
            "MACD_Signal": macd_signal,
        }
    )
