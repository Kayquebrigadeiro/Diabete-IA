import { Box, Card, CardContent, Typography } from '@mui/material';
import type { ChatCitation } from '../../types';

export function CitationCard({ citation }: { citation: ChatCitation }) {
  return (
    <Card variant="outlined" sx={{ mb: 1 }}>
      <CardContent>
        <Typography fontWeight={700} variant="body2">
          {citation.document} - Pedaço {citation.chunk_index}
        </Typography>
        {citation.excerpt ? (
          <Box sx={{ mt: 0.5 }}>
            <Typography variant="body2" color="text.secondary">
              {citation.excerpt}
            </Typography>
          </Box>
        ) : null}
      </CardContent>
    </Card>
  );
}

