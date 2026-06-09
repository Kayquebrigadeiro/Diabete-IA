import { Box, Typography } from '@mui/material';

export function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="h5" fontWeight={800}>
        {title}
      </Typography>
      {subtitle ? (
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      ) : null}
    </Box>
  );
}

