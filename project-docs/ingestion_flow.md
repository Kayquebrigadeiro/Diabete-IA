# Fluxo de Ingestão de Documentos - Diabetes Guardian AI (Prompt 2)

Este documento detalha as etapas de processamento, limpeza, divisão em partes (chunking), enriquecimento de metadados e persistência dos documentos médicos na base de dados vetorial.

---

## 1. Passo a Passo do Pipeline de Ingestão

O pipeline roda de forma automatizada via script em lote (`scripts/ingest_docs.py`), seguindo o fluxo abaixo:

```
[Pasta de Entrada: docs/]
         │
         ▼
[1. Leitura & Extração] ──► PDF (PyPDF2/pdfplumber) ou Markdown (Mistune)
         │
         ▼
[2. Limpeza de Texto] ───► Remoção de cabeçalhos repetidos, caracteres inválidos e normalização
         │
         ▼
[3. Chunking Dinâmico] ──► RecursiveCharacterTextSplitter (Tamanho e overlap baseado em Categoria)
         │
         ▼
[4. Metadados Tagging] ──► Injeção de Tags (Fonte, Seção, Relevância, Urgência, Autor)
         │
         ▼
[5. Embeddings API] ─────► Envio dos blocos para o modelo de representação vetorial
         │
         ▼
[6. Gravação ChromaDB] ──► Persistência e geração dos índices HNSW (Hierarchical Navigable Small World)
```

---

## 2. Processo de Chunking e Enriquecimento de Metadados

### 2.1 Critérios de Divisão do Texto
Para preservar o sentido lógico, o fatiamento utiliza separadores lógicos na seguinte ordem de prioridade:
1.  Quebras de seção markdown (`#`, `##`, `###`)
2.  Parágrafos duplos (`\n\n`)
3.  Sentenças (`. `)
4.  Espaços (` `)

### 2.2 Estrutura do Dicionário de Metadados
Cada chunk gerado é indexado acompanhado de um dicionário JSON estruturado:

```json
{
  "document_id": "guiadeconhecimento_ch10",
  "filename": "guiadeconhecimento.md",
  "source_tier": 1,
  "chapter_name": "Hipoglicemia",
  "clinical_citation": "Sociedade Brasileira de Diabetes (SBD, 2025)",
  "urgency_level": "CRITICAL",
  "chunk_index": 14
}
```

---

## 3. Estratégia de Embeddings e Armazenamento Vetorial

*   **Modelo de Embeddings:** API do DeepSeek ou OpenAI (como fallback local de teste, embeddings HuggingFace SentenceTransformers `all-MiniLM-L6-v2` em português).
*   **ChromaDB Setup:**
    *   Persistido em pasta local no backend (`backend/data/chroma_db`).
    *   Uso de cálculo de distância por **Cosseno** para busca semântica, permitindo melhor resiliência em buscas por sinônimos e perguntas indiretas elaboradas pelos pais.
*   **Atualização de Documentos:**
    *   Controle por hash MD5: O script verifica o hash MD5 de cada arquivo na pasta física de entrada. O arquivo só é reprocessado se houver alteração de conteúdo, prevenindo duplicações indesejadas no ChromaDB.
