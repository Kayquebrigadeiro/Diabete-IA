# Configuração e Setup do Supabase (PostgreSQL) - Produção

Este documento define a estratégia de implantação e configuração do banco de dados relacional (PostgreSQL) utilizando o **Supabase** como plataforma de DBaaS (Database as a Service) para o projeto **Diabetes Guardian AI**.

---

## 1. Estrutura do Banco de Dados

A arquitetura de dados reflete o modelo relacional definido em `database.md`, gerenciado diretamente no PostgreSQL gerenciado pelo Supabase.

*   **Tabelas Core:** `users`, `children`, `emergency_contacts`.
*   **Tabelas Clínicas e de Rotina:** `medications`, `medication_schedules`, `medication_logs`, `glucose_records`, `appointments`, `exams`, `exam_results`.
*   **Tabelas de RAG/IA:** `chat_sessions`, `chat_messages`, `documents`, `document_chunks` (nota: os vetores pesados estarão no ChromaDB, mas os metadados/rastreio ficam no PostgreSQL).
*   **Tabelas de Sistema:** `notifications`, tabelas de histórico para auditoria (`medication_schedule_history`).

**Nota de Deploy:** A criação das tabelas e atualizações de schema devem ser gerenciadas estritamente através de **Migrations** (ex: Alembic via FastAPI backend) e aplicadas na pipeline de CI/CD.

---

## 2. Gerenciamento de Conexões

O backend em FastAPI, por ser assíncrono e de alta performance, pode abrir múltiplas conexões simultâneas que podem sobrecarregar o banco de dados.

*   **Connection Pooling (Supavisor/PgBouncer):** O Supabase já fornece o Supavisor como gerenciador nativo de pool de conexões (substituindo o PgBouncer). 
    *   **Backend (Python/FastAPI):** Deve conectar-se através da URL de **Pooling** (porta 6543) ao invés da conexão direta (porta 5432), especialmente em ambientes serverless ou escaláveis.
    *   **Modo de Pool:** Configurado como `Transaction mode` para garantir compatibilidade com requisições HTTP curtas e assíncronas do FastAPI.

---

## 3. Políticas de Segurança (Row Level Security - RLS)

A segurança de dados de saúde infantis exige isolamento severo de inquilinos (Tenant Isolation). O Supabase utiliza RLS nativo do PostgreSQL para garantir que os dados sejam acessados apenas pelas partes autorizadas.

### Diretrizes RLS
*   **Habilitação Padrão:** O RLS deve ser **habilitado em TODAS as tabelas** (`ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;`).
*   **Acesso Restrito:** Nenhuma tabela pode ser lida publicamente (`anon` access revogado).
*   **Políticas de Usuário:** Pais e responsáveis podem ler, atualizar e inserir dados **apenas** onde o `user_id` da linha corresponder ao ID do usuário autenticado no JWT token fornecido na requisição.
    *   Exemplo de Política: `CREATE POLICY "User view own child data" ON child FOR SELECT USING (auth.uid() = user_id);`
*   **Acesso do Backend (Service Role):** O backend FastAPI utilizará conexões privilegiadas na nuvem para contornar RLS onde integrações de serviços sistêmicos exijam (como crons de notificação), validando o acesso por regras de negócio e JWT do lado da aplicação.

---

## 4. Boas Práticas e Otimização

1.  **Soft Delete:** O banco implementa exclusões lógicas (Soft Delete) usando a coluna `deleted_at`. Views filtradas ou regras adicionais devem ser aplicadas nas queries principais (via SQLAlchemy) para ignorar linhas `deleted_at IS NOT NULL`.
2.  **Triggers de Auditoria:** Utilizar as _Functions_ e _Triggers_ do Supabase para registrar modificações de dosagem (`medication_schedule`) em tabelas de histórico automaticamente, independentemente de falhas no backend.
3.  **Índices de Performance:** 
    *   Criar índices B-Tree em chaves estrangeiras (`child_id`, `user_id`).
    *   Criar índices para consultas cronológicas no dashboard clínico, como `created_at` em `glucose_records` e `medication_logs`.
4.  **Extensões do Postgres:** Ativar a extensão `uuid-ossp` para geração de chaves primárias UUID e `pgcrypto` caso existam criptografias no nível do banco.
