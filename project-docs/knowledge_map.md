# Mapa de Conhecimento - Diabetes Guardian AI (Prompt 0)

Este documento mapeia os conteúdos da base de conhecimento do projeto **Diabetes Guardian AI** em categorias específicas, detalhando as fontes onde cada assunto é abordado e identificando duplicações e sinergias.

## 1. Organização por Categorias Temáticas

### 1.1 Diagnóstico e Apresentação Inicial
*   **Fontes:** *Guia de Conhecimento* (Cap. 3), *ISPAD Chapter 12*, *PCDT do Ministério da Saúde*.
*   **Conteúdo:** Sintomas clássicos (Poliúria, Polidipsia, Polifagia, Perda de peso), exames confirmatórios (Glicemia de jejum, Curva glicêmica, Hemoglobina Glicada HbA1c, Autoanticorpos anti-ilhota/anti-GAD).

### 1.2 Aplicação e Tipos de Insulina
*   **Fontes:** *Guia para Pais* (Seções 2 e 3), *Guia de Conhecimento* (Cap. 4, 5, 6, 7), *ISPAD Chapters 9/17 (2024)*, *PCDT*.
*   **Conteúdo:** 
    *   **Tipos:** Ultrarrápida (Aspart, Lispro, Glulisina), Rápida (Regular), Intermediária (NPH), Lenta/Ultralenta (Glargina U100/U300, Detemir, Degludeca).
    *   **Técnica:** Ângulos de aplicação, prega cutânea, rodízio de locais para evitar lipo-hipertrofia, armazenamento e conservação da insulina.

### 1.3 Monitoramento Glicêmico
*   **Fontes:** *Guia para Pais* (Seção 4), *Guia de Conhecimento* (Cap. 8, 9), *ISPAD Chapter 21 (Technologies)*.
*   **Conteúdo:** Automonitoramento capilar (pontas de dedo), metas glicêmicas pré e pós-prandiais, Sensores de Glicose Contínua (CGM/Libre) e metas de tempo no alvo (Time in Range > 70%).

### 1.4 Complicações Agudas (Hipoglicemia, Hiperglicemia e CAD)
*   **Fontes:** *Guia para Pais* (Seções 5 e 6), *Guia de Conhecimento* (Cap. 10, 11, 12), *ISPAD Chapter 12*.
*   **Conteúdo:**
    *   **Hipoglicemia (< 70 mg/dL):** Sinais leves/moderados (suor frio, tremores, fome) e graves (desorientação, convulsão). Tratamento com a Regra dos 15g de carboidratos rápidos e aplicação de Glucagon.
    *   **Hiperglicemia (> 250 mg/dL) e Cetoacidose (CAD):** Sinais de alerta (hálito cetônico, dor abdominal, náuseas, respiração de Kussmaul). Medição de cetonas no sangue ou urina.

### 1.5 Nutrição e Atividade Física
*   **Fontes:** *Guia para Pais* (Seções 8 e 9), *Guia de Conhecimento* (Cap. 13, 14).
*   **Conteúdo:** Contagem de carboidratos, relação insulina/carboidrato, fator de sensibilidade, ajustes de dose basal e bolus para atividades aeróbicas e anaeróbicas para evitar hipoglicemia tardia.

### 1.6 Escola, Viagens e Dias de Doença
*   **Fontes:** *Guia para Pais* (Seção 10), *Guia de Conhecimento* (Cap. 15, 16, 17), *Material Extra (Escola ADA)*.
*   **Conteúdo:** Kit escolar, plano de ação para professores, cuidados ao viajar de avião (transporte de insumos na mala de mão, receitas em inglês), regra para dias de infecção/febre (ajuste de basal e monitoramento rigoroso de cetonas).

### 1.7 Tecnologias e Bombas de Insulina
*   **Fontes:** *Material Extra*, *ISPAD Chapter 21 (Technologies)*, *Guia de Conhecimento* (Cap. 21, 22, 23).
*   **Conteúdo:** Bombas de infusão contínua de insulina (CSII), sensores integrados de alça fechada (AID - Artificial Intelligence/Automated Insulin Delivery), alarmes e calibrações.

### 1.8 Saúde Mental, Educação Familiar e Direitos no SUS
*   **Fontes:** *Guia de Conhecimento* (Cap. 20), *ISPAD Chapter 6 (Education)*, *PCDT*.
*   **Conteúdo:** Acolhimento pós-diagnóstico, burnout do cuidador, autonomia da criança na escola, acesso a medicamentos essenciais através das farmácias de alto custo do SUS.

---

## 2. Conteúdos Duplicados e Sinergias

*   **Duplicação Positiva (Emergências):** A regra dos 15g para correção de hipoglicemia é explicada de forma idêntica em três fontes distintas (*Guia para Pais*, *Guia de Conhecimento* e manuais do *Ministério da Saúde*). O RAG deve unificar essa resposta sob a forma de um protocolo único de "Ação Rápida".
*   **Duplicação de Tabelas Glicêmicas:** As tabelas de metas glicêmicas da SBD (Sociedade Brasileira de Diabetes) no *Material Extra* coincidem com as da ADA/ISPAD 2024. O RAG priorizará as metas nacionais da SBD por refletirem a prática clínica adotada no Brasil.

## 3. Principais Sinergias para Resposta da IA
O assistente de IA utilizará o *Guia de Conhecimento* para estruturar conceitualmente a resposta (definições técnicas) e o *Guia para Pais* para gerar as orientações práticas em formato de tópicos amigáveis e acolhedores para os pais.
