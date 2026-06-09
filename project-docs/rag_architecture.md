# Arquitetura RAG - Diabetes Guardian AI (Prompt 2)

Este documento detalha o projeto da arquitetura de Geração Aumentada de Recuperação (RAG) para o assistente virtual especializado em Diabetes Tipo 1 infantil, com foco em segurança de dados de saúde, prevenção de alucinações e rastreabilidade científica.

---

## 1. Visão Geral da RAG Pipeline

O sistema utiliza a arquitetura RAG para responder a perguntas de forma embasada na base de conhecimento oficial. A pipeline é dividida em duas fases: Ingestão de Documentos (offline/batch) e Recuperação/Geração (online/realtime).

```mermaid
graph TD
    subgraph Fase Ingestão (Offline)
        Docs[Documentos: ISPAD, MS, SBD] --> Parser[PyPDF / Markdown Parser]
        Parser --> Cleaner[Text Cleaner & Normalizer]
        Cleaner --> Splitter[RecursiveCharacterTextSplitter]
        Splitter --> Embedder[DeepSeek / OpenAI Embeddings]
        Embedder --> VDB[(ChromaDB Vector Store)]
    end

    subgraph Fase Recuperação e Geração (Online)
        Query[Pergunta do Usuário] --> Expander[Expansor de Query / LLM]
        Expander --> VectorSearch[Busca Vetorial por Cosseno]
        VDB --> VectorSearch
        VectorSearch --> Reranker[Reranker / Cross-Encoder]
        Reranker --> Formatter[Formatador de Contexto]
        Formatter --> PromptEngine[Prompt de Contexto + Instruções]
        PromptEngine --> LLM[DeepSeek LLM API]
        LLM --> ParserResposta[Filtro de Alucinação & Extrator de Citações]
        ParserResposta --> Output[Resposta Estruturada + Confiança + Citações]
    end
```

---

## 2. Tecnologias Utilizadas

*   **Python 3.11:** Ambiente de execução assíncrono.
*   **FastAPI:** Exposição da API de chat via WebSocket/Server-Sent Events (SSE).
*   **LangChain / LangGraph:** Framework de orquestração dos agentes e fluxos de RAG.
*   **ChromaDB:** Banco de dados vetorial de alta performance para armazenamento e busca rápida de embeddings em disco.
*   **DeepSeek API:** Modelo de linguagem e embeddings (para representação semântica rica).

---

## 3. Prevenção de Alucinações e Segurança Médica

O Diabetes Guardian AI trata de informações de saúde críticas (DM1 infantil). Erros ou alucinações podem colocar vidas em risco. Para mitigar isso:

1.  **Strict Context Adherence (Prompts Rígidos):** O prompt do sistema proíbe expressamente que a LLM invente dosagens ou diretrizes que não estejam estritamente documentadas no contexto enviado.
2.  **Mapeamento de Citações OBRIGATÓRIO:** A LLM só pode formular uma afirmação terapêutica se atrelada a uma citação do tipo `[Guia Conhecimento, Cap. 10]` ou `[ISPAD 2024, Ch12]`.
3.  **Filtro "Não sei" (Fallback Seguro):** Caso a busca vetorial retorne similaridade abaixo do limite de relevância ($< 0.65$), a IA responderá: 
    > *"Não encontrei informações confiáveis sobre este assunto na minha base de conhecimento oficial. Para sua segurança, recomendo consultar a equipe médica que acompanha a criança."*

---

## 4. Sistema de Cálculo do Nível de Confiança

A resposta final da IA é acompanhada de um nível de confiança, calculado dinamicamente com base nas seguintes variáveis:

*   **Similaridade Média dos Chunks Retornados ($S_{avg}$):** Distância de cosseno dos top 3 chunks (peso de 40%).
*   **Concordância entre Fontes ($C$):** Se a resposta é confirmada por mais de uma fonte de Tier diferente (ex: Guia Pais e ISPAD) (peso de 30%).
*   **Pontuação de Validação da LLM ($V$):** Uma etapa interna avalia em tempo real se a resposta final faz uso correto das informações do contexto sem extrapolações (peso de 30%).

$$Nível\_Confiança = (S_{avg} \times 0.4) + (C \times 0.3) + (V \times 0.3)$$

### Faixas de Exibição
*   **Alta Confiança (Verde - $>90\%$):** Resposta com embasamento total e direto nos guias.
*   **Moderada Confiança (Amarela - $70\% - 90\%$):** Resposta inferida de princípios gerais ou com cobertura parcial. Acompanhada do aviso: *Consulte a equipe médica.*
*   **Baixa/Não Disponível (Cinza - $<70\%$):** Aciona o fallback seguro para evitar alucinações.
