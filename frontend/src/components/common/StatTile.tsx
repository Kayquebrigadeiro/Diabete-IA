import { Box, Paper, Stack, Typography } from '@mui/material';
import { ReactNode } from 'react';

export function StatTile({ 
  label, 
  value, 
  hint, 
  icon, 
  color = 'primary' 
}: { 
  label: string; 
  value: string; 
  hint?: string; 
  icon?: ReactNode;
  color?: 'primary' | 'secondary' | 'success' | 'warning';
}) {
  const colorMap = {
    primary: { 
      bg: 'linear-gradient(135deg, rgba(249, 115, 22, 0.08), rgba(251, 146, 60, 0.12))', 
      border: 'rgba(249, 115, 22, 0.2)', 
      iconBg: 'linear-gradient(135deg, rgba(249, 115, 22, 0.15), rgba(251, 146, 60, 0.2))' 
    },
    secondary: { 
      bg: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(251, 191, 36, 0.12))', 
      border: 'rgba(245, 158, 11, 0.2)', 
      iconBg: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(251, 191, 36, 0.2))' 
    },
    success: { 
      bg: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(52, 211, 153, 0.12))', 
      border: 'rgba(16, 185, 129, 0.2)', 
      iconBg: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(52, 211, 153, 0.2))' 
    },
    warning: { 
      bg: 'linear-gradient(135deg, rgba(234, 88, 12, 0.08), rgba(249, 115, 22, 0.12))', 
      border: 'rgba(234, 88, 12, 0.2)', 
      iconBg: 'linear-gradient(135deg, rgba(234, 88, 12, 0.15), rgba(249, 115, 22, 0.2))' 
    },
  };

  const colors = colorMap[color];

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        height: '100%',
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme => theme.palette.mode === 'dark'
            ? '0 8px 24px rgba(0, 0, 0, 0.4)'
            : '0 8px 24px rgba(249, 115, 22, 0.15)',
        },
      }}
    >
      <Stack spacing={2} height="100%">
        {icon && (
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: colors.iconBg,
              color: `${color}.main`,
            }}
          >
            {icon}
          </Box>
        )}
        
        <Box flex={1}>
          <Typography 
            variant="overline" 
            sx={{ 
              fontWeight: 800, 
              letterSpacing: 1.2,
              color: 'text.secondary',
              display: 'block',
              mb: 0.5
            }}
          >
            {label}
          </Typography>
          <Typography 
            variant="h4" 
            fontWeight={900} 
            sx={{ 
              letterSpacing: '-0.02em',
              color: 'text.primary',
              wordBreak: 'break-word'
            }}
          >
            {value}
          </Typography>
        </Box>

        {hint && (
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'text.secondary',
              fontSize: '0.875rem',
              lineHeight: 1.5
            }}
          >
            {hint}
          </Typography>
        )}
      </Stack>
    </Paper>
  );
}
