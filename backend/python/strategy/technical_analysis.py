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
    if data is None or len(data) == 0:
        return None
    try:
        return SMAIndicator(data, window=window).sma_indicator()
    except Exception as e:
        import logging
        logging.error(f"Error calculating SMA: {e}")
        return None


def get_macd(data):
    """
    Calculate MACD and MACD Signal Line.

    Parameters:
    - data (pandas.Series): Closing prices.

    Returns:
    - tuple: (macd, macd_signal) as pandas.Series
    """
    if data is None or len(data) == 0:
        return None, None
    try:
        macd_indicator = MACD(data)
        return macd_indicator.macd(), macd_indicator.macd_signal()
    except Exception as e:
        import logging
        logging.error(f"Error calculating MACD: {e}")
        return None, None


def calculate_technical_indicators(data):
    """
    Calculate technical indicators: SMA(1), SMA(10), MACD, MACD Signal.

    Parameters:
    - data (pandas.DataFrame): Stock data with a 'close' column.

    Returns:
    - pandas.DataFrame: DataFrame containing all indicators.
    """
    if data is None or "close" not in data:
        import logging
        logging.error("Input data must be a DataFrame with a 'close' column.")
        return {"success": False, "error": "Missing 'close' column", "indicators": None}
    close_prices = data["close"].squeeze()
    sma_1 = get_sma(close_prices, window=1)
    sma_10 = get_sma(close_prices, window=10)
    macd, macd_signal = get_macd(close_prices)
    indicators = {
        "SMA_1": sma_1,
        "SMA_10": sma_10,
        "MACD": macd,
        "MACD_Signal": macd_signal,
    }
    if any(v is None for v in indicators.values()):
        return {"success": False, "error": "Indicator calculation failed", "indicators": indicators}
    return {"success": True, "indicators": indicators}
