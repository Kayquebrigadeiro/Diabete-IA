# Mapeamento de Variáveis de Ambiente - Produção

Este documento lista todas as variáveis de ambiente necessárias para a infraestrutura, deploy e execução do **Diabetes Guardian AI** em seus diferentes ambientes de implantação.

> **Importante:** Jamais faça o commit de variáveis `.env` reais para o repositório. O gerenciamento de secrets em produção deve ser feito via GitHub Actions Secrets ou gerenciadores nativos de Cloud (ex: AWS Secrets Manager / Vercel Env Vars).

---

## 1. Variáveis do Frontend (React Web App)

*O prefixo `VITE_` é necessário para expor as variáveis ao cliente no momento do build.*

| Variável | Propósito | Secreta? |
| :--- | :--- | :---: |
| `VITE_API_BASE_URL` | URL do endpoint público do Backend (FastAPI). | Não |
| `VITE_SUPABASE_URL` | URL pública da instância do Supabase do projeto. | Não |
| `VITE_SUPABASE_ANON_KEY` | Chave anônima para interações seguras limitadas pelo RLS. | Não |
| `VITE_SENTRY_DSN_FE` | DSN de integração para monitoramento de erros via Sentry. | Não |

---

## 2. Variáveis do Backend (FastAPI)

| Variável | Propósito | Secreta? |
| :--- | :--- | :---: |
| `ENV` | Define o ambiente (`development`, `staging`, `production`). | Não |
| `ALLOWED_CORS_ORIGINS` | Lista de URLs de frontend permitidas (ex: https://meuapp.com). | Não |
| `SECRET_KEY` | Chave forte usada para assinar os tokens JWT da API. | **Sim** |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Tempo de expiração do token de sessão. | Não |
| `HOST` / `PORT` | Endereço e porta de ligação do servidor web uvicorn (Padrão: 0.0.0.0/8000). | Não |

---

## 3. Variáveis do Banco de Dados e Conexão (Supabase)

| Variável | Propósito | Secreta? |
| :--- | :--- | :---: |
| `DATABASE_URL` | String de conexão (Pooling Mode) gerada pelo Supabase. | **Sim** |
| `DIRECT_URL` | String de conexão direta usada pelo Alembic para rodar Migrations. | **Sim** |
| `SUPABASE_SERVICE_ROLE_KEY` | Chave de serviço que burla o RLS (uso exclusivo e restrito do Backend). | **Sim** |

---

## 4. Variáveis de Integração RAG e LLM

| Variável | Propósito | Secreta? |
| :--- | :--- | :---: |
| `DEEPSEEK_API_KEY` | Chave de autenticação na API do modelo LLM DeepSeek. | **Sim** |
| `CHROMA_DB_PATH` | Caminho do diretório local para persistência do DB vetorial (se standalone). | Não |
| `CHROMA_DB_HOST` | Host e porta (ou URL) caso o ChromaDB esteja rodando como serviço em contêiner. | Não |
| `EMBEDDINGS_MODEL` | Nome do modelo para vetorização de dados (ex: config customizada da DeepSeek). | Não |
| `RAG_RELEVANCE_THRESHOLD` | Limite mínimo de similaridade para mitigar alucinações (ex: `0.65`). | Não |

---

## 5. Variáveis de Monitoramento e Logs

| Variável | Propósito | Secreta? |
| :--- | :--- | :---: |
| `SENTRY_DSN_BE` | DSN de rastreamento de logs e exceções de backend via Sentry. | **Sim** |
| `LOG_LEVEL` | Nível de verbosidade (`INFO`, `WARNING`, `ERROR`, `DEBUG`). | Não |
| `PROMETHEUS_METRICS_ENABLED`| Habilita porta `/metrics` se Prometheus/Grafana estiver ativado (`true`/`false`).| Não |
