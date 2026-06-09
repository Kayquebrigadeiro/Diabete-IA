import { Box, Paper, Typography } from '@mui/material';

export function StatTile({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <Paper
      sx={{
        p: 2,
        borderRadius: 4,
        background: 'linear-gradient(180deg, rgba(255,255,255,0.95), rgba(245,248,255,0.85))',
        border: '1px solid rgba(15,23,42,0.08)',
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="h4" fontWeight={800} sx={{ mt: 0.5 }}>
        {value}
      </Typography>
      {hint ? (
        <Box sx={{ mt: 0.5 }}>
          <Typography variant="caption" color="text.secondary">
            {hint}
          </Typography>
        </Box>
      ) : null}
    </Paper>
  );
}

