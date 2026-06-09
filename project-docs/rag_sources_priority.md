# Matriz de Prioridade de Fontes para RAG - Diabetes Guardian AI (Prompt 0)

Este documento define a estratégia de indexação vetorial, divisão em pedaços (chunking), classificação de relevância e metadados das fontes da base de conhecimento do assistente de IA.

## 1. Matriz de Relevância por Nível de Prioridade

| Tiers | Documento | Categoria Principal | Prioridade | Utilidade Principal para o Assistente RAG |
|---|---|---|---|---|
| **Tier 1 (Máxima)** | `guiadeconhecimento.md` | Enciclopédia Geral | Crítica | Estruturação de respostas gerais, explicações simplificadas e tratamento de FAQs de suporte diário. |
| **Tier 1 (Máxima)** | `GUIA COMPLETO PARA PAIS...md` | Educação Prática | Crítica | Respostas rápidas e tutoriais passo a passo sobre aplicação, contagem de carboidratos e primeiros socorros. |
| **Tier 1 (Máxima)** | `MATERIAL EXTRA.MD` | Metas e SUS | Alta | Resolução de dúvidas legais sobre direitos no SUS e as metas glicêmicas brasileiras de 2024-2025. |
| **Tier 2 (Alta)** | `protocolo_clinico_terapeuticas...pdf` | Legislação SUS | Alta | Base jurídica e critérios formais para dispensação de insulinas de alto custo. |
| **Tier 2 (Alta)** | `CPCG2018-Ch-21-Technologies.pdf` | Tecnologia | Média-Alta | Explicações profundas e comparação técnica de sensores de glicose (CGM) e bombas de insulina. |
| **Tier 2 (Alta)** | `Ch12-PediatricDiabetes.pdf` | Medicina Clínica | Média | Aprofundamento científico e validação das diretrizes internacionais de diagnóstico infantil. |
| **Tier 3 (Média/Baixa)**| Demais Manuais do Ministério da Saúde | Políticas Públicas | Média-Baixa | Histórico de ações e contexto geral de atenção básica em diabetes. |

---

## 2. Estratégia de Segmentação de Texto (Chunking)

Os documentos serão particionados de acordo com sua criticidade e tipo de conteúdo para garantir que respostas urgentes sejam recuperadas com rapidez e alta precisão.

### 2.1 Chunking para Protocolos de Emergência (Hipoglicemia grave, Cetoacidose, Emergências)
*   **Tamanho:** 1000 tokens (tamanho maior para preservar todo o contexto imediato de primeiros socorros).
*   **Overlap:** 200 tokens (intersecção para evitar que informações de dosagem ou de sintomas fiquem isoladas).
*   **Estratégia:** Divisão por marcadores específicos de Categoria. Seções marcadas com `# Emergências` ou `# Sinais de Alerta` no Guia de Conhecimento serão indexadas juntas.

### 2.2 Chunking para Temas Práticos (Aplicação de insulina, Contagem de carboidratos, Escola)
*   **Tamanho:** 700 tokens.
*   **Overlap:** 100 tokens.
*   **Estratégia:** Divisão por cabeçalhos markdown (`###`).

### 2.3 Chunking para Referências Científicas/Legais (PCDT, ISPAD)
*   **Tamanho:** 600 tokens.
*   **Overlap:** 50 tokens.
*   **Estratégia:** Focado em tabelas e parágrafos normativos para citações precisas.

---

## 3. Esquema de Metadados Obrigatórios para Indexação
Cada fragmento de texto (chunk) inserido no banco vetorial (ChromaDB) conterá os seguintes metadados estruturados:

```json
{
  "source": "guiadeconhecimento.md",
  "category": "hipoglicemia",
  "priority_tier": "tier_1",
  "language": "pt-br",
  "complexity": "simplificado",
  "clinical_citation": "SBD 2025 / ISPAD 2024",
  "urgency_level": "alto"
}
```
*Estes metadados permitirão filtragem prévia e posterior no mecanismo de recuperação para evitar que a IA forneça respostas complexas ou acadêmicas quando o usuário precisar de uma instrução simples de emergência.*
