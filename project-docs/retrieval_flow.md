# Fluxo de Consulta e Recuperação (Retrieval) - Diabetes Guardian AI (Prompt 2)

Este documento detalha o ciclo de vida de uma consulta realizada pelo usuário no assistente virtual, desde a chegada da mensagem até a formatação final da resposta com citações e níveis de confiança.

---

## 1. Fluxo de Execução da Consulta (Passo a Passo)

Quando um cuidador envia uma mensagem na interface de chat, a RAG Engine executa as seguintes etapas:

```
[Pergunta do Usuário]
         │
         ▼
[1. Pré-processamento e Expansão] ──► Extração de palavras-chave, tratamento de abreviações (ex: "glic")
         │
         ▼
[2. Filtro de Segurança Inicial] ───► Detecção de mensagens de pânico (ex: "desmaiou", "convulsão")
         │                            ↳ Se detectado: Injeta protocolo de emergência imediato (ligue SAMU 192)
         ▼
[3. Recuperação Híbrida] ──────────► Busca Vetorial (ChromaDB) + Busca de Palavra-chave (BM25)
         │
         ▼
[4. Reranking (Re-ranqueamento)] ──► Avaliação por Cross-Encoder (filtra os top 4 chunks mais relevantes)
         │
         ▼
[5. Engenharia de Prompt] ─────────► Combina: Diretrizes do Assistente + Contexto Recuperado + Pergunta
         │
         ▼
[6. Chamada LLM (DeepSeek)] ───────► Geração da resposta estruturada com referências
         │
         ▼
[7. Pós-processamento e Citação] ──► Extração de [citações] e cálculo da pontuação de confiança
         │
         ▼
[Interface do Usuário] ────────────► Renderização da resposta com tags visuais, alertas e links das fontes
```

---

## 2. Busca Híbrida e Reranking

Para obter a maior precisão possível no suporte pediátrico, o sistema não depende exclusivamente de busca vetorial:

1.  **Busca Híbrida (Vector + BM25):**
    *   **Busca Vetorial:** Captura a intenção semântica da pergunta (ex: "está sonolento" $\approx$ hipoglicemia grave).
    *   **Busca BM25 (Léxica):** Garante a recuperação exata de termos específicos de dosagens ou marcas de medicamentos (ex: "Tresiba", "Fiasp", "Humalog").
2.  **Reranking (Cross-Encoder):**
    *   Os chunks resultantes de ambos os métodos de busca são passados por um modelo leve de re-ranqueamento local (`cohere-rerank` ou similar open-source como `ms-marco-MiniLM`).
    *   Elimina chunks redundantes e garante que os 3 blocos mais informativos fiquem no topo da janela de contexto da LLM.

---

## 3. Estruturação do Prompt de Contexto (Prompt Engineering)

O prompt enviado para a API do DeepSeek é estruturado rigidamente para evitar desvios:

```text
[INSTRUÇÃO DE SEGURANÇA CRÍTICA]
Você é o assistente virtual Diabetes Guardian AI. Seu dever é ajudar familiares no manejo do diabetes tipo 1 infantil de forma acolhedora, precisa e estritamente segura.

[CONTEXTO RECUPERADO]
---
DOCUMENTO: {source_name}
CITAÇÃO CLÍNICA: {clinical_citation}
CONTEÚDO: {chunk_text}
---

[REGRAS DE RESPOSTA]
1. Responda à pergunta do usuário utilizando APENAS as informações presentes no CONTEXTO acima.
2. Se a resposta não estiver descrita no contexto, diga claramente que não possui essa informação.
3. Para cada instrução ou afirmação terapêutica, inclua a citação ao final da frase usando o formato [Nome do Documento].
4. Se o usuário relatar sintomas de gravidade (perda de consciência, convulsão, respiração ofegante contínua), inicie a resposta em NEGRITO e CAIXA ALTA indicando que eles devem acionar o serviço de emergência (SAMU 192 ou pronto-socorro) imediatamente.

[PERGUNTA DO USUÁRIO]
{user_query}
```

---

## 4. Geração de Citações na Interface

As citações inseridas pela LLM no formato `[Nome do Documento]` são interceptadas pelo parser do frontend e renderizadas como links interativos. Ao clicar, o painel lateral abre mostrando o trecho exato correspondente no documento da base de conhecimento, fortalecendo a relação de transparência e confiabilidade com a família.
