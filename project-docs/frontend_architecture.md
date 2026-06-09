# Arquitetura do Frontend - Diabetes Guardian AI (Prompt 5)

Este documento descreve o projeto arquitetural do frontend da plataforma **Diabetes Guardian AI**, abordando a experiência do usuário, o design system, a estruturação dos componentes e a preparação para migração mobile.

## 1. Jornada do Usuário

A jornada do cuidador (usuário) desde o primeiro acesso é desenhada para ser acolhedora e eficiente:

1. **Acesso à Plataforma:** O usuário acessa a aplicação via navegador (mobile ou desktop) e chega à tela de **Login**.
2. **Cadastro Inicial:** Caso não possua conta, acessa o fluxo de **Cadastro**, inserindo nome, e-mail, senha e telefone para criar um perfil de Responsável.
3. **Onboarding:** No primeiro login, um wizard passo a passo é apresentado:
   - Adicionar o perfil da criança (nome, idade, data de diagnóstico).
   - Configurar os medicamentos base e insulinas.
   - Definir alertas iniciais.
4. **Dashboard:** O usuário é direcionado para a tela principal (Dashboard), que agrega o status atual da criança.
5. **Navegação Diária:** A navegação ocorre por uma Bottom Navigation (mobile) ou Sidebar (desktop).
6. **Fluxo Típico:** 
   - Acessar o sistema.
   - Registrar a glicemia antes da refeição.
   - Verificar a recomendação de dose do **Próximo Medicamento**.
   - Registrar que a dose foi tomada.
   - Caso haja alguma dúvida atípica (ex: "meu filho vai nadar, como ajusto?"), o usuário consulta o **Assistente IA**.

## 2. Mapa de Telas

O aplicativo possui as seguintes telas principais:

1. **Login:** Autenticação via e-mail e senha, e botão de "Esqueci minha senha".
2. **Cadastro:** Formulário para criar uma conta de responsável.
3. **Dashboard:** Visão geral diária consolidada com atalhos para ações rápidas.
4. **Perfil da Criança:** Edição de dados pessoais, peso atual, data de diagnóstico.
5. **Medicamentos:** Listagem completa de insulinas/remédios e operações de CRUD.
6. **Agenda de Medicamentos:** Linha do tempo (timeline) do dia atual, exibindo o status de cada dose (tomada, pendente, atrasada).
7. **Consultas:** Gestão de agendamentos médicos, exibindo próximas consultas e botões para agendar/reagendar/cancelar.
8. **Exames:** Lista de exames laboratoriais realizados e pendentes, com inserção de resultados.
9. **Histórico Glicêmico:** Visualização de tendências, gráficos de linha e Time in Range.
10. **Biblioteca Educacional:** Artigos da SBD e ISPAD em linguagem simples, organizados por tópicos.
11. **Assistente IA:** Interface de chat interativo com a IA baseada em RAG.
12. **Notificações:** Central de alertas (medicamentos esquecidos, lembretes de consultas).
13. **Configurações:** Edição de dados do usuário, preferências de tema e notificação, e Logout.

## 3. Wireframes Textuais

### Dashboard

```text
┌─────────────────────────────┐
│ ☰  Guardian AI           🔔 │
├─────────────────────────────┤
│ Olá, Maria!                 │
│ Resumo de hoje para João:   │
│                             │
│ ┌─────────────────────────┐ │
│ │ 🩸 Última Glicemia      │ │
│ │ 115 mg/dL (Há 2h)       │ │
│ │ Status: NO ALVO 🟢      │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │ 💊 Próximo Medicamento  │ │
│ │ Insulina Lispro (4U)    │ │
│ │ Em: 45 minutos          │ │
│ └─────────────────────────┘ │
│                             │
│ ⚠️ 1 Lembrete Pendente    │
├─────────────────────────────┤
│ 🏠   💊   🩸   🤖   ⚙️   │
└─────────────────────────────┘
```

### Agenda de Medicamentos

```text
┌─────────────────────────────┐
│ ←  Agenda de Hoje           │
├─────────────────────────────┤
│ 08:00 - Café da Manhã       │
│ [x] Insulina Lispro (4U)    │
│                             │
│ 12:00 - Almoço              │
│ [x] Insulina Lispro (5U)    │
│                             │
│ 19:00 - Jantar              │
│ [ ] Insulina Lispro (4U)    │
│     *Atrasado 10 min*       │
│                             │
│ 22:00 - Dormir              │
│ [ ] Insulina Glargina (12U) │
├─────────────────────────────┤
│ 🏠   💊   🩸   🤖   ⚙️   │
└─────────────────────────────┘
```

### Assistente IA (Chat)

```text
┌─────────────────────────────┐
│ ←  Assistente RAG AI        │
├─────────────────────────────┤
│                             │
│                      [Você] │
│      Ele está com 60 mg/dL  │
│        o que devo fazer?    │
│                             │
│ [IA]                        │
│ ⚠️ ATENÇÃO: Hipoglicemia    │
│ Aplique a regra dos 15g de  │
│ carboidratos rápidos (ex:   │
│ 1 colher de mel). Aguarde   │
│ 15 min e meça novamente.    │
│ 🟢 Confiança: Alta          │
│ 🔗 Fontes: [Guia Pais]      │
│                             │
├─────────────────────────────┤
│ [ Digite sua dúvida... ] [➤]│
└─────────────────────────────┘
```

### Histórico Glicêmico

```text
┌─────────────────────────────┐
│ ←  Evolução Glicêmica       │
├─────────────────────────────┤
│ [ Últimas 24h | 7 Dias ]    │
│                             │
│ 250|  *   *                 │
│ 180|----*------------------ │
│    |         *   *          │
│  70|------------------*---- │
│    | 08h 12h 16h 20h 00h    │
│                             │
│ 📊 Time in Range: 75% 🟢    │
│                             │
│ [ Exportar Relatório PDF ]  │
├─────────────────────────────┤
│ 🏠   💊   🩸   🤖   ⚙️   │
└─────────────────────────────┘
```

### Medicamentos (Lista)

```text
┌─────────────────────────────┐
│ ☰  Meus Medicamentos     [+]│
├─────────────────────────────┤
│ Insulina Glargina           │
│ Lenta - 12U/dia             │
│ [ Editar ] [ Suspender ]    │
│ ─────────────────────────── │
│ Insulina Lispro             │
│ Rápida - Fator 1:15         │
│ [ Editar ] [ Suspender ]    │
│ ─────────────────────────── │
│ Glucagon                    │
│ Emergência                  │
│ [ Editar ] [ Excluir ]      │
├─────────────────────────────┤
│ 🏠   💊   🩸   🤖   ⚙️   │
└─────────────────────────────┘
```

## 4. Dashboard — Detalhamento

O Dashboard é composto por cards responsivos (widgets):

- **💊 Próximo Medicamento:** Exibe o nome da próxima insulina/medicação, a dose agendada e um contador regressivo (countdown) para o horário correto.
- **🏥 Próxima Consulta:** Mostra o nome do médico, a especialidade e a data/hora da próxima visita clínica agendada.
- **🩸 Última Glicemia:** Apresenta o último valor medido acompanhado de uma cor semafórica:
  - Verde (No Alvo: 70-180 mg/dL)
  - Amarelo (Atenção: >180 mg/dL)
  - Vermelho (Risco: <70 mg/dL ou >250 mg/dL)
- **⚠️ Alertas Ativos:** Centraliza notificações urgentes (doses ignoradas, prescrições vencendo, consultas desmarcadas).
- **🤖 Atalho IA:** Um botão flutuante visível (`FAB`) posicionado estrategicamente para invocar o chat em caso de dúvida rápida.
- **📊 Resumo Semanal:** Um mini-gráfico integrado mostrando de forma rápida o percentual de *Time in Range* (Tempo no Alvo) dos últimos 7 dias.

## 5. Módulo Medicamentos — Operações

O fluxo visual de operações para medicamentos envolve:

- **Cadastrar novo medicamento:** Formulário para nome, tipo (rápida/lenta/oral), relação insulina-carboidrato (caso aplicável) e fator de sensibilidade.
- **Editar nome/tipo:** Acesso ao formulário preenchido para realizar ajustes.
- **Alterar dosagem:** Um modal específico permite mudar a dose com registro obrigatório do motivo (o que alimenta o `MedicationScheduleAuditLog` no backend).
- **Alterar frequência/horários:** Interface de relógio/lista para redefinir as faixas horárias da medicação.
- **Suspender temporariamente:** Um botão de ação rápida (toggle) para desativar os alertas de uma medicação sem apagá-la do histórico (ex: troca temporária de terapia).
- **Excluir:** Ação irreversível para o usuário (soft delete no BD), requerendo digitação de confirmação (ex: "EXCLUIR") em um modal vermelho de atenção.

## 6. Módulo Consultas — Operações

O gerenciamento da agenda médica inclui:

- **Agendar nova consulta:** Formulário simples requisitando o nome do profissional, especialidade médica, e um Date/Time picker intuitivo.
- **Cancelar consulta:** Acionado via botão no card da consulta. Abre um modal de confirmação que exige a seleção/inserção de um motivo.
- **Reagendar consulta:** Interface que permite escolher uma nova data/hora mantendo o vínculo com a consulta original. Exige preenchimento de justificativa.
- **Histórico de alterações:** Uma linha do tempo embutida na tela de detalhes da consulta que mostra quem alterou, de qual data para qual data, e o motivo.

## 7. Histórico Glicêmico

A interface de análise clínica é projetada para ser rica e visual:

- **Gráfico de linha temporal:** Controles de período permitem visualizar as últimas 24h, 7 dias, 30 dias e 90 dias.
- **Faixas coloridas interativas:** O fundo do gráfico exibe gradientes de risco:
  - <70 mg/dL: Zona vermelha inferior (Hipo)
  - 70-180 mg/dL: Zona verde central (Alvo)
  - \>180 mg/dL: Zona amarela superior (Hiper leve)
  - \>250 mg/dL: Zona vermelha superior (Hiper grave)
- **Time in Range:** Um gráfico de rosca (donut chart) resumindo a porcentagem do tempo em que a criança esteve dentro do alvo glicêmico.
- **Tendências:** Cards menores com métricas de média, desvio padrão e variabilidade glicêmica.
- **Exportação:** Um botão "Exportar PDF" que gera um relatório amigável formatado para leitura direta do endocrinologista.

## 8. Assistente IA — Interface

O módulo de IA utiliza a estratégia de RAG e apresenta os seguintes elementos:

- **Layout de chat:** Padrão familiar (bolhas do usuário à direita, respostas da IA à esquerda).
- **Confiança e Citações:** Cada resposta da IA vem acompanhada de um *Badge de Confiança* (🟢 Alta, 🟡 Moderada, 🟠 Baixa) e uma lista de referências clicáveis no formato `[Documento, Página]`.
- **Visualização de Fontes:** Em telas grandes (desktop), clicar na fonte abre um painel lateral (*Side Drawer*) com o parágrafo original lido pela IA. No mobile, isso ocorre via um *Bottom Sheet* deslizante.
- **Histórico:** Menu lateral (ou superior mobile) permitindo acessar sessões de chat anteriores.
- **Aviso Fixo:** Um banner sutil no topo do chat reforça: *"Este assistente baseia-se em protocolos padrão e não substitui a orientação médica profissional"*.

## 9. Estrutura de Componentes React

A aplicação segue uma componentização baseada no domínio do problema:

- **`components/common/`**: Componentes burros e genéricos construídos sobre o Material UI (`Button`, `Input`, `Modal`, `Card`, `Badge`, `LoadingIndicator`, `EmptyState`).
- **`components/layout/`**: Estruturas de página (`AppBar`, `Sidebar`, `BottomNav`, `PageContainer`).
- **`components/medical/`**: Domínio médico reutilizável (`MedicationCard`, `DoseTimeline`, `AppointmentCard`).
- **`components/chat/`**: Domínio de IA (`ChatBubble`, `MessageList`, `CitationCard`, `ConfidenceBadge`, `ChatInput`).
- **`components/glucose/`**: Domínio de métricas (`GlucoseLineChart`, `TimeInRangeDonut`, `TrendSummary`).

## 10. Estrutura de Pastas do Frontend

Para garantir a escalabilidade e a separação estrita entre lógica e visual, a árvore do projeto Vite + React é organizada da seguinte forma:

```text
src/
├── assets/                  # Imagens estáticas, logotipos e fontes
├── components/              # (common, layout, medical, chat, glucose)
├── context/                 # Contextos globais (ThemeProvider, AuthProvider)
├── hooks/                   # Lógica de negócio isolada (React Hooks)
│   ├── useAuth.ts
│   ├── useChildren.ts
│   ├── useMedications.ts
│   ├── useGlucose.ts
│   ├── useRAGChat.ts        # Gerencia o estado de streaming de LLM e histórico
│   └── useNotifications.ts
├── routes/                  # Definições do React Router
├── services/                # Camada de comunicação com o backend FastAPI
│   ├── api.ts               # Configuração do Axios + Interceptors
│   ├── auth.ts
│   ├── medical.ts
│   ├── chat.ts
│   └── glucose.ts
├── styles/                  # Design Tokens e definições do MUI
│   ├── theme.ts
│   └── global.css
├── types/                   # Interfaces TypeScript globais
├── utils/                   # Utilitários puros (formatadores de data, validadores)
├── views/                   # Componentes de página que consomem hooks e agregam components
│   ├── LoginView.tsx
│   ├── DashboardView.tsx
│   └── ...
├── App.tsx                  # Root wrapper (Providers + Router)
└── main.tsx                 # Entrypoint de inicialização do React
```

**Justificativa Mobile-Ready:** Ao isolar toda a manipulação de API e controle de estados nos diretórios `/hooks` e `/services`, e manter os `components` livres de regras complexas, a futura migração para React Native exigirá primordialmente a reescrita da camada `/components` e `/views` utilizando as tags nativas (`View`, `Text`), reutilizando os hooks de negócio inteiramente.

## 11. Estratégia Mobile-First

O desenvolvimento e os testes focarão inicialmente na experiência móvel, escalando progressivamente:

- **Breakpoints:**
  - `xs`: <600px (Smartphones)
  - `sm`: 600px - 900px (Tablets portrait)
  - `md`: 900px - 1200px (Laptops pequenos e tablets landscape)
  - `lg`: >1200px (Desktops)
- **Touch Targets:** Todos os botões, checkboxes e cards terão tamanho mínimo clicável de 44x44px.
- **Bottom Navigation:** Usada exclusivamente no breakpoint `xs` e `sm` contendo 5 itens vitais (Dashboard, Medicamentos, Glicemia, Chat IA, Menu Principal).
- **Gestos:** Otimização UX com interações *swipe-to-action* (ex: arrastar uma dose para o lado direito para marcá-la como `TOMADA`) e *pull-to-refresh* em listas (consultas e exames).
- **PWA (Progressive Web App):** Implementação de Service Workers focada em *cache offline básico* e registro nativo para Web Push Notifications (para disparar os alertas gerados pelo backend).

## 12. Design System

O Diabetes Guardian AI adota uma paleta baseada em HSL, permitindo controle fino sobre luminosidade em trocas de tema:

- **Cores Oficiais:**
  - `Primary`: Azul Saúde (`hsl(210, 80%, 50%)`) - Passa serenidade e credibilidade clínica.
  - `Secondary`: Verde Confiança (`hsl(150, 60%, 45%)`) - Usado para faixas no alvo e ações positivas.
  - `Danger`: Vermelho Alerta (`hsl(0, 75%, 55%)`) - Hipoglicemias, alertas graves e deletar dados.
  - `Warning`: Âmbar (`hsl(40, 90%, 55%)`) - Hiperglicemias moderadas e avisos temporais.
  - `Background`: Modo Claro (`hsl(210, 20%, 98%)`) / Modo Escuro (`hsl(220, 25%, 12%)`).
- **Tipografia:** Familia tipográfica **Inter** ou **Roboto**. Escala harmoniosa: 12px (legendas), 14px (corpo pequeno), 16px (corpo padrão), 20px (títulos H3), 24px (títulos H2), 32px (grandes destaques numéricos).
- **Espaçamento:** Grid rígido de 8px (4, 8, 12, 16, 24, 32, 48, 64) mantendo consistência entre os paddings e margins de todos os componentes.
- **Bordas (Border-Radius):** 8px para Cards (aparência sólida), 12px para Modais e painéis suspensos, 24px para botões estilizados "Pill" (pílulas), alinhados metaforicamente à temática de saúde.
- **Sombras (Elevation):** Sombras difusas inspiradas em *Material You*: `sm` (para cards inativos), `md` (para hover e dropdowns), `lg` (para Modais e FABs).
- **Estados Visuais Padrão:** Todo componente interativo possui feedback rigoroso para os estados `default`, `hover`, `active`, `focus` (borda externa de acessibilidade), `disabled` (transparência de 50%), `loading` (exibindo esqueleto ou spinner circular), `error` e `success`.
