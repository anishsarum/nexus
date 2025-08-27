import logging

def analyze_sentiment(stock, score=None):
    """
    Simulate sentiment analysis for a given stock.
    Allows score injection for testing.
    Returns a structured result.
    """
    sentiment_score = score if score is not None else 1
    logging.info(f"Sentiment for {stock}: {sentiment_score}")
    return {"stock": stock, "sentiment": sentiment_score}
