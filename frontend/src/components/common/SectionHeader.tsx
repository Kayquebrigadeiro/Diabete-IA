import { Box, Chip, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';

export function SectionHeader({
  title,
  subtitle,
  eyebrow,
  action,
}: {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  action?: ReactNode;
}) {
  return (
    <Box sx={{ mb: 2.5 }}>
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" gap={2}>
        <Box>
          {eyebrow ? (
            <Chip
              label={eyebrow}
              size="small"
              sx={{
                mb: 1,
                borderRadius: 999,
                fontWeight: 800,
                letterSpacing: 1,
                background: 'rgba(37,99,235,0.08)',
                color: 'primary.dark',
              }}
            />
          ) : null}
          <Typography variant="h5" fontWeight={800} sx={{ letterSpacing: '-0.03em' }}>
            {title}
          </Typography>
          {subtitle ? (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, maxWidth: 760 }}>
              {subtitle}
            </Typography>
          ) : null}
        </Box>
        {action ? <Box sx={{ flexShrink: 0 }}>{action}</Box> : null}
      </Stack>
    </Box>
  );
}
