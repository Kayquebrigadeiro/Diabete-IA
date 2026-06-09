# Configuração de Deploy - Frontend (Vercel)

Este documento detalha o setup e a implantação da aplicação web/PWA **Diabetes Guardian AI** na Vercel. A escolha da Vercel justifica-se pelo excelente suporte a projetos React/Vite, Global CDN e CI/CD integrado.

## 1. Configuração do Frontend

A aplicação foi estruturada focada no ecossistema Vite + React, com forte preparação Mobile-First.

- **Framework Preset:** `Vite`
- **Root Directory:** `./` (ou `./frontend` dependendo da estrutura do monorepo).
- **Node.js Version:** `18.x` ou `20.x` configurada nas *Project Settings*.

**Build & Development Commands:**
A Vercel normalmente infere esses comandos automaticamente do `package.json`, mas eles são definidos como:
- **Build Command:** `npm run build` ou `yarn build` (Gera o bundle estático em `/dist`).
- **Install Command:** `npm install` ou `yarn install`.
- **Development Command:** `npm run dev` (Não utilizado em produção, apenas em visualizações locais).
- **Output Directory:** `dist`

## 2. Variáveis de Ambiente (Environment Variables)

A única regra crítica no React/Vite é o prefixo obrigatório `VITE_` para que a variável seja injetada no build *client-side*. Nunca exponha segredos reais (como chaves de banco de dados ou APIs pagas) no frontend.

No painel da Vercel, configure:

| Variável | Ambientes | Descrição | Exemplo |
|---|---|---|---|
| `VITE_API_BASE_URL` | Production, Preview | URL pública da API do backend no Render. | `https://api.diabetesguardian.app/api/v1` |
| `VITE_ENVIRONMENT` | Production, Preview | Sinaliza para o frontend o contexto atual (ajusta logs, Google Analytics, etc). | `production` ou `staging` |

## 3. Integração com a API Backend

A integração com o backend no Render requer as seguintes garantias de segurança e estabilidade configuradas no frontend:

- **CORS Configurado:** O Vercel gerará o domínio de produção (ex: `diabetesguardian.app`). Esse domínio **deve** estar inserido na variável `CORS_ORIGINS` no Render.
- **Requisições Axios:** O `VITE_API_BASE_URL` é a base de todas as chamadas usando a instância configurada do `Axios`. Interceptores no frontend gerenciarão silenciosamente o *Refresh Token*, garantindo que falhas de autenticação no Render causem a renovação automática de acesso antes de rejeitar a view do usuário.
- **WebSocket / Server-Sent Events:** Para o RAG AI Chat, o frontend conectará aos endpoints de streaming da API baseados neste mesmo domínio da Vercel, aproveitando o proxy implícito se houver necessidade de lidar com rotas complexas.

## 4. Ambientes de Desenvolvimento e Produção (CI/CD)

A Vercel brilha na gestão de múltiplos ambientes por branch:

- **Ambiente de Produção (Production):**
  - Acionado por commits ou merges na branch `main`.
  - Associado aos domivos customizados finais (ex: `www.diabetesguardian.app`).
  - Utiliza as variáveis de ambiente estritas de produção conectando ao banco de dados real.

- **Ambiente de Preview (Staging / Development):**
  - Acionado automaticamente pela Vercel em *qualquer* Pull Request ou push em branches secundárias (ex: `feature/chat-rag` ou `develop`).
  - A Vercel gera uma URL efêmera e única (ex: `diabetes-guardian-pr-12.vercel.app`).
  - Essas URLs devem, idealmente, apontar para um Backend Staging (uma cópia do banco e da API feita apenas para testes, utilizando outra URL na variável `VITE_API_BASE_URL`).
  - Permite testes de UI/UX em dispositivos mobile reais antes do merge final.

- **Configurações Adicionais (PWA / Roteamento):**
  - Como é um *Single Page Application* (SPA) baseado no React Router, o servidor Vercel (via arquivo `vercel.json` se necessário) será configurado com a regra de "Rewrites", direcionando todo o tráfego 404 (quando a rota não for um asset) para o `index.html`. Isso garante que *deep links* (ex: acessar diretamente a página `/medicamentos`) funcionem corretamente.

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```
