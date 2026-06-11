import { useState } from 'react';
import { Alert, Box, Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, Grid, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MedicationIcon from '@mui/icons-material/Medication';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AppShell } from '../components/layout/AppShell';
import { SectionHeader } from '../components/common/SectionHeader';
import { MedicationCard } from '../components/medical/MedicationCard';
import { useActiveChild } from '../hooks/useActiveChild';
import { useMedications } from '../hooks/useMedications';
import { medicalApi } from '../services/medical';

export default function MedicationsView() {
  const queryClient = useQueryClient();
  const { activeChild } = useActiveChild();
  const childLabel = activeChild?.name ?? 'criança ativa';
  const medicationsQuery = useMedications();
  const [open, setOpen] = useState(false);
  
  const [name, setName] = useState('');
  const [type, setType] = useState('INSULINA_BASAL');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [notes, setNotes] = useState('');

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!activeChild) throw new Error('Selecione uma criança');
      return medicalApi.medications.create({
        child_id: activeChild.id,
        name,
        medication_type: type,
        dosage,
        frequency,
        scheduled_time: scheduledTime || undefined,
        notes: notes || undefined,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications'] });
      toast.success('Medicamento adicionado com sucesso!');
      setOpen(false);
      setName('');
      setDosage('');
      setFrequency('');
      setScheduledTime('');
      setNotes('');
    },
    onError: () => {
      toast.error('Erro ao adicionar medicamento');
    },
  });

  const handleSubmit = () => {
    if (!name || !dosage || !frequency) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }
    createMutation.mutate();
  };

  return (
    <AppShell title="Medicamentos">
      <Stack spacing={3}>
        <SectionHeader
          title={`Medicamentos de ${childLabel}`}
          subtitle="Catálogo usado para montar a terapia e apoiar o cuidado diário"
          eyebrow="Terapia"
          action={
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpen(true)}
              disabled={!activeChild}
              size="large"
            >
              Adicionar Medicamento
            </Button>
          }
        />

        {!activeChild && (
          <Alert severity="info" icon={<LocalHospitalIcon />}>
            <Typography fontWeight={700}>Nenhuma criança selecionada</Typography>
            <Typography variant="body2">Cadastre ou selecione uma criança no topo da tela para começar a organizar medicamentos.</Typography>
          </Alert>
        )}

        {activeChild && medicationsQuery.isLoading && (
          <Card>
            <CardContent>
              <Typography color="text.secondary">Carregando lista de medicamentos...</Typography>
            </CardContent>
          </Card>
        )}

        {activeChild && !medicationsQuery.isLoading && medicationsQuery.data?.length === 0 && (
          <Card>
            <CardContent>
              <Stack spacing={2} alignItems="center" py={4}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0.2,
                  }}
                >
                  <MedicationIcon sx={{ fontSize: 40 }} />
                </Box>
                <Typography variant="h6" fontWeight={800}>Nenhum medicamento cadastrado</Typography>
                <Typography variant="body2" color="text.secondary" textAlign="center" maxWidth={500}>
                  Clique no botão "Adicionar Medicamento" acima para cadastrar insulinas, horários e doses. Isso ajuda a acompanhar a rotina completa da criança.
                </Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)} size="large">
                  Cadastrar Primeiro Medicamento
                </Button>
              </Stack>
            </CardContent>
          </Card>
        )}

        {medicationsQuery.data && medicationsQuery.data.length > 0 && (
          <Grid container spacing={2}>
            {medicationsQuery.data.map((item) => (
              <Grid item xs={12} md={6} key={item.id}>
                <MedicationCard item={item} />
              </Grid>
            ))}
          </Grid>
        )}

        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <MedicationIcon color="primary" />
              <Box>
                <Typography variant="h6" fontWeight={800}>Adicionar Novo Medicamento</Typography>
                <Typography variant="body2" color="text.secondary">
                  Preencha as informações do medicamento para {childLabel}
                </Typography>
              </Box>
            </Stack>
          </DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ pt: 2 }}>
              <Alert severity="info" variant="outlined">
                <Typography variant="body2" fontWeight={700}>Dica: Seja específico</Typography>
                <Typography variant="body2">
                  Inclua o nome comercial da insulina (ex: Lantus, NovoRapid), a dosagem exata e os horários. Isso facilita o acompanhamento.
                </Typography>
              </Alert>

              <Divider />

              <TextField
                label="Nome do Medicamento"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Lantus, NovoRapid, Humalog"
                required
                helperText="Digite o nome comercial ou genérico da insulina"
              />

              <FormControl fullWidth required>
                <InputLabel>Tipo de Medicamento</InputLabel>
                <Select value={type} onChange={(e) => setType(e.target.value)} label="Tipo de Medicamento">
                  <MenuItem value="INSULINA_BASAL">Insulina Basal (ação lenta)</MenuItem>
                  <MenuItem value="INSULINA_BOLUS">Insulina Bolus (ação rápida)</MenuItem>
                  <MenuItem value="OUTRO_MEDICAMENTO">Outro Medicamento</MenuItem>
                </Select>
              </FormControl>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Dosagem"
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    placeholder="Ex: 10 UI, 5 UI"
                    required
                    helperText="Quantidade por aplicação"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Frequência"
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    placeholder="Ex: 1x ao dia, 3x ao dia"
                    required
                    helperText="Quantas vezes por dia"
                  />
                </Grid>
              </Grid>

              <TextField
                label="Horário Principal (opcional)"
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                InputLabelProps={{ shrink: true }}
                helperText="Horário de referência para aplicação"
                InputProps={{
                  startAdornment: <AccessTimeIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />

              <TextField
                label="Observações (opcional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                multiline
                rows={3}
                placeholder="Ex: Aplicar no abdomen, rotar local de aplicação"
                helperText="Instruções adicionais ou lembretes"
              />

              <Box sx={{ p: 2, bgcolor: 'success.main', color: 'white', borderRadius: 2, opacity: 0.9 }}>
                <Typography variant="body2" fontWeight={700}>✓ Resumo</Typography>
                <Typography variant="body2">
                  {name || '[Nome]'} • {dosage || '[Dose]'} • {frequency || '[Frequência]'}
                  {scheduledTime && ` • Às ${scheduledTime}`}
                </Typography>
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button onClick={() => setOpen(false)} color="inherit" disabled={createMutation.isPending}>
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={createMutation.isPending || !name || !dosage || !frequency}
              size="large"
            >
              {createMutation.isPending ? 'Salvando...' : 'Salvar Medicamento'}
            </Button>
          </DialogActions>
        </Dialog>
      </Stack>
    </AppShell>
  );
}
