import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import logging
import numpy as np

class FinBERTSentimentAnalyzer:
    def __init__(self, model_name="yiyanghkust/finbert-tone"):
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModelForSequenceClassification.from_pretrained(model_name)
        self.labels = ["negative", "neutral", "positive"]

    def analyze(self, text):
        try:
            inputs = self.tokenizer(text, return_tensors="pt", truncation=True)
            with torch.no_grad():
                outputs = self.model(**inputs)
                logits = outputs.logits.detach().cpu().numpy()[0]
                sentiment_idx = int(np.argmax(logits))
                sentiment = self.labels[sentiment_idx]
                scores = {label: float(logit) for label, logit in zip(self.labels, logits)}
                return {"sentiment": sentiment, "scores": scores}
        except Exception as e:
            logging.error(f"FinBERT analysis error: {e}")
            return {"error": str(e)}
