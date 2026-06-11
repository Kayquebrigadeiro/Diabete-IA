import { useState } from 'react';
import { AppShell } from '../components/layout/AppShell';
import { Alert, Avatar, Box, Button, Card, CardContent, Chip, CircularProgress, Divider, InputAdornment, Paper, Stack, TextField, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import VerifiedIcon from '@mui/icons-material/Verified';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useActiveChild } from '../hooks/useActiveChild';
import { useAuthContext } from '../context/AuthContext';
import { useRAGChat } from '../hooks/useRAGChat';

export default function AssistantView() {
  const { activeChild } = useActiveChild();
  const { userId } = useAuthContext();
  const childLabel = activeChild?.name ?? 'criança ativa';
  const [question, setQuestion] = useState('');
  const { messages, loading, sendMessage } = useRAGChat(userId);

  const handleSend = async () => {
    const text = question.trim();
    if (!text || loading) return;
    setQuestion('');
    await sendMessage(text);
  };

  const suggestedQuestions = [
    '⚡ O que fazer se a glicemia estiver muito baixa?',
    '🍽️ Como calcular carboidratos nas refeições?',
    '📊 Qual a faixa ideal de glicemia para crianças?',
    '💉 Como aplicar insulina corretamente?',
  ];

  return (
    <AppShell title="Chat IA">
      <Stack spacing={3}>
        <Card
          elevation={0}
          sx={{
            background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.12), rgba(245, 158, 11, 0.08))',
            border: theme => theme.palette.mode === 'dark'
              ? '1px solid rgba(251, 146, 60, 0.2)'
              : '1px solid rgba(251, 146, 60, 0.25)',
          }}
        >
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="flex-start">
              <Avatar
                sx={{
                  bgcolor: 'primary.main',
                  width: 56,
                  height: 56,
                  boxShadow: '0 8px 16px rgba(251, 146, 60, 0.3)'
                }}
              >
                <SmartToyIcon fontSize="large" />
              </Avatar>
              <Box flex={1}>
                <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
                  <Typography variant="h5" fontWeight={900}>
                    Assistente IA Auri para Diabetes Tipo 1
                  </Typography>
                  <Chip
                    icon={<VerifiedIcon />}
                    label="Verificado"
                    size="small"
                    color="primary"
                    sx={{ fontWeight: 700 }}
                  />
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                  Especializado em diabetes pediátrica, baseado em protocolos ISPAD, Ministério da Saúde e guias reconhecidos.
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  <Chip icon={<AutoAwesomeIcon />} label="IA Treinada" size="small" variant="outlined" />
                  <Chip icon={<MenuBookIcon />} label="Fontes Científicas" size="small" variant="outlined" />
                  <Chip label="Confiança Medida" size="small" variant="outlined" />
                </Stack>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        <Alert
          severity="warning"
          icon={<WarningAmberIcon />}
          sx={{ borderRadius: 3 }}
        >
          <Typography variant="body2" fontWeight={700}>Importante: Este assistente não substitui consulta médica</Typography>
          <Typography variant="body2">
            Use para tirar dúvidas gerais sobre o manejo diário. Em emergências, contate seu médico ou vá ao hospital.
          </Typography>
        </Alert>

        {messages.length === 0 && (
          <Card>
            <CardContent>
              <Stack spacing={3} alignItems="center" py={4}>
                <Box
                  sx={{
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.2), rgba(245, 158, 11, 0.15))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <SmartToyIcon sx={{ fontSize: 50, color: 'primary.main' }} />
                </Box>
                <Box textAlign="center" maxWidth={600}>
                  <Typography variant="h5" fontWeight={800} gutterBottom>
                    Como posso ajudar hoje?
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Faça perguntas sobre hipoglicemia, hiperglicemia, aplicação de insulina, contagem de carboidratos e muito mais.
                  </Typography>
                </Box>

                <Divider sx={{ width: '100%', my: 2 }} />

                <Box width="100%">
                  <Typography variant="subtitle2" fontWeight={800} gutterBottom sx={{ mb: 2 }}>
                    💡 Perguntas sugeridas:
                  </Typography>
                  <Stack spacing={1.5}>
                    {suggestedQuestions.map((q, i) => (
                      <Paper
                        key={i}
                        elevation={0}
                        sx={{
                          p: 2,
                          cursor: 'pointer',
                          border: theme => theme.palette.mode === 'dark'
                            ? '1px solid rgba(255,255,255,0.1)'
                            : '1px solid rgba(0,0,0,0.08)',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            borderColor: 'primary.main',
                            transform: 'translateX(8px)',
                            boxShadow: theme => theme.palette.mode === 'dark'
                              ? '0 4px 12px rgba(251, 146, 60, 0.2)'
                              : '0 4px 12px rgba(251, 146, 60, 0.15)',
                          },
                        }}
                        onClick={() => setQuestion(q.replace(/[⚡🍽️📊💉]\s*/g, ''))}
                      >
                        <Typography variant="body2" fontWeight={600}>
                          {q}
                        </Typography>
                      </Paper>
                    ))}
                  </Stack>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        )}

        {messages.length > 0 && (
          <Stack spacing={2.5}>
            {messages.map((msg, i) => (
              <Stack key={i} spacing={2}>
                {msg.role === 'user' && (
                  <Stack direction="row" spacing={2} justifyContent="flex-end">
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2.5,
                        maxWidth: '75%',
                        bgcolor: 'primary.main',
                        color: theme => theme.palette.mode === 'dark' ? 'text.primary' : '#fff',
                        borderRadius: 3,
                        borderBottomRightRadius: 4,
                      }}
                    >
                      <Typography variant="body1" fontWeight={600}>
                        {msg.content}
                      </Typography>
                    </Paper>
                    <Avatar sx={{ bgcolor: 'primary.dark' }}>
                      <PersonIcon />
                    </Avatar>
                  </Stack>
                )}
                {msg.role === 'assistant' && (
                  <Stack direction="row" spacing={2}>
                    <Avatar sx={{ bgcolor: 'secondary.main' }}>
                      <SmartToyIcon />
                    </Avatar>
                    <Box flex={1} maxWidth="75%">
                      <Card elevation={0}>
                        <CardContent>
                          <Stack spacing={2}>
                            <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                              {msg.content}
                            </Typography>
                            {msg.answer && (
                              <>
                                <Divider />
                                <Stack direction="row" spacing={1} alignItems="center">
                                  <Chip
                                    label={`Confiança: ${msg.answer.confidence_label}`}
                                    size="small"
                                    color={msg.answer.confidence_score > 0.8 ? 'success' : 'warning'}
                                  />
                                  <Typography variant="caption" color="text.secondary">
                                    {msg.answer.citations.length} fonte(s) consultada(s)
                                  </Typography>
                                </Stack>
                                {msg.answer.citations.map((cite, idx) => (
                                  <Paper
                                    key={idx}
                                    elevation={0}
                                    sx={{
                                      p: 1.5,
                                      bgcolor: 'action.hover',
                                      borderLeft: 3,
                                      borderColor: 'primary.main',
                                    }}
                                  >
                                    <Typography variant="caption" fontWeight={700} color="primary">
                                      📖 {cite.document}
                                    </Typography>
                                    <Typography variant="caption" display="block" color="text.secondary">
                                      {cite.excerpt}
                                    </Typography>
                                  </Paper>
                                ))}
                              </>
                            )}
                          </Stack>
                        </CardContent>
                      </Card>
                    </Box>
                  </Stack>
                )}
              </Stack>
            ))}
            {loading && (
              <Stack direction="row" spacing={2}>
                <Avatar sx={{ bgcolor: 'secondary.main' }}>
                  <SmartToyIcon />
                </Avatar>
                <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                  <CircularProgress size={20} />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1.5 }}>
                    A IA está digitando...
                  </Typography>
                </Box>
              </Stack>
            )}
          </Stack>
        )}

        <Paper
          elevation={0}
          sx={{
            p: 2,
            position: 'sticky',
            bottom: 0,
            zIndex: 10,
            border: theme => theme.palette.mode === 'dark'
              ? '1px solid rgba(255,255,255,0.1)'
              : '1px solid rgba(0,0,0,0.08)',
          }}
        >
          <Stack direction="row" spacing={2}>
            <TextField
              fullWidth
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder={`Pergunte sobre o cuidado de ${childLabel}...`}
              multiline
              maxRows={4}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {loading ? <CircularProgress size={20} color="primary" /> : <SmartToyIcon color="primary" />}
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              onClick={handleSend}
              disabled={!question.trim() || loading}
              sx={{ minWidth: 120, height: 56 }}
              endIcon={<SendIcon />}
            >
              {loading ? 'Aguarde...' : 'Enviar'}
            </Button>
          </Stack>
        </Paper>
      </Stack>
    </AppShell>
  );
}
