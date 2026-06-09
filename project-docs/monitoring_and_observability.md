# Monitoramento e Observabilidade - Diabetes Guardian AI (Prompt 7)

Este documento define a estratégia abrangente de monitoramento, observabilidade e coleta de logs para a plataforma **Diabetes Guardian AI**, garantindo alta disponibilidade, auditoria de segurança e rastreamento de performance clínica.

---

## 1. Estratégia de Logs (Logging)

A estruturação dos logs é dividida em três categorias cruciais: aplicação, API e autenticação, com gravação em formato estruturado (JSON) para fácil ingestão por ferramentas de análise de logs (como Grafana Loki ou Datadog).

### 1.1 Logs de Aplicação (Application Logs)
*   **Escopo:** Fluxos internos do sistema, execução de tarefas em background e processamento de RAG.
*   **Severidades:**
    *   `INFO`: Registro de inicialização de serviços, carregamento de chunks no ChromaDB e conexões com APIs externas.
    *   `WARNING`: Demora na resposta da API DeepSeek (e.g., latency > 3s), tentativas falhas de carregamento de PDFs parciais.
    *   `ERROR`: Falha na geração do cálculo de bolus, erro ao conectar com o ChromaDB, ativamento do fallback de segurança da IA.
    *   `CRITICAL`: Indisponibilidade de banco de dados, falha crítica no container do FastAPI.
*   **Campos Requeridos no JSON:** `timestamp`, `level`, `module`, `function`, `message`, `user_id` (se aplicável), `trace_id`.

### 1.2 Logs de API (API Access Logs)
*   **Escopo:** Monitoramento de tráfego HTTP/HTTPS recebido pelo FastAPI.
*   **Implementação:** Middleware ASGI customizado no FastAPI para capturar informações de cada requisição.
*   **Campos Requeridos:** `method`, `path`, `status_code`, `response_time_ms`, `client_ip`, `user_agent`, `request_size`, `response_size`, `trace_id`.
*   **Regra de Ouro:** Não logar dados sensíveis de payload (como registros de glicemia específicos, senhas ou tokens JWT) para manter a conformidade com a privacidade de dados de saúde.

### 1.3 Logs de Autenticação (Authentication Logs)
*   **Escopo:** Registro de ciclos de vida de acessos, detecção de tentativas de força bruta e uso de credenciais.
*   **Ações Registradas:**
    *   Tentativa de login (Sucesso / Falha por senha incorreta / Falha por usuário inexistente).
    *   Refresh de tokens JWT.
    *   Revogação manual de tokens (Logout).
    *   Bloqueio temporário de IP por Rate Limiting.
*   **Campos Requeridos:** `timestamp`, `action`, `user_email` (ofuscado, e.g., `u***@mail.com`), `status`, `ip_address`, `failure_reason` (se aplicável).

---

## 2. Monitoramento de Erros e Exceções (Error Tracking)

*   **Ferramenta Recomendada:** **Sentry** (integrado nativamente ao FastAPI e React).
*   **Captura no Backend (FastAPI):**
    *   Captura automática de exceções não tratadas (retornos `500 Internal Server Error`).
    *   Log de erros com nível `error` e `critical` disparados no código.
    *   Associação do `user_id` de forma anonimizada às tags do erro para facilitar a reprodução sem expor informações confidenciais.
*   **Captura no Frontend (React):**
    *   Uso de `ErrorBoundary` global do React para capturar falhas de renderização de componentes visuais.
    *   Captura de falhas em requisições do Axios e tratamento inconsistente de dados de gráficos de glicemia.

---

## 3. Monitoramento de Performance (APM)

O monitoramento do desempenho garante que a aplicação responda rapidamente, mesmo sob carga severa.

*   **Rastreamento de Transações (Distributed Tracing):**
    *   Passagem do `trace_id` nos cabeçalhos HTTP do frontend para o backend, permitindo mapear uma transação de ponta a ponta.
*   **Monitoramento de Banco de Dados:**
    *   Tempo de execução das queries SQLAlchemy.
    *   Identificação de gargalos (N+1 queries) em relatórios históricos de glicemia de crianças.
*   **Monitoramento de IA (RAG & DeepSeek):**
    *   Tempo de latência da chamada da API do DeepSeek (médias de latência para os modelos `deepseek-chat` e `deepseek-reasoner`).
    *   Tempo de busca e recuperação vetorial no ChromaDB.

---

## 4. Métricas Importantes (KPIs Operacionais)

As seguintes métricas devem ser coletadas no Render e Supabase e visualizadas em painéis (Dashboards do Render/Grafana):

| Métrica | Tipo | Descrição | Alvo Tolerável |
| :--- | :--- | :--- | :--- |
| **Uptime Global** | Percentual | Disponibilidade do serviço Backend (Render) e Banco (Supabase). | $\ge 99.9\%$ |
| **Latência HTTP (p95)** | Tempo | Tempo de resposta para 95% das requisições REST comuns. | $< 200\text{ ms}$ |
| **Latência IA (p95)** | Tempo | Tempo de resposta das requisições no endpoint `/chat`. | $< 4.0\text{ s}$ |
| **Taxa de Erro (5xx)** | Percentual | Proporção de requisições HTTP que resultam em erro interno do servidor. | $< 0.1\%$ |
| **Utilização de CPU/Memória** | Percentual | Consumo nos containers do Render. | Limite crítico: $85\%$ |
| **Conexões do Banco** | Número | Quantidade de conexões ativas no pool do Supabase. | Máx $80\%$ do teto |
| **Taxa de Acerto do Cache** | Percentual | Reutilização de queries no banco de dados. | $\ge 80\%$ |
| **Similaridade Média do RAG** | Métrica | Similaridade por cosseno média dos chunks do ChromaDB recuperados. | $\ge 0.70$ |
| **Fallback Rate** | Percentual | Frequência em que as respostas caem na mensagem de fallback seguro da IA. | $< 5\%$ das queries |
