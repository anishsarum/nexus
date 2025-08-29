import React, { useState } from 'react';
import { Box, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import WatchlistSidebar from './WatchlistSidebar';

interface SidebarLayoutProps {
  children: ReactNode;
  token: string;
  onSelectTicker: (symbol: string) => void;
  refreshKey: number;
}

const SidebarLayout: React.FC<SidebarLayoutProps> = ({
  children,
  token,
  onSelectTicker,
  refreshKey,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {sidebarOpen && (
        <Box
          sx={{
            minWidth: 220,
            height: '100vh',
            borderRight: '1px solid #eee',
            bgcolor: '#fafafa',
            overflow: 'auto',
          }}
        >
          <WatchlistSidebar token={token} refreshKey={refreshKey} onSelectTicker={onSelectTicker} />
        </Box>
      )}
      <Box
        sx={{
          flex: 1,
          position: 'relative',
          height: '100vh',
          overflow: 'auto',
        }}
      >
        <IconButton
          onClick={() => setSidebarOpen((open) => !open)}
          sx={{ position: 'absolute', top: 16, left: 16, zIndex: 10 }}
          aria-label={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
        >
          <MenuIcon />
        </IconButton>
        <Box sx={{ ml: sidebarOpen ? 0 : 0, mt: 2 }}>{children}</Box>
      </Box>
    </Box>
  );
};

export default SidebarLayout;
import type { ReactNode } from 'react';
