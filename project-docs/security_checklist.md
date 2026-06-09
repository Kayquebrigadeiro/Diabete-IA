# Checklist de Segurança - Diabetes Guardian AI (Prompt 7)

Este documento estabelece o guia e checklist de segurança obrigatório para a plataforma **Diabetes Guardian AI**, protegendo dados de saúde de menores e o acesso à infraestrutura e IA.

---

## 1. Controle de Acesso e Autenticação (JWT)

- [ ] **Expiração Curta dos Tokens:** O tempo de expiração do `Access Token` JWT deve ser estritamente curto (recomendado: 15 minutos).
- [ ] **Armazenamento Seguro do Refresh Token:** O `Refresh Token` (validade recomendada: 7 dias) deve ser armazenado exclusivamente em cookies HTTP-Only, Secure, SameSite=Strict para mitigar ataques XSS.
- [ ] **Algoritmo de Assinatura Forte:** Utilizar exclusivamente o algoritmo `HS256` ou superior para assinatura dos tokens JWT, com chave secreta gerada via gerador criptográfico forte de no mínimo 32 bytes (256 bits).
- [ ] **Revogação de Tokens (Blacklist/Logout):** Implementar persistência rápida (ex: tabela dedicada no banco de dados com expiração automática) para invalidar tokens de logout antes de expirarem.
- [ ] **Criptografia de Senhas:** Armazenar senhas no banco de dados utilizando hash `bcrypt` (via `passlib`) com fator de trabalho (work factor) mínimo de 12.

---

## 2. Segurança de Rede e Comunicação

- [ ] **HTTPS Estrito:** Configurar SSL/TLS 1.3 obrigatório em todos os endpoints na Vercel e Render. Redirecionar automaticamente tráfego HTTP para HTTPS (HTTP Strict Transport Security - HSTS).
- [ ] **CORS Restrito:** No FastAPI, configurar o middleware CORS apenas para origens explícitas (e.g., domínio de produção da Vercel). O uso de `allow_origins=["*"]` é terminantemente proibido em ambiente de produção.
- [ ] **Segurança de Cabeçalhos HTTP:** Configurar cabeçalhos de segurança básicos (X-Content-Type-Options: nosniff, X-Frame-Options: DENY, Content-Security-Policy).

---

## 3. Rate Limiting e Prevenção de Abuso

- [ ] **Rate Limiting por Rota:**
    - Rotas críticas de autenticação (`/auth/login`, `/auth/register`): Máximo de 5 requisições por minuto por IP.
    - Endpoints de consulta à IA (`/chat/sessions/{id}/messages`): Máximo de 15 requisições por minuto por usuário (para evitar custos excessivos com a API DeepSeek e exaustão do ChromaDB).
    - Rotas padrão de leitura e escrita: Máximo de 100 requisições por minuto por IP/Token.
- [ ] **Middleware de Resiliência:** Bloquear conexões após atingir limites severos temporariamente com o código HTTP `429 Too Many Requests`.

---

## 4. Proteção no Uso da Inteligência Artificial (DeepSeek / RAG)

- [ ] **Sanitização de Input (Prompt Injection):** Aplicar rotinas de sanitização nas entradas enviadas pelos usuários no chat para remover caracteres de controle e termos projetados para contornar as instruções do sistema (*system prompt jailbreaking*).
- [ ] **Teto Orçamentário e Limites da API:** Configurar alertas de faturamento e limites diários de consumo rígidos no painel da API do DeepSeek para evitar picos inesperados causados por loops infinitos ou ataques de negação de serviço.
- [ ] **Validação do Score RAG (Similaridade):** Garantir que respostas da IA com similaridade inferior a `0.70` acionem automaticamente a mensagem de fallback seguro pré-definida, prevenindo alucinações de dosagem de insulina.
- [ ] **Segurança de API Key:** Armazenar a `DEEPSEEK_API_KEY` apenas como variável de ambiente criptografada no Render, nunca em repositórios de código.

---

## 5. Proteção contra Upload Malicioso

- [ ] **Validação Estrita de Extensões:** Permitir exclusivamente arquivos `.pdf` e `.md` no upload de documentos científicos para a base de conhecimento.
- [ ] **Verificação de Magic Bytes:** Não validar arquivos apenas por extensão; ler os primeiros bytes do cabeçalho para comprovar que é um PDF válido (`%PDF-`).
- [ ] **Limite de Tamanho (Payload Limit):** Limitar o tamanho máximo do upload de arquivos para $10\text{ MB}$ por arquivo via middleware do FastAPI para prevenir ataques de consumo de disco/memória.

---

## 6. Privacidade e Segurança de Dados Sensíveis (LGPD / HIPAA Compliance)

- [ ] **Anonimização de Logs:** Nunca incluir registros médicos do paciente (glicemias, insulinas), dados pessoais completos ou payloads confidenciais nos arquivos de logs do sistema.
- [ ] **Isolamento Multitenancy:** Garantir que todas as consultas ao banco pelo SQLAlchemy apliquem um escopo de `WHERE user_id = {auth_id}`, impedindo que um usuário visualize dados clínicos de crianças associadas a terceiros.
- [ ] **Criptografia de Dados em Repouso:** Garantir que todos os dados persistidos no banco de dados relacional e nos backups estejam criptografados (ativar criptografia nativa oferecida pelo Supabase).

---

## 7. Segurança do Banco de Dados (PostgreSQL / Supabase)

- [ ] **Políticas Row-Level Security (RLS):** Ativar RLS em todas as tabelas críticas do Supabase para impedir acessos bypass mesmo se as credenciais de leitura/escrita vazarem.
- [ ] **Mínimo Privilégio:** A credencial de conexão da aplicação FastAPI no Supabase não deve possuir privilégios de superusuário (`postgres`), utilizando uma role com permissões estritas apenas para operações de DML normais da aplicação.
- [ ] **Connection Pooling Criptografado:** Utilizar strings de conexão seguras e pooling criptografado em produção (`pgbouncer` ou nativo do Supabase com SSL habilitado).
