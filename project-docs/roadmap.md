# Roadmap do Projeto - Diabetes Guardian AI (Prompt 1)

Este documento define o cronograma evolutivo de desenvolvimento do projeto, dividido em 4 fases principais, garantindo que a implementação siga as melhores práticas arquiteturais.

---

## Fase 1: Fundação & Modelagem (Semana 1)
*   **Backend:** Configuração do ambiente Python, inicialização do FastAPI, setup do banco de dados PostgreSQL com SQLAlchemy.
*   **Database:** Execução do script `schema.sql`, criação de tabelas, índices e triggers de auditoria.
*   **Frontend:** Setup do projeto React + TypeScript + Vite + Material UI. Configuração do Design System Mobile-First e tokens de estilo compartilháveis.
*   **Casos de Uso Core:** Implementação do CRUD de Usuários (`User`), Crianças (`Child`) e Contatos de Emergência.

## Fase 2: RAG & Assistente de IA (Semanas 2-3)
*   **Ingestão de Dados:** Implementação do pipeline de parsing de PDFs (ISPAD, Ministério da Saúde, SBD), enriquecimento de metadados e armazenamento vetorial no ChromaDB.
*   **Motor de Busca:** Criação dos fluxos de busca vetorial híbrida e reranqueamento de contextos.
*   **Integração LLM:** Conexão com a API da DeepSeek, engenharia de prompts focada em segurança médica e implementação do sistema de cálculo de nível de confiança e citações.
*   **Chat Interface:** Desenvolvimento da interface de conversação no frontend com suporte a streaming de respostas e visualização de referências de documentos.

## Fase 3: Registro Clínico & Logs de Medicamentos (Semanas 4-5)
*   **Módulo Glicêmico:** Implementação de registros de glicemia, ingestão de carboidratos e cálculo sugerido de doses.
*   **Controle de Medicamentos:** Agendamentos de insulinas (`MedicationSchedule`) e logs de doses tomadas ou esquecidas.
*   **Modo Primeiros 30 Dias:** Tela dedicada contendo guias dinâmicos e checklists diários para novos diagnósticos.
*   **Sistema de Notificações:** Mecanismo de disparo de notificações push e alertas baseados no status do agendamento de doses.

## Fase 4: Relatórios & Validação (Semana 6)
*   **Relatórios Clínicos:** Exportação de PDF com gráficos de glicemia (Time in Range), média de testes e uso de insulina para levar às consultas médicas.
*   **Testes e Auditoria:** Cobertura de testes unitários nos cálculos de insulina e segurança do RAG. Validação clínica simulada com endocrinologistas pediátricos.
*   **Preparação para Mobile:** Homologação do layout em múltiplos dispositivos móveis e início do mapeamento de rotas para migração React Native.
