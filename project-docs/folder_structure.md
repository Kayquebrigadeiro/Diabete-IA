# Estrutura de Pastas - Diabetes Guardian AI (Prompt 1)

Este documento descreve a organização dos arquivos nos diretórios do frontend e backend da aplicação, focando em manutenibilidade, separação de conceitos e prontidão para futura migração mobile (React Native).

---

## 1. Visão Geral da Raiz do Repositório

```
diabetes-guardian-ai/
├── backend/                 # API FastAPI (Python)
├── frontend/                # SPA React (TypeScript + Vite)
├── project-docs/            # Documentação técnica e arquitetural do projeto
└── README.md
```

---

## 2. Estrutura do Backend (FastAPI)

```
backend/
├── app/
│   ├── api/                 # Camada de Endpoints HTTP (Routers)
│   │   ├── v1/
│   │   │   ├── auth.py
│   │   │   ├── children.py
│   │   │   ├── medical.py
│   │   │   ├── rag_chat.py
│   │   │   └── notifications.py
│   │   └── router.py
│   ├── core/                # Configurações globais e segurança
│   │   ├── config.py
│   │   ├── security.py
│   │   └── database.py
│   ├── models/              # Modelos declarativos do SQLAlchemy
│   │   ├── user.py
│   │   ├── child.py
│   │   ├── medication.py
│   │   └── chat.py
│   ├── schemas/             # Validação de dados de entrada/saída (Pydantic)
│   │   ├── user.py
│   │   ├── glucose.py
│   │   └── rag.py
│   ├── services/            # Camada de lógica de negócios e integrações
│   │   ├── calculation.py   # Cálculos de dosagem e fator de sensibilidade
│   │   ├── rag_engine.py    # Pipeline de busca no ChromaDB + DeepSeek
│   │   └── notifier.py      # Gerenciador de notificações e cron
│   └── main.py              # Ponto de entrada do servidor FastAPI
├── scripts/                 # Scripts auxiliares (ex: ingestão RAG inicial)
│   └── ingest_docs.py
├── requirements.txt
└── pytest.ini
```

---

## 3. Estrutura do Frontend (React + TypeScript + Vite)

Organizado de forma a separar a lógica (hooks/services) da renderização (components/views) para facilitar o reaproveitamento futuro em React Native.

```
frontend/
├── public/
├── src/
│   ├── assets/              # Imagens, ícones e fontes
│   ├── components/          # Componentes reutilizáveis puros (sem estado global)
│   │   ├── common/          # Button, Input, Modal (customizados sobre o MUI)
│   │   ├── chat/            # ChatBubble, MessageList, CitationCard
│   │   └── cards/           # GlucoseCard, MedicationScheduleCard
│   ├── context/             # Contextos globais leves (ex: ThemeContext)
│   ├── hooks/               # Custom Hooks (Camada de Lógica isolada)
│   │   ├── useAuth.ts
│   │   ├── useGlucose.ts
│   │   └── useRAGChat.ts     # Controla o fluxo de perguntas e respostas da IA
│   ├── routes/              # Configuração de rotas (React Router)
│   ├── services/            # Comunicação HTTP / Clientes de API
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   └── chat.ts
│   ├── styles/              # Design System e temas globais (MUI Customization)
│   │   ├── theme.ts         # Paleta HSL, tipografia, grid
│   │   └── global.css
│   ├── views/               # Telas principais (Páginas montadas)
│   │   ├── LoginView.tsx
│   │   ├── DashboardView.tsx
│   │   ├── RAGChatView.tsx
│   │   └── FirstDaysView.tsx# Modo Primeiros 30 Dias
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── package.json
└── tsconfig.json
```
