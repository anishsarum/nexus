import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import logging
import numpy as np


class FinBERTSentimentAnalyzer:
    def __init__(
        self,
        model_name="mrm8488/distilroberta-finetuned-financial-news-sentiment-analysis",
    ):
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
                scores = {label: float(prob) for label, prob in zip(self.labels, probs)}
                return {"sentiment": sentiment, "scores": scores}
        except Exception as e:
            logging.error(f"FinBERT analysis error: {e}")
            return {"error": str(e)}
