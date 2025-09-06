import React from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, CircularProgress } from '@mui/material';

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

interface NewsCardProps {
  news: NewsItem[];
  loading?: boolean;
  error?: string | null;
}

const NewsCard: React.FC<NewsCardProps> = ({ news, loading, error }) => {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Recent News & Sentiment
        </Typography>
        {loading && <CircularProgress size={24} />}
        {error && <Typography color="error">{error}</Typography>}
        <List>
          {news && news.length > 0 ? (
            news.map((item, idx) => (
              <ListItem key={idx} alignItems="flex-start" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <ListItemText
                  primary={<a href={item.url} target="_blank" rel="noopener noreferrer">{item.headline}</a>}
                  secondary={`${item.source} | ${new Date(item.datetime * 1000).toLocaleDateString()}`}
                />
                <Typography variant="body2" sx={{ ml: 2 }} color={
                  item.finbert_sentiment.sentiment === 'positive' ? 'success.main' :
                  item.finbert_sentiment.sentiment === 'negative' ? 'error.main' : 'text.secondary'
                }>
                  {item.finbert_sentiment.sentiment.charAt(0).toUpperCase() + item.finbert_sentiment.sentiment.slice(1)}
                </Typography>
              </ListItem>
            ))
          ) : (
            <Typography>No news available.</Typography>
          )}
        </List>
      </CardContent>
    </Card>
  );
};

export default NewsCard;
