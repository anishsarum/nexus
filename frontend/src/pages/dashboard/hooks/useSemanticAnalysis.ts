import { useEffect, useState } from 'react';


interface NewsItem {
  headline: string;
  datetime: number;
  source: string;
  url: string;
  finbert_sentiment: {
    sentiment: string;
    scores: {
      negative: number;
      neutral: number;
      positive: number;
    };
  };
}

interface OverallSentiment {
  label: string;
  scores: {
    negative: number;
    neutral: number;
    positive: number;
  };
}

interface SemanticAnalysisResult {
  recent_news: NewsItem[];
  overall_sentiment: OverallSentiment | null;
  error?: string | null;
}


const useSemanticAnalysis = (
  symbol: string,
  recentCount: number = 5,
  overallCount: number = 20
) => {
  const [result, setResult] = useState<SemanticAnalysisResult>({ recent_news: [], overall_sentiment: null });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!symbol) return;
    setLoading(true);
    setResult({ recent_news: [], overall_sentiment: null });
    fetch(`/pyapi/api/semantic-analysis?symbol=${encodeURIComponent(symbol)}&recent_count=${recentCount}&overall_count=${overallCount}`)
      .then((res) => res.json())
      .then((data) => {
        setResult({
          recent_news: data.recent_news ?? [],
          overall_sentiment: data.overall_sentiment ?? null,
          error: data.error ?? null,
        });
      })
      .catch((err) => {
        setResult({ recent_news: [], overall_sentiment: null, error: err.message });
      })
      .finally(() => setLoading(false));
  }, [symbol, recentCount, overallCount]);

  return { ...result, loading };
};

export default useSemanticAnalysis;
