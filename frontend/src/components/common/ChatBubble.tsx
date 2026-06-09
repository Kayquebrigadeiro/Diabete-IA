import { Paper, Typography } from '@mui/material';

export function ChatBubble({ role, text }: { role: 'user' | 'assistant'; text: string }) {
  const isUser = role === 'user';
  return (
    <Paper
      sx={{
        p: 2,
        maxWidth: '85%',
        alignSelf: isUser ? 'flex-end' : 'flex-start',
        bgcolor: isUser ? 'primary.main' : 'background.paper',
        color: isUser ? 'primary.contrastText' : 'text.primary',
      }}
    >
      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
        {text}
      </Typography>
    </Paper>
  );
}

