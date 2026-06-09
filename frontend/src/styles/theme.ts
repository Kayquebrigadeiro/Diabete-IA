import { createTheme } from '@mui/material/styles';

const toHsl = (h: number, s: number, l: number) => `hsl(${h} ${s}% ${l}%)`;

export const appTheme = createTheme({
  palette: {
    primary: {
      main: toHsl(209, 92, 48),
      light: toHsl(209, 95, 60),
      dark: toHsl(212, 88, 38),
    },
    secondary: {
      main: toHsl(160, 74, 38),
      light: toHsl(160, 72, 50),
      dark: toHsl(160, 78, 28),
    },
    error: {
      main: toHsl(0, 80, 60),
    },
    warning: {
      main: toHsl(40, 95, 60),
    },
    background: {
      default: 'hsl(214 45% 96%)',
      paper: 'rgba(255,255,255,0.84)',
    },
    text: {
      primary: 'hsl(222 39% 12%)',
      secondary: 'hsl(220 13% 42%)',
    },
  },
  typography: {
    fontFamily: ['Inter', 'Outfit', 'system-ui', 'sans-serif'].join(','),
    h1: { fontSize: 'clamp(2.4rem, 4vw, 3.6rem)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.02 },
    h2: { fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.08 },
    h3: { fontSize: 'clamp(1.35rem, 2vw, 1.85rem)', fontWeight: 750, letterSpacing: '-0.02em', lineHeight: 1.14 },
    h4: { fontSize: '1.125rem', fontWeight: 700, letterSpacing: '-0.01em' },
    h5: { fontSize: '1rem', fontWeight: 700 },
    body1: { fontSize: '1rem', letterSpacing: '0.01em' },
    body2: { fontSize: '0.92rem', lineHeight: 1.65 },
    overline: { fontSize: '0.72rem', fontWeight: 800 },
  },
  shape: {
    borderRadius: 24,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background:
            'radial-gradient(circle at top left, rgba(59, 130, 246, 0.12), transparent 32%), radial-gradient(circle at bottom right, rgba(16, 185, 129, 0.12), transparent 30%), linear-gradient(180deg, hsl(214 45% 97%), hsl(214 45% 95%))',
          backgroundAttachment: 'fixed',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          textTransform: 'none',
          fontWeight: 700,
          minHeight: 48,
          boxShadow: 'none',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease',
          '&:hover': {
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        fullWidth: true,
        variant: 'outlined',
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          background: 'rgba(255,255,255,0.7)',
          transition: 'box-shadow 0.2s ease, border-color 0.2s ease, transform 0.2s ease',
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(37,99,235,0.35)',
          },
          '&.Mui-focused': {
            boxShadow: '0 0 0 4px rgba(37,99,235,0.08)',
          },
        },
        notchedOutline: {
          borderColor: 'rgba(15,23,42,0.12)',
        },
        input: {
          paddingTop: 16,
          paddingBottom: 16,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 28,
          background: 'rgba(255,255,255,0.76)',
          backdropFilter: 'blur(22px)',
          border: '1px solid rgba(255,255,255,0.72)',
          boxShadow: '0 20px 55px rgba(15,23,42,0.08)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            boxShadow: '0 26px 70px rgba(15,23,42,0.1)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(255,255,255,0.62)',
          backdropFilter: 'blur(22px)',
          borderBottom: '1px solid rgba(255,255,255,0.55)',
          boxShadow: 'none',
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          background: 'rgba(255,255,255,0.72)',
          backdropFilter: 'blur(20px)',
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          minWidth: 0,
          borderRadius: 18,
          margin: '8px 6px',
          '&.Mui-selected': {
            color: 'hsl(209 92% 42%)',
            background: 'rgba(37,99,235,0.08)',
          },
        },
        label: {
          fontSize: '0.72rem',
          fontWeight: 700,
        },
      },
    },
  },
});
