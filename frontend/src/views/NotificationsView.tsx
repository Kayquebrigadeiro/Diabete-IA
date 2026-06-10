import { Alert, Card, CardContent, Stack, Typography } from '@mui/material';
import { format } from 'date-fns';
import { AppShell } from '../components/layout/AppShell';
import { SectionHeader } from '../components/common/SectionHeader';
import { useActiveChild } from '../hooks/useActiveChild';
import { useNotifications } from '../hooks/useNotifications';

export default function NotificationsView() {
  const { activeChild } = useActiveChild();
  const childLabel = activeChild?.name ?? 'criança ativa';
  const notificationsQuery = useNotifications();
  const notifications = (notificationsQuery.data ?? []).filter(
    (notification) => !activeChild || !notification.child_id || notification.child_id === activeChild.id,
  );

  return (
    <AppShell title="Notificações">
      <Stack spacing={2}>
        <SectionHeader title={`Alertas de ${childLabel}`} subtitle="Medicamentos, consultas e glicemia do perfil selecionado" eyebrow="Alertas" />
        {!activeChild ? <Alert severity="info">Cadastre uma criança para ver alertas.</Alert> : null}
        {notificationsQuery.isLoading ? (
          <Typography variant="body2" color="text.secondary">
            Carregando alertas da criança ativa...
          </Typography>
        ) : notifications.length ? (
          <Stack spacing={2}>
            {notifications.map((notification) => (
              <Card key={notification.id}>
                <CardContent>
                  <Stack spacing={0.5}>
                    <Typography fontWeight={800}>{notification.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {notification.message}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {format(new Date(notification.scheduled_at), 'dd/MM/yyyy HH:mm')} • {notification.status}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        ) : (
          <Alert severity="info" variant="outlined">
            Nenhuma notificação registrada. Os alertas de medicamentos, consultas e lembretes da rotina aparecerão aqui.
          </Alert>
        )}
      </Stack>
    </AppShell>
  );
}
