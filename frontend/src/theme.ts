import { createTheme } from '@mui/material/styles';
import type { ThemeOptions } from '@mui/material/styles';

const themeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: '#1976d2',
      contrastText: '#fff',
    },
    secondary: {
      main: '#1565c0',
      contrastText: '#fff',
    },
    background: {
      default: '#f8f8ff',
      paper: '#fff',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h4: {
      fontWeight: 700,
      letterSpacing: '0.02em',
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 12px rgba(25, 118, 210, 0.08)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
};

const theme = createTheme(themeOptions);

export default theme;
