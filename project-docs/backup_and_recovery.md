# Estratégia de Backup e Recuperação de Desastres

A preservação dos registros glicêmicos e parâmetros clínicos gerenciados pelo **Diabetes Guardian AI** é vital. Uma perda de dados afeta o rastreio da saúde de crianças e a tomada de decisão médica. O plano de *Backup e Disaster Recovery* (DR) baseia-se na resiliência do Supabase e rotinas de salvaguarda de infraestrutura.

---

## 1. Estratégia de Backup de Banco de Dados

O banco de dados PostgreSQL rodando na infraestrutura do Supabase utilizará duas camadas de backup integradas:

*   **Backup Lógico Diário (Automático):** Retrato completo dos dados, com execução diária em horários de menor tráfego de uso (madrugada).
*   **Recuperação Point-in-Time (PITR):** Em caso de falha crítica (ex: drop de tabelas indevido), o PITR permite "voltar no tempo" o banco de dados até uma fração de segundos antes do incidente. Essa estratégia arquiva continuamente os logs de transações (WAL - Write-Ahead Logs).

### Parâmetros de Retenção
*   **Frequência Completa:** A cada 24 horas.
*   **Retenção Diária Padrão:** 7 dias (ambiente de staging) e 30 dias contínuos de arquivo (produção).
*   **Arquivamento Externo Mensal (Cold Storage):** No 1º dia de cada mês, um dump lógico seguro e criptografado (`pg_dump`) será enviado para um bucket da AWS S3 (Glacier) com retenção de 5 anos para conformidade legal/médica.

---

## 2. Backup do Banco de Dados Vetorial (ChromaDB)

Diferente do PostgreSQL, os vetores de RAG do ChromaDB podem ser recriados reprocessando os guias médicos a qualquer momento (Pipeline de Ingestão). Contudo, para não onerar APIs de Embeddings em incidentes, aplica-se a estratégia:
*   **Snapshots Baseados em Arquivos:** O banco do Chroma utiliza persistência em diretórios/volumes montados (`CHROMA_DB_PATH`).
*   **Backup Diário do Volume:** Via script ou snapshot de disco Cloud, copiando o diretório binário de persistência vetorial caso o host principal falhe.

---

## 3. Recuperação de Desastre (Disaster Recovery - DR)

O RTO (Recovery Time Objective) projetado para o aplicativo é de **4 horas** e o RPO (Recovery Point Objective) de **menos de 5 minutos** (graças ao PITR).

### A. Falha Zonal no Supabase / PostgreSQL
1.  **Read Replicas:** Em cenários futuros de alta demanda, provisionar réplicas de leitura em outras zonas geográficas. O tráfego de leitura de consultas pode ser redirecionado para a réplica enquanto a master é recuperada.
2.  **Restauração de Instância (Procedimento):**
    *   No Painel de Projeto do Supabase, navegar para _Database > Backups > PITR_.
    *   Selecionar o instante temporal ou o backup diário mais recente.
    *   Iniciar restauração (ocorre em instâncias isoladas, trocando a base na finalização do processo).

### B. Falha no Servidor de Backend ou RAG (APIs)
A infraestrutura (FastAPI) é inteiramente *stateless* (sem estado local persistente crítico).
*   **Recuperação via CI/CD:** O deploy será totalmente automatizado. Em caso de queda do provedor do backend, basta re-executar os workflows de deploy em uma nova VPC com as credenciais ambientais injetadas a partir de outro serviço Cloud.

---

## 4. Testes de Restauração (Drill Tests)

Testes de integridade de backups e planos de restauração devem ser executados e auditados a cada **3 meses**. Um script agendado deve restaurar um backup de produção para o ambiente de *staging* temporariamente e rodar queries de verificação clínica de integridade.
