import React from 'react';
import { AppBar, Toolbar, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

interface TopBarProps {
  onLogout: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onLogout }) => (
  <AppBar position="fixed" color="default" elevation={1}>
    <Toolbar>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Trading Platform
      </Typography>
      <Button component={Link} to="/portfolio" color="primary" sx={{ mr: 2 }}>
        Portfolio
      </Button>
  <Button component={Link} to="/new-dashboard" color="primary" sx={{ mr: 2 }}>
        Dashboard
      </Button>
      <Button onClick={onLogout} color="secondary" variant="outlined">
        Logout
      </Button>
    </Toolbar>
  </AppBar>
);

export default TopBar;
