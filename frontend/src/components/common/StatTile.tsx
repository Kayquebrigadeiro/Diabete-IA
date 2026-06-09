import { Box, Paper, Typography } from '@mui/material';

export function StatTile({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <Paper
      sx={{
        p: 2.25,
        borderRadius: 4,
        minHeight: 140,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.97), rgba(245,248,255,0.86))',
        border: '1px solid rgba(15,23,42,0.07)',
        boxShadow: '0 16px 40px rgba(15,23,42,0.05)',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: '0 0 auto 0',
          height: 4,
          background: 'linear-gradient(90deg, rgba(37,99,235,0.85), rgba(16,185,129,0.55))',
        },
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700, letterSpacing: 0.2 }}>
          {label}
        </Typography>
        <Typography variant="h4" fontWeight={800} sx={{ mt: 0.75, letterSpacing: '-0.03em' }}>
          {value}
        </Typography>
      </Box>
      {hint ? (
        <Box sx={{ mt: 1.25, position: 'relative', zIndex: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.8rem', lineHeight: 1.6 }}>
            {hint}
          </Typography>
        </Box>
      ) : null}
    </Paper>
  );
}
