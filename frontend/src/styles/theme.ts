import { createTheme } from '@mui/material/styles';

const toHsl = (h: number, s: number, l: number) => `hsl(${h} ${s}% ${l}%)`;

export const appTheme = createTheme({
  palette: {
    primary: {
      main: toHsl(210, 80, 50),
      light: toHsl(210, 80, 60),
      dark: toHsl(210, 80, 38),
    },
    secondary: {
      main: toHsl(150, 60, 45),
      light: toHsl(150, 60, 56),
      dark: toHsl(150, 60, 34),
    },
    error: {
      main: toHsl(0, 75, 55),
    },
    warning: {
      main: toHsl(40, 90, 55),
    },
    background: {
      default: 'hsl(210 20% 98%)',
      paper: 'rgba(255,255,255,0.78)',
    },
    text: {
      primary: 'hsl(220 35% 13%)',
      secondary: 'hsl(220 12% 42%)',
    },
  },
  typography: {
    fontFamily: ['Inter', 'Roboto', 'system-ui', 'sans-serif'].join(','),
    h1: { fontSize: '2rem', fontWeight: 800 },
    h2: { fontSize: '1.5rem', fontWeight: 800 },
    h3: { fontSize: '1.25rem', fontWeight: 700 },
    body1: { fontSize: '1rem' },
    body2: { fontSize: '0.875rem' },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          textTransform: 'none',
          minHeight: 44,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          background: 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(14px)',
          border: '1px solid rgba(15,23,42,0.08)',
        },
      },
    },
  },
});

