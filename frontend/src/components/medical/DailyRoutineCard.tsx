import { Box, Button, Chip, CircularProgress, Stack, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { useDailyRoutine } from '../../hooks/useDailyRoutine';

export function DailyRoutineCard({ childId }: { childId: string }) {
  const { tasks, loading, markAsTaken } = useDailyRoutine(childId);

  const completed = tasks.filter((t) => t.status === 'completed').length;

  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h6" fontWeight={800}>
          📅 Rotina de Hoje
        </Typography>
        {tasks.length > 0 && (
          <Chip
            label={`${completed}/${tasks.length} concluídos`}
            size="small"
            color={completed === tasks.length ? 'success' : 'default'}
            sx={{ fontWeight: 700 }}
          />
        )}
      </Stack>

      {loading && (
        <Stack alignItems="center" py={3}>
          <CircularProgress size={28} />
        </Stack>
      )}

      {!loading && tasks.length === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
          Nenhum medicamento agendado para hoje.
        </Typography>
      )}

      {!loading && tasks.length > 0 && (
        <Box sx={{ position: 'relative' }}>
          <Box
            sx={{
              position: 'absolute',
              left: 13,
              top: 14,
              bottom: 14,
              width: 2,
              bgcolor: 'divider',
              zIndex: 0,
            }}
          />
          <Stack spacing={1.5}>
            {tasks.map((task) => (
              <Stack key={task.schedule_id} direction="row" spacing={1.5} alignItems="center">
                <Box sx={{ zIndex: 1, color: task.status === 'completed' ? 'success.main' : 'text.disabled' }}>
                  {task.status === 'completed' ? (
                    <CheckCircleIcon fontSize="small" />
                  ) : (
                    <RadioButtonUncheckedIcon fontSize="small" />
                  )}
                </Box>

                <Box
                  sx={{
                    flex: 1,
                    p: 1.5,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: task.status === 'completed' ? 'success.light' : 'divider',
                    bgcolor: task.status === 'completed' ? 'success.50' : 'background.paper',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 1,
                  }}
                >
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center">
                      {task.time && (
                        <Typography variant="caption" fontWeight={800} color="primary">
                          {task.time}
                        </Typography>
                      )}
                      <Typography variant="body2" fontWeight={700}>
                        {task.name}
                      </Typography>
                    </Stack>
                    <Typography variant="caption" color="text.secondary">
                      {task.dosage}U •{' '}
                      <Box component="span" sx={{ textTransform: 'uppercase', fontSize: 10, fontWeight: 700 }}>
                        {task.type}
                      </Box>
                    </Typography>
                  </Box>

                  {task.status === 'completed' ? (
                    <Chip label="Aplicado" size="small" color="success" sx={{ fontWeight: 700 }} />
                  ) : (
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => markAsTaken(task)}
                      sx={{ whiteSpace: 'nowrap', minWidth: 90 }}
                    >
                      Dar Dose
                    </Button>
                  )}
                </Box>
              </Stack>
            ))}
          </Stack>
        </Box>
      )}
    </Stack>
  );
}
