import { Card, CardContent, type CardProps } from '@mui/material';

export function GlassCard({ children, sx, ...props }: CardProps) {
  const sxEntries = Array.isArray(sx) ? sx : sx ? [sx] : [];

  return (
    <Card
      elevation={0}
      {...props}
      sx={[
        {
          position: 'relative',
          overflow: 'hidden',
          height: '100%',
          background: 'rgba(255,255,255,0.74)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.56)',
          boxShadow: '0 22px 60px rgba(15,23,42,0.08)',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(16,185,129,0.05) 48%, rgba(255,255,255,0) 80%)',
            pointerEvents: 'none',
          },
        },
        ...sxEntries,
      ]}
    >
      <CardContent sx={{ position: 'relative', zIndex: 1, p: 0, '&:last-child': { pb: 0 } }}>{children}</CardContent>
    </Card>
  );
}
