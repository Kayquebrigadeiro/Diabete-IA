# Configuração de Deploy - Backend (Render)

Este documento descreve as diretrizes e configurações necessárias para hospedar o backend FastAPI do **Diabetes Guardian AI** na plataforma Render.

## 1. Configuração do Serviço Backend

O backend deve ser configurado como um **Web Service** no Render. O projeto FastAPI é idealmente executado via `uvicorn` (ou `gunicorn` com *workers* do `uvicorn`) para aproveitar a arquitetura assíncrona.

- **Environment:** `Python 3.11+`
- **Region:** Escolher a região mais próxima dos usuários (ex: `US East` ou `South America`, dependendo da disponibilidade e foco geográfico).
- **Branch:** `main` para Produção.

## 2. Comandos de Inicialização

**Build Command:**
Este comando é executado a cada novo deploy para preparar o ambiente. É recomendado instalar as dependências e aplicar migrações do banco de dados (Alembic) durante o build, garantindo que a API só inicie se as tabelas estiverem atualizadas.

```bash
pip install -r requirements.txt && alembic upgrade head
```

**Start Command:**
O comando que mantém a aplicação rodando. Usaremos o Uvicorn. Em produção, definir *workers* ou usar gunicorn é o ideal para lidar com múltiplas conexões.

```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT --workers 4
```
*(Nota: O Render injeta a variável `$PORT` automaticamente).*

## 3. Variáveis de Ambiente (Environment Variables)

A segurança e o comportamento do backend são ditados pelas seguintes variáveis de ambiente, que devem ser cadastradas de forma segura (como "Secret Files" ou "Environment Variables") no painel do Render:

| Variável | Descrição | Exemplo |
|---|---|---|
| `ENVIRONMENT` | Define o ambiente (`production`, `staging`). | `production` |
| `DATABASE_URL` | URL de conexão PostgreSQL (Supabase) via PgBouncer. | `postgresql+asyncpg://user:pass@host:6543/db` |
| `SECRET_KEY` | Chave criptográfica para assinatura dos tokens JWT. | `(Gerar hash forte via openssl rand -hex 32)` |
| `ALGORITHM` | Algoritmo de hash do JWT. | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Tempo de vida do JWT. | `15` |
| `CORS_ORIGINS` | Domínios autorizados a consumir a API. | `https://diabetesguardian.app` |
| `DEEPSEEK_API_KEY` | Chave de autenticação da IA DeepSeek. | `sk-xxxxxxxxx` |
| `CHROMA_DB_URL` | URL de conexão do ChromaDB (se externo). | `http://chroma-service:8000` |

## 4. Health Checks

Para que o Render garanta o *Zero Downtime Deployment*, é imperativo configurar um Health Check Path. 

- **Health Check Path:** `/api/v1/health`
- Este endpoint no FastAPI deve retornar um código HTTP `200 OK` e testar superficialmente a conexão com o banco de dados.
- O Render só roteará tráfego para a nova versão após o health check responder positivamente.

## 5. Escalabilidade e Configurações Recomendadas

- **Auto-Scaling:** Ativar a opção de *Autoscaling* do Render, definindo um mínimo de 2 instâncias (garantindo alta disponibilidade e fallback) e um máximo de acordo com o plano contratado (ex: 5 instâncias).
- **Métrica de Scale:** Escalar se CPU > 70% ou Memória > 75%.
- **Background Jobs (Cron):** O envio de notificações agendadas e a consolidação de alertas devem preferencialmente rodar como um serviço *Cron Job* separado no Render ou via *Celery / Redis* instanciado no mesmo cluster VPC, para não onerar o ciclo de eventos do web server.
