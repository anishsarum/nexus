import React from 'react';
import { TextField } from '@mui/material';

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}) => {
  return (
    <>
      <TextField
        label="Start Date"
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        size="small"
        sx={{ pt: 1 }}
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label="End Date"
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        size="small"
        sx={{ pt: 1 }}
        InputLabelProps={{ shrink: true }}
      />
    </>
  );
};

export default DateRangePicker;
