import { createTheme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';

export const createAppTheme = (mode: 'light' | 'dark') => {
  const isDark = mode === 'dark';
  
  // Paleta profissional laranja/âmbar
  const colors = {
    orange: {
      50: '#fff7ed',
      100: '#ffedd5',
      200: '#fed7aa',
      300: '#fdba74',
      400: '#fb923c',
      500: '#f97316',
      600: '#ea580c',
      700: '#c2410c',
      800: '#9a3412',
      900: '#7c2d12',
    },
    amber: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
    },
    neutral: isDark ? {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      850: '#1a1a1a',
      900: '#171717',
      950: '#0a0a0a',
    } : {
      50: '#fafaf9',
      100: '#f5f5f4',
      200: '#e7e5e4',
      300: '#d6d3d1',
      400: '#a8a29e',
      500: '#78716c',
      600: '#57534e',
      700: '#44403c',
      800: '#292524',
      900: '#1c1917',
      950: '#0c0a09',
    },
  };

  return createTheme({
    palette: {
      mode,
      primary: {
        main: colors.orange[500],
        light: colors.orange[400],
        dark: colors.orange[600],
        contrastText: '#ffffff',
      },
      secondary: {
        main: colors.amber[500],
        light: colors.amber[400],
        dark: colors.amber[600],
        contrastText: '#ffffff',
      },
      error: {
        main: '#ef4444',
        light: '#f87171',
        dark: '#dc2626',
      },
      warning: {
        main: '#f59e0b',
        light: '#fbbf24',
        dark: '#d97706',
      },
      success: {
        main: '#10b981',
        light: '#34d399',
        dark: '#059669',
      },
      background: {
        default: isDark ? colors.neutral[950] : colors.neutral[50],
        paper: isDark ? colors.neutral[900] : '#ffffff',
      },
      text: {
        primary: isDark ? colors.neutral[50] : colors.neutral[900],
        secondary: isDark ? colors.neutral[400] : colors.neutral[600],
      },
      divider: isDark ? alpha(colors.neutral[50], 0.08) : alpha(colors.neutral[900], 0.08),
    },
    typography: {
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
      h1: { 
        fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
        fontWeight: 700, 
        letterSpacing: '-0.025em', 
        lineHeight: 1.1,
      },
      h2: { 
        fontSize: 'clamp(2rem, 4vw, 3rem)', 
        fontWeight: 700, 
        letterSpacing: '-0.025em', 
        lineHeight: 1.2,
      },
      h3: { 
        fontSize: 'clamp(1.5rem, 3vw, 2rem)', 
        fontWeight: 600, 
        letterSpacing: '-0.02em', 
        lineHeight: 1.3,
      },
      h4: { 
        fontSize: '1.5rem', 
        fontWeight: 600, 
        letterSpacing: '-0.01em',
        lineHeight: 1.4,
      },
      h5: { 
        fontSize: '1.25rem', 
        fontWeight: 600,
        lineHeight: 1.5,
      },
      h6: { 
        fontSize: '1.125rem', 
        fontWeight: 600,
        lineHeight: 1.5,
      },
      body1: { 
        fontSize: '1rem', 
        lineHeight: 1.75,
      },
      body2: { 
        fontSize: '0.875rem', 
        lineHeight: 1.65,
      },
      button: {
        fontWeight: 600,
        letterSpacing: '0.02em',
      },
      overline: { 
        fontSize: '0.75rem', 
        fontWeight: 700,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
      },
    },
    shape: {
      borderRadius: 12,
    },
    shadows: [
      'none',
      isDark ? '0 1px 2px 0 rgba(0, 0, 0, 0.3)' : '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      isDark ? '0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px 0 rgba(0, 0, 0, 0.3)' : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      isDark ? '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      isDark ? '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)' : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      isDark ? '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.3)' : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      ...Array(19).fill(isDark ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' : '0 25px 50px -12px rgba(0, 0, 0, 0.25)'),
    ],
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            background: isDark
              ? `linear-gradient(180deg, ${colors.neutral[950]} 0%, ${colors.neutral[900]} 100%)`
              : `linear-gradient(180deg, ${colors.neutral[50]} 0%, ${colors.neutral[100]} 100%)`,
            backgroundAttachment: 'fixed',
          },
          '*': {
            scrollbarWidth: 'thin',
            scrollbarColor: isDark 
              ? `${colors.neutral[700]} ${colors.neutral[900]}`
              : `${colors.neutral[300]} ${colors.neutral[100]}`,
          },
          '*::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '*::-webkit-scrollbar-track': {
            background: isDark ? colors.neutral[900] : colors.neutral[100],
          },
          '*::-webkit-scrollbar-thumb': {
            background: isDark ? colors.neutral[700] : colors.neutral[300],
            borderRadius: '4px',
            '&:hover': {
              background: isDark ? colors.neutral[600] : colors.neutral[400],
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.9375rem',
            padding: '10px 20px',
            boxShadow: 'none',
            transition: 'all 0.15s ease',
            '&:hover': {
              boxShadow: 'none',
              transform: 'translateY(-1px)',
            },
            '&:active': {
              transform: 'translateY(0)',
            },
          },
          contained: {
            background: `linear-gradient(135deg, ${colors.orange[500]} 0%, ${colors.orange[600]} 100%)`,
            color: '#ffffff',
            '&:hover': {
              background: `linear-gradient(135deg, ${colors.orange[600]} 0%, ${colors.orange[700]} 100%)`,
              boxShadow: `0 8px 16px ${alpha(colors.orange[500], 0.3)}`,
            },
            '&.Mui-disabled': {
              background: isDark ? colors.neutral[800] : colors.neutral[200],
              color: isDark ? colors.neutral[600] : colors.neutral[400],
            },
          },
          outlined: {
            borderWidth: '1.5px',
            borderColor: isDark ? colors.neutral[700] : colors.neutral[300],
            '&:hover': {
              borderWidth: '1.5px',
              borderColor: colors.orange[500],
              background: alpha(colors.orange[500], 0.08),
            },
          },
          text: {
            '&:hover': {
              background: alpha(colors.orange[500], 0.08),
            },
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          fullWidth: true,
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            background: isDark 
              ? alpha(colors.neutral[800], 0.5)
              : '#ffffff',
            transition: 'all 0.2s ease',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: colors.orange[400],
            },
            '&.Mui-focused': {
              background: isDark 
                ? alpha(colors.neutral[800], 0.7)
                : '#ffffff',
              boxShadow: `0 0 0 3px ${alpha(colors.orange[500], 0.12)}`,
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: colors.orange[500],
                borderWidth: '2px',
              },
            },
          },
          notchedOutline: {
            borderColor: isDark 
              ? alpha(colors.neutral[50], 0.1)
              : alpha(colors.neutral[900], 0.12),
            transition: 'all 0.2s ease',
          },
          input: {
            padding: '12px 14px',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            background: isDark 
              ? colors.neutral[900]
              : '#ffffff',
            border: `1px solid ${isDark ? alpha(colors.neutral[50], 0.06) : alpha(colors.neutral[900], 0.08)}`,
            boxShadow: isDark
              ? '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)'
              : '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.04)',
            transition: 'all 0.2s ease',
            '&:hover': {
              boxShadow: isDark
                ? '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)'
                : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
          elevation0: {
            boxShadow: 'none',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: isDark 
              ? alpha(colors.neutral[900], 0.8)
              : alpha('#ffffff', 0.8),
            backdropFilter: 'blur(12px) saturate(180%)',
            borderBottom: `1px solid ${isDark ? alpha(colors.neutral[50], 0.06) : alpha(colors.neutral[900], 0.08)}`,
            boxShadow: 'none',
          },
        },
      },
      MuiBottomNavigation: {
        styleOverrides: {
          root: {
            background: isDark 
              ? alpha(colors.neutral[900], 0.9)
              : alpha('#ffffff', 0.9),
            backdropFilter: 'blur(12px) saturate(180%)',
            borderTop: `1px solid ${isDark ? alpha(colors.neutral[50], 0.06) : alpha(colors.neutral[900], 0.08)}`,
          },
        },
      },
      MuiBottomNavigationAction: {
        styleOverrides: {
          root: {
            minWidth: 0,
            borderRadius: 10,
            margin: '4px',
            transition: 'all 0.2s ease',
            color: isDark ? colors.neutral[400] : colors.neutral[600],
            '&.Mui-selected': {
              color: colors.orange[500],
              background: alpha(colors.orange[500], 0.12),
            },
            '&:hover': {
              background: alpha(colors.orange[500], 0.08),
            },
          },
          label: {
            fontSize: '0.6875rem',
            fontWeight: 600,
            marginTop: '4px',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 600,
            borderRadius: 8,
          },
          outlined: {
            borderWidth: '1.5px',
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
          standard: {
            border: `1px solid`,
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: isDark ? alpha(colors.neutral[50], 0.08) : alpha(colors.neutral[900], 0.08),
          },
        },
      },
    },
  });
};

export const appTheme = createAppTheme('light');
