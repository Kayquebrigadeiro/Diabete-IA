import { createTheme } from '@mui/material/styles';

const toHsl = (h: number, s: number, l: number) => `hsl(${h} ${s}% ${l}%)`;

export const appTheme = createTheme({
  palette: {
    primary: {
      main: toHsl(210, 85, 55),
      light: toHsl(210, 85, 65),
      dark: toHsl(210, 85, 45),
    },
    secondary: {
      main: toHsl(150, 70, 45),
      light: toHsl(150, 70, 55),
      dark: toHsl(150, 70, 35),
    },
    error: {
      main: toHsl(0, 80, 60),
    },
    warning: {
      main: toHsl(40, 95, 60),
    },
    background: {
      default: 'transparent',
      paper: 'rgba(255,255,255,0.85)',
    },
    text: {
      primary: 'hsl(220 40% 12%)',
      secondary: 'hsl(220 15% 40%)',
    },
  },
  typography: {
    fontFamily: ['Outfit', 'Inter', 'system-ui', 'sans-serif'].join(','),
    h1: { fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.02em' },
    h2: { fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.01em' },
    h3: { fontSize: '1.25rem', fontWeight: 700 },
    h4: { fontSize: '1.125rem', fontWeight: 600 },
    body1: { fontSize: '1rem', letterSpacing: '0.01em' },
    body2: { fontSize: '0.875rem' },
  },
  shape: {
    borderRadius: 20,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          textTransform: 'none',
          fontWeight: 600,
          minHeight: 48,
          boxShadow: 'none',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          background: 'rgba(255,255,255,0.7)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.5)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.04)',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 12px 48px rgba(0,0,0,0.08)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(255,255,255,0.5)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.3)',
        },
      },
    },
  },
});

