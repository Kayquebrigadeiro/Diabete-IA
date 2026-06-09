# PROMPT 6 — IMPLEMENTAÇÃO COMPLETA

Você é um Engenheiro de Software Sênior responsável pela implementação do projeto.

IMPORTANTE:

Toda a fase de arquitetura já foi concluída.

NÃO crie uma nova arquitetura.

NÃO proponha tecnologias alternativas.

NÃO simplifique funcionalidades.

NÃO gere documentação adicional.

NÃO gere novos requisitos.

Considere os documentos existentes como a fonte oficial do projeto.

---

# PROJETO

Nome:

Diabetes Guardian AI

Objetivo:

Plataforma web para auxiliar responsáveis, crianças e adolescentes com Diabetes Mellitus Tipo 1 através de:

* Organização do tratamento
* Controle glicêmico
* Gestão de medicamentos
* Gestão de consultas
* Gestão de exames
* Biblioteca educacional
* Assistente IA baseado em RAG
* Notificações e lembretes

---

# DOCUMENTAÇÃO OFICIAL

Leia integralmente todos os documentos da pasta project-docs antes de iniciar.

Arquivos obrigatórios:

* document_analysis.md
* knowledge_map.md
* rag_sources_priority.md
* architecture.md
* roadmap.md
* folder_structure.md
* rag_architecture.md
* ingestion_flow.md
* retrieval_flow.md
* database.md
* schema.sql
* backend_architecture.md
* frontend_architecture.md

Esses documentos definem a implementação.

Caso exista conflito entre documentos:

1. architecture.md
2. backend_architecture.md
3. frontend_architecture.md
4. database.md
5. schema.sql

Seguir essa ordem de prioridade.

---

# STACK OFICIAL

## Frontend

* React
* TypeScript
* Vite
* Material UI
* React Router DOM
* React Query
* Axios
* React Hook Form
* Zod
* Recharts
* Sonner
* date-fns

Deploy:

* Vercel

---

## Backend

* Python
* FastAPI
* SQLAlchemy 2.x
* Alembic
* Pydantic v2
* Python-JOSE (JWT)
* Passlib
* HTTPX
* Python Multipart

Deploy:

* Render

---

## Banco de Dados

* PostgreSQL
* Supabase
* Psycopg

---

## IA

* DeepSeek API
* deepseek-chat

---

## RAG

* LangChain
* ChromaDB
* PyMuPDF
* tiktoken

---

# IMPLEMENTAÇÃO OBRIGATÓRIA

## Backend

Implementar:

* Estrutura completa do projeto
* Configurações
* Banco de dados
* Models
* Schemas
* Repositories
* Services
* Controllers/Routers
* Middlewares
* JWT Authentication
* Refresh Tokens
* Upload de documentos
* Sistema de notificações
* Logs
* Tratamento de erros

---

## Entidades

Implementar todas as entidades definidas em database.md e schema.sql.

Incluindo:

* User
* Child
* Medication
* MedicationSchedule
* MedicationLog
* Appointment
* AppointmentHistory
* Exam
* ExamResult
* GlucoseRecord
* EmergencyContact
* Notification
* ChatSession
* ChatMessage
* Document
* DocumentChunk

---

## RAG

Implementar:

* Upload de PDFs
* Processamento dos documentos
* Extração de texto
* Chunking
* Embeddings
* ChromaDB
* Busca vetorial
* Recuperação de contexto
* Integração DeepSeek
* Sistema de citações
* Sistema de confiança

---

## Frontend

Implementar todas as telas definidas em frontend_architecture.md.

Incluindo:

* Login
* Cadastro
* Dashboard
* Perfil da Criança
* Medicamentos
* Agenda de Medicamentos
* Consultas
* Exames
* Histórico Glicêmico
* Biblioteca Educacional
* Assistente IA
* Notificações
* Configurações

---

## Dashboard

Implementar:

* Próximo medicamento
* Próxima consulta
* Última glicemia
* Alertas
* Resumo semanal
* Atalhos rápidos

---

## Medicamentos

Permitir:

* Cadastrar
* Editar
* Excluir
* Suspender
* Alterar dosagem
* Alterar frequência

---

## Consultas

Permitir:

* Agendar
* Editar
* Cancelar
* Reagendar
* Histórico

---

## Controle Glicêmico

Permitir:

* Registrar glicemia
* Visualizar histórico
* Visualizar gráficos
* Visualizar tendências

---

## Assistente IA

Implementar:

* Chat
* Histórico
* Fontes utilizadas
* Confiança da resposta

---

# EXECUÇÃO

Implemente por etapas.

Ordem:

Fase 1:
Backend + Banco

Fase 2:
RAG

Fase 3:
Frontend

Fase 4:
Integração completa

Ao final de cada fase:

* corrigir erros
* corrigir imports
* validar dependências
* validar build

Não interrompa para replanejar.

Não gere documentação.

Foque exclusivamente na implementação dos arquivos reais do projeto conforme a especificação existente.
