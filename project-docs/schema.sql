-- DDL PostgreSQL Schema - Diabetes Guardian AI (Prompt 3)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabela de Usuários (Responsáveis)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- 2. Tabela de Crianças
CREATE TABLE children (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    name VARCHAR(255) NOT NULL,
    birth_date DATE NOT NULL,
    weight_kg NUMERIC(5,2),
    diagnosis_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- 3. Tabela Base de Medicamentos (Insumos/Insulinas)
CREATE TABLE medications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    manufacturer VARCHAR(255),
    type VARCHAR(100) NOT NULL, -- Ex: 'INSULINA_RAPIDA', 'INSULINA_LENTA', 'OUTRO'
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- 4. Tabela de Agendamento/Configuração de Dosagens de Medicamentos
CREATE TABLE medication_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    medication_id UUID NOT NULL REFERENCES medications(id) ON DELETE RESTRICT,
    dose_amount NUMERIC(5,2) NOT NULL, -- Dose em unidades ou mg
    scheduled_time TIME NOT NULL,
    relation_carbs NUMERIC(5,2),       -- Ex: 1 unidade para cada X gramas de carboidrato
    sensitivity_factor NUMERIC(5,2),  -- Fator de sensibilidade (1 unidade baixa X mg/dL)
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- 5. Tabela de Log/Registro de Aplicação dos Medicamentos
CREATE TABLE medication_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    schedule_id UUID REFERENCES medication_schedules(id) ON DELETE SET NULL,
    child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    medication_id UUID NOT NULL REFERENCES medications(id) ON DELETE RESTRICT,
    actual_dose NUMERIC(5,2) NOT NULL,
    taken_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) NOT NULL, -- 'TOMADO', 'ESQUECIDO', 'CANCELADO'
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- 6. Tabela de Consultas Médicas
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    professional_name VARCHAR(255) NOT NULL,
    specialty VARCHAR(100) NOT NULL, -- Ex: 'ENDOCRINOLOGISTA_PEDIATRICO', 'NUTRICIONISTA'
    appointment_at TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(50) NOT NULL, -- 'AGENDADO', 'CONCLUIDO', 'CANCELADO', 'REAGENDADO'
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- 7. Histórico de Alterações de Consultas (Auditoria)
CREATE TABLE appointment_histories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
    previous_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    previous_time TIMESTAMP WITH TIME ZONE,
    new_time TIMESTAMP WITH TIME ZONE NOT NULL,
    reason TEXT,
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Tabela de Exames Solicitados
CREATE TABLE exams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL, -- Ex: 'Hemoglobina Glicada HbA1c', 'Perfil Lipídico'
    requested_by VARCHAR(255),
    requested_at DATE NOT NULL,
    due_at DATE,
    status VARCHAR(50) NOT NULL, -- 'PENDENTE', 'REALIZADO', 'ATRAZADO'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- 9. Tabela de Resultados de Exames
CREATE TABLE exam_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    result_value NUMERIC(10,3) NOT NULL, -- Valor numérico do exame
    unit VARCHAR(50) NOT NULL,           -- Ex: '%', 'mg/dL'
    reference_range VARCHAR(100),
    is_normal BOOLEAN DEFAULT TRUE,
    realized_at DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- 10. Tabela de Registro Glicêmico e Nutricional Diário
CREATE TABLE glucose_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    glucose_value INTEGER NOT NULL,          -- Valor da glicose em mg/dL
    measurement_type VARCHAR(50) NOT NULL,   -- 'CAPILAR' ou 'SENSOR'
    carbs_grams INTEGER,                     -- Quantidade de carboidratos em gramas
    bolus_correction NUMERIC(5,2),           -- Insulina rápida aplicada para correção
    bolus_food NUMERIC(5,2),                 -- Insulina rápida aplicada para alimentação
    activity_intensity VARCHAR(50),          -- 'NENHUMA', 'LEVE', 'MODERADA', 'INTENSA'
    notes TEXT,
    recorded_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- 11. Tabela de Contatos de Emergência
CREATE TABLE emergency_contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    relationship VARCHAR(100) NOT NULL, -- Ex: 'MEDICO', 'PAI', 'ESCOLA', 'AVO'
    phone VARCHAR(50) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- 12. Tabela de Notificações
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    child_id UUID REFERENCES children(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,         -- 'MEDICAMENTO', 'CONSULTA', 'ALERTA_GLICEMIA', 'SISTEMA'
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) NOT NULL,       -- 'PENDENTE', 'ENVIADO', 'FALHOU', 'CANCELADO'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. Sessões de Chat com a IA
CREATE TABLE chat_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) DEFAULT 'Nova Conversa',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- 14. Mensagens do Chat com a IA
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
    sender VARCHAR(50) NOT NULL,  -- 'USER' ou 'AI'
    message_text TEXT NOT NULL,
    confidence_score NUMERIC(5,2), -- Nível de confiança da IA (ex: 95.50)
    citations TEXT[],              -- Lista de referências das fontes utilizadas
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 15. Documentos Gerais da Base de Conhecimento RAG
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    filename VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    source_organization VARCHAR(150), -- 'ISPAD', 'ADA', 'SBD', 'MS'
    file_hash VARCHAR(64) NOT NULL,   -- MD5/SHA256 para checar modificações
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- 16. Chunks do RAG Indexados
CREATE TABLE document_chunks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    chunk_index INTEGER NOT NULL,
    content TEXT NOT NULL,
    vector_id VARCHAR(100) NOT NULL, -- ID correspondente no ChromaDB
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 17. Tabela de Auditoria de Alterações de Configurações de Medicamentos
CREATE TABLE medication_schedule_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    schedule_id UUID NOT NULL,
    child_id UUID NOT NULL,
    action VARCHAR(50) NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
    old_dose NUMERIC(5,2),
    new_dose NUMERIC(5,2),
    old_time TIME,
    new_time TIME,
    changed_by_user_id UUID,
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- ==========================================
-- Índices para Otimização de Performance
-- ==========================================

-- Índices de chaves estrangeiras comuns
CREATE INDEX idx_children_user_id ON children(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_med_schedules_child_id ON medication_schedules(child_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_med_logs_child_id ON medication_logs(child_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_appointments_child_id ON appointments(child_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_exams_child_id ON exams(child_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_glucose_records_child_id ON glucose_records(child_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_status_scheduled ON notifications(status, scheduled_at);
CREATE INDEX idx_chat_messages_session_id ON chat_messages(session_id);

-- Índices para buscas clínicas temporais comuns (ex: gráficos e relatórios)
CREATE INDEX idx_glucose_records_child_date ON glucose_records(child_id, recorded_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_med_logs_child_taken ON medication_logs(child_id, taken_at DESC) WHERE deleted_at IS NULL;


-- ==========================================
-- Triggers de Auditoria Automática
-- ==========================================

-- Função de trigger para logar alterações de dosagens de medicamentos
CREATE OR REPLACE FUNCTION audit_medication_schedule_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO medication_schedule_audit_logs (schedule_id, child_id, action, new_dose, new_time)
        VALUES (NEW.id, NEW.child_id, 'INSERT', NEW.dose_amount, NEW.scheduled_time);
        RETURN NEW;
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO medication_schedule_audit_logs (schedule_id, child_id, action, old_dose, new_dose, old_time, new_time)
        VALUES (NEW.id, NEW.child_id, 'UPDATE', OLD.dose_amount, NEW.dose_amount, OLD.scheduled_time, NEW.scheduled_time);
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO medication_schedule_audit_logs (schedule_id, child_id, action, old_dose, old_time)
        VALUES (OLD.id, OLD.child_id, 'DELETE', OLD.dose_amount, OLD.scheduled_time);
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Vinculação do trigger à tabela medication_schedules
CREATE TRIGGER trg_audit_medication_schedule
AFTER INSERT OR UPDATE OR DELETE ON medication_schedules
FOR EACH ROW EXECUTE FUNCTION audit_medication_schedule_changes();
