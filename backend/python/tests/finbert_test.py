import os
os.environ['KMP_DUPLICATE_LIB_OK'] = 'TRUE'

import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import numpy as np
import logging

class FinBERTSentimentAnalyzer:
    def __init__(self, model_name="yiyanghkust/finbert-tone"):
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModelForSequenceClassification.from_pretrained(model_name)
        self.labels = ["neutral", "positive", "negative"]

    def analyze(self, text):
        try:
            inputs = self.tokenizer(text, return_tensors="pt", truncation=True)
            with torch.no_grad():
                outputs = self.model(**inputs)
                logits = outputs.logits.detach().cpu().numpy()[0]
                # Use softmax to get probabilities
                probs = np.exp(logits) / np.sum(np.exp(logits))
                sentiment_idx = int(np.argmax(probs))
                sentiment = self.labels[sentiment_idx]
                scores = {
                    label: float(prob) for label, prob in zip(self.labels, probs)
                }
                return {"sentiment": sentiment, "scores": scores}
        except Exception as e:
            logging.error(f"FinBERT analysis error: {e}")
            return {"error": str(e)}

class ProsusFinBERTSentimentAnalyzer:
    def __init__(self, model_name="ProsusAI/finbert"):
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModelForSequenceClassification.from_pretrained(model_name)
        self.labels = ["positive", "negative", "neutral"]

    def analyze(self, text):
        try:
            inputs = self.tokenizer(text, return_tensors="pt", truncation=True)
            with torch.no_grad():
                outputs = self.model(**inputs)
                logits = outputs.logits.detach().cpu().numpy()[0]
                # Use softmax to get probabilities
                probs = np.exp(logits) / np.sum(np.exp(logits))
                sentiment_idx = int(np.argmax(probs))
                sentiment = self.labels[sentiment_idx]
                scores = {
                    label: float(prob) for label, prob in zip(self.labels, probs)
                }
                return {"sentiment": sentiment, "scores": scores}
        except Exception as e:
            logging.error(f"Prosus FinBERT analysis error: {e}")
            return {"error": str(e)}

class DistilRobertaFinancialSentimentAnalyzer:
    def __init__(self, model_name="mrm8488/distilroberta-finetuned-financial-news-sentiment-analysis"):
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModelForSequenceClassification.from_pretrained(model_name)
        self.labels = ["negative", "neutral", "positive"]

    def analyze(self, text):
        try:
            inputs = self.tokenizer(text, return_tensors="pt", truncation=True)
            with torch.no_grad():
                outputs = self.model(**inputs)
                logits = outputs.logits.detach().cpu().numpy()[0]
                probs = np.exp(logits) / np.sum(np.exp(logits))
                sentiment_idx = int(np.argmax(probs))
                sentiment = self.labels[sentiment_idx]
                scores = {
                    label: float(prob) for label, prob in zip(self.labels, probs)
                }
                return {"sentiment": sentiment, "scores": scores}
        except Exception as e:
            logging.error(f"DistilRoberta Financial analysis error: {e}")
            return {"error": str(e)}

if __name__ == "__main__":
    analyzer_tone = FinBERTSentimentAnalyzer()
    analyzer_prosus = ProsusFinBERTSentimentAnalyzer()
    analyzer_roberta = DistilRobertaFinancialSentimentAnalyzer()

    test_headlines = [
        # The headline that gave you a surprising result
        "Sanofi (SNY) Loses 9% as New Drug Candidate Appears Weaker Than Predecessor",

        # A clearly negative headline to test your model's baseline
        "Company stock plummets after massive earnings miss.",

        # A clearly positive headline
        "Company X's stock soars after a surprise new contract worth billions.",

        # A neutral, boilerplate headline
        "The company is holding an earnings call with analysts tomorrow.",
        
        # Another test for conflicting signals
        "Despite disappointing Q3 results, analysts are bullish on the company's new AI strategy."
    ]

    print("--- FinBERT-Tone vs ProsusAI/FinBERT vs DistilRoberta Financial Sentiment Analysis Results ---")
    for headline in test_headlines:
        print(f"\nHeadline: \"{headline}\"")
        result_tone = analyzer_tone.analyze(headline)
        result_prosus = analyzer_prosus.analyze(headline)
        result_roberta = analyzer_roberta.analyze(headline)
        print("FinBERT-Tone:")
        if "error" in result_tone:
            print(f"  Analysis Failed: {result_tone['error']}")
        else:
            print(f"  Predicted Sentiment: {result_tone['sentiment']}")
            print(f"  Scores: {result_tone['scores']}")
        print("ProsusAI/FinBERT:")
        if "error" in result_prosus:
            print(f"  Analysis Failed: {result_prosus['error']}")
        else:
            print(f"  Predicted Sentiment: {result_prosus['sentiment']}")
            print(f"  Scores: {result_prosus['scores']}")
        print("DistilRoberta-Financial:")
        if "error" in result_roberta:
            print(f"  Analysis Failed: {result_roberta['error']}")
        else:
            print(f"  Predicted Sentiment: {result_roberta['sentiment']}")
            print(f"  Scores: {result_roberta['scores']}")
