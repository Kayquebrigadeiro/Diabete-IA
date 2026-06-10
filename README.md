<div align="center">

# 🩺 Auri - Diabetes Guardian AI

### Assistente Inteligente para o Cuidado de Crianças com Diabetes Tipo 1

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=FastAPI&logoColor=white)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

</div>

---

## 🌟 Sobre o Projeto

**Auri** é uma plataforma completa de gestão e assistência para pais e responsáveis de crianças com Diabetes Tipo 1. Combinando tecnologia de ponta com inteligência artificial, oferecemos suporte 24/7 baseado em diretrizes médicas internacionais (ISPAD) e protocolos do Ministério da Saúde.

### ✨ Principais Funcionalidades

- 🤖 **Chat AI Inteligente** - Assistente virtual com RAG (Retrieval-Augmented Generation) treinado em documentos médicos especializados
- 📊 **Monitoramento de Glicemia** - Registro e visualização de medições com análise de tendências
- 💊 **Gestão de Medicamentos** - Catálogo de insulinas e controle de horários
- 📅 **Agenda Médica** - Consultas, exames e notificações automáticas
- 👶 **Perfis de Crianças** - Gerenciamento completo de múltiplos perfis
- 📈 **Dashboard Analítico** - Insights visuais sobre o controle glicêmico

---

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                            │
│  React + TypeScript + Material-UI + Vite                   │
│  Deployed on Vercel                                        │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ REST API
                         │
┌────────────────────────▼────────────────────────────────────┐
│                         BACKEND                             │
│  FastAPI + Python + SQLAlchemy                             │
│  Deployed on Render                                        │
├─────────────────────────────────────────────────────────────┤
│  • Authentication (JWT)                                     │
│  • RESTful API endpoints                                    │
│  • RAG system (ChromaDB + LangChain)                       │
└────────────────┬────────────────────┬───────────────────────┘
                 │                    │
      ┌──────────▼──────────┐   ┌────▼─────────────┐
      │   PostgreSQL        │   │   ChromaDB       │
      │   (Supabase)        │   │   (Vector Store) │
      │   Relational Data   │   │   Documents RAG  │
      └─────────────────────┘   └──────────────────┘
```

---

## 🚀 Começando

### Pré-requisitos

- Node.js 18+ e npm
- Python 3.10+
- PostgreSQL (ou conta Supabase)
- Git

### 📦 Instalação

#### 1️⃣ Clone o Repositório

```bash
git clone https://github.com/Kayquebrigadeiro/Auri.git
cd Auri
```

#### 2️⃣ Configure o Backend

```bash
cd backend

# Crie um ambiente virtual
python -m venv venv
source venv/bin/activate  # No Windows: venv\Scripts\activate

# Instale as dependências
pip install -r requirements.txt

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais
```

**Variáveis de Ambiente do Backend (.env):**

```env
DATABASE_URL=postgresql://user:password@host:5432/database
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
OPENAI_API_KEY=your-openai-key  # Opcional para RAG
```

**Execute as Migrações:**

```bash
alembic upgrade head
```

**Inicie o Backend:**

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### 3️⃣ Configure o Frontend

```bash
cd ../frontend

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.local.example .env.local
# Edite o .env.local
```

**Variáveis de Ambiente do Frontend (.env.local):**

```env
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=Auri
```

**Inicie o Frontend:**

```bash
npm run dev
```

🎉 Acesse: [http://localhost:5173](http://localhost:5173)

---

## 📂 Estrutura do Projeto

```
Auri/
├── frontend/                    # Aplicação React
│   ├── src/
│   │   ├── components/          # Componentes reutilizáveis
│   │   ├── views/               # Páginas principais
│   │   ├── services/            # Integração API
│   │   ├── hooks/               # Custom React hooks
│   │   ├── context/             # Context API (Auth, Theme)
│   │   ├── types/               # Tipos TypeScript
│   │   └── styles/              # Tema Material-UI
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                     # API FastAPI
│   ├── app/
│   │   ├── api/                 # Rotas da API
│   │   ├── models/              # Modelos SQLAlchemy
│   │   ├── schemas/             # Schemas Pydantic
│   │   ├── services/            # Lógica de negócio
│   │   ├── repositories/        # Camada de dados
│   │   ├── core/                # Configurações
│   │   └── main.py              # Entry point
│   ├── alembic/                 # Migrações
│   ├── chroma_db/               # Banco vetorial RAG
│   └── requirements.txt
│
├── supabase/                    # Schemas SQL
├── project-docs/                # Documentação técnica
├── contexto_diabetetipo1/       # Documentos médicos PT-BR
├── ISPAD/                       # Guidelines internacionais
└── README.md
```

---

## 🛠️ Tecnologias

### Frontend

- **React 19** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Material-UI (MUI)** - Componentes e design system
- **Vite** - Build tool ultrarrápido
- **TanStack Query** - Gerenciamento de estado servidor
- **React Router** - Roteamento
- **Axios** - Cliente HTTP
- **Recharts** - Gráficos e visualizações
- **Sonner** - Notificações toast

### Backend

- **FastAPI** - Framework web moderno
- **SQLAlchemy** - ORM
- **Alembic** - Migrações de banco
- **Pydantic** - Validação de dados
- **Python-Jose** - JWT authentication
- **ChromaDB** - Vector database para RAG
- **LangChain** - Framework LLM
- **PyMuPDF** - Processamento de PDFs

### Infraestrutura

- **Vercel** - Deploy frontend
- **Render** - Deploy backend
- **Supabase** - PostgreSQL gerenciado
- **GitHub** - Controle de versão

---

## 🤖 Sistema RAG (Retrieval-Augmented Generation)

O coração da inteligência da Auri é o sistema RAG, que:

1. **Indexa** documentos médicos especializados (ISPAD, Ministério da Saúde)
2. **Processa** perguntas dos usuários
3. **Recupera** trechos relevantes dos documentos
4. **Gera** respostas contextualizadas e precisas

### Fluxo do RAG

```
Pergunta do Usuário
       ↓
Embedding da pergunta
       ↓
Busca vetorial no ChromaDB
       ↓
Top-K documentos relevantes
       ↓
LLM gera resposta contextualizada
       ↓
Resposta com citações
```

---

## 📚 API Endpoints

### Autenticação

```http
POST /auth/register          # Registrar novo usuário
POST /auth/login            # Login (retorna JWT)
GET  /auth/me               # Dados do usuário autenticado
```

### Crianças

```http
GET    /children            # Listar perfis de crianças
POST   /children            # Criar novo perfil
PUT    /children/{id}       # Atualizar perfil
DELETE /children/{id}       # Deletar perfil
```

### Medicamentos

```http
GET    /medications         # Listar medicamentos
POST   /medications         # Criar medicamento
PUT    /medications/{id}    # Atualizar medicamento
DELETE /medications/{id}    # Deletar medicamento
```

### Glicemia

```http
GET    /glucose?child_id={id}    # Listar medições
POST   /glucose                  # Registrar medição
```

### Consultas

```http
GET    /appointments?child_id={id}  # Listar consultas
POST   /appointments                # Agendar consulta
PUT    /appointments/{id}           # Atualizar consulta
DELETE /appointments/{id}           # Cancelar consulta
```

### Chat AI

```http
POST /chat                  # Enviar mensagem ao assistente
GET  /chat/history          # Histórico de conversas
```

📖 **Documentação Completa:** [http://localhost:8000/docs](http://localhost:8000/docs) (Swagger UI)

---

## 🎨 Design System

O frontend utiliza um tema customizado laranja/âmbar com suporte a modo escuro:

- **Primary:** Orange 500 (#f97316)
- **Secondary:** Amber 500 (#f59e0b)
- **Typography:** Inter font family
- **Shadows:** Customizadas para profundidade
- **Border Radius:** 12px padrão

---

## 🔐 Segurança

- ✅ Autenticação JWT
- ✅ Senhas com hash bcrypt
- ✅ CORS configurado
- ✅ Validação de entrada (Pydantic)
- ✅ SQL injection prevention (SQLAlchemy ORM)
- ✅ Soft deletes
- ✅ HTTPS em produção

---

## 🧪 Testes

```bash
# Backend
cd backend
pytest

# Frontend
cd frontend
npm run test
```

---

## 📈 Deploy

### Frontend (Vercel)

1. Conecte o repositório no [Vercel](https://vercel.com)
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Backend (Render)

1. Crie um novo Web Service no [Render](https://render.com)
2. Conecte o repositório
3. Configure:
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Configure as variáveis de ambiente

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👥 Autores

- **Kayque Brigadeiro** - [GitHub](https://github.com/Kayquebrigadeiro)

---

## 🙏 Agradecimentos

- **ISPAD** - International Society for Pediatric and Adolescent Diabetes
- **Ministério da Saúde (Brasil)** - Protocolos e diretrizes
- Comunidade open source

---

## 📞 Suporte

Tem dúvidas ou encontrou um bug?

- 📧 Email: [contato@exemplo.com](mailto:contato@exemplo.com)
- 🐛 Issues: [GitHub Issues](https://github.com/Kayquebrigadeiro/Auri/issues)

---

<div align="center">

**Feito com ❤️ para famílias que cuidam de crianças com Diabetes Tipo 1**

⭐ Se este projeto te ajudou, deixe uma estrela!

</div>
