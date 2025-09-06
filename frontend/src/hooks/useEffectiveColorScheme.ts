import { useColorScheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';

/**
 * Custom hook to get the effective color scheme (light/dark) based on MUI mode and system preference.
 * Returns 'light' or 'dark'.
 */
export function useEffectiveColorScheme(): 'light' | 'dark' {
  const { mode } = useColorScheme();
  const [effectiveMode, setEffectiveMode] = useState<'light' | 'dark'>(
    mode === 'dark' ? 'dark' : 'light'
  );

  useEffect(() => {
    if (mode !== 'light' && mode !== 'dark') {
      const matchMedia = window.matchMedia('(prefers-color-scheme: dark)');
      const getSystemMode = () => (matchMedia.matches ? 'dark' : 'light');
      setEffectiveMode(getSystemMode());
      const handleChange = (e: any) => {
        setEffectiveMode(e.matches ? 'dark' : 'light');
      };
      matchMedia.addEventListener('change', handleChange);
      return () => matchMedia.removeEventListener('change', handleChange);
    } else {
      setEffectiveMode(mode);
    }
  }, [mode]);

  return effectiveMode;
}
