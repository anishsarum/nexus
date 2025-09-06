import React from 'react';
import { Card, CardContent, Typography, Box, CircularProgress } from '@mui/material';

interface OverallSentiment {
  label: string;
  scores: {
    negative: number;
    neutral: number;
    positive: number;
  };
}

interface OverallSignalCardProps {
  overallSentiment: OverallSentiment | null;
  loading?: boolean;
  error?: string | null;
}

const OverallSignalCard: React.FC<OverallSignalCardProps> = ({
  overallSentiment,
  loading,
  error,
}) => {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Overall Sentiment Signal
        </Typography>
        {loading && <CircularProgress size={24} />}
        {error && <Typography color="error">{error}</Typography>}
        {overallSentiment ? (
          <Box>
            <Typography
              variant="h5"
              color={
                overallSentiment.label === 'positive'
                  ? 'success.main'
                  : overallSentiment.label === 'negative'
                    ? 'error.main'
                    : 'text.secondary'
              }
            >
              {overallSentiment.label.charAt(0).toUpperCase() + overallSentiment.label.slice(1)}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Scores: Negative: {overallSentiment.scores.negative.toFixed(2)}, Neutral:{' '}
              {overallSentiment.scores.neutral.toFixed(2)}, Positive:{' '}
              {overallSentiment.scores.positive.toFixed(2)}
            </Typography>
          </Box>
        ) : (
          <Typography>No overall sentiment available.</Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default OverallSignalCard;
