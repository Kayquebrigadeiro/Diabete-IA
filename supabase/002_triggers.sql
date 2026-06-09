-- Diabetes Guardian AI
-- Trigger helpers for Supabase/PostgreSQL

BEGIN;

CREATE OR REPLACE FUNCTION touch_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_touch_users_updated_at ON users;
CREATE TRIGGER trg_touch_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

DROP TRIGGER IF EXISTS trg_touch_children_updated_at ON children;
CREATE TRIGGER trg_touch_children_updated_at
BEFORE UPDATE ON children
FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

DROP TRIGGER IF EXISTS trg_touch_medications_updated_at ON medications;
CREATE TRIGGER trg_touch_medications_updated_at
BEFORE UPDATE ON medications
FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

DROP TRIGGER IF EXISTS trg_touch_medication_schedules_updated_at ON medication_schedules;
CREATE TRIGGER trg_touch_medication_schedules_updated_at
BEFORE UPDATE ON medication_schedules
FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

DROP TRIGGER IF EXISTS trg_touch_appointments_updated_at ON appointments;
CREATE TRIGGER trg_touch_appointments_updated_at
BEFORE UPDATE ON appointments
FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

DROP TRIGGER IF EXISTS trg_touch_exams_updated_at ON exams;
CREATE TRIGGER trg_touch_exams_updated_at
BEFORE UPDATE ON exams
FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

DROP TRIGGER IF EXISTS trg_touch_notifications_updated_at ON notifications;
CREATE TRIGGER trg_touch_notifications_updated_at
BEFORE UPDATE ON notifications
FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

DROP TRIGGER IF EXISTS trg_touch_chat_sessions_updated_at ON chat_sessions;
CREATE TRIGGER trg_touch_chat_sessions_updated_at
BEFORE UPDATE ON chat_sessions
FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

DROP TRIGGER IF EXISTS trg_touch_documents_updated_at ON documents;
CREATE TRIGGER trg_touch_documents_updated_at
BEFORE UPDATE ON documents
FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

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

DROP TRIGGER IF EXISTS trg_audit_medication_schedule ON medication_schedules;
CREATE TRIGGER trg_audit_medication_schedule
AFTER INSERT OR UPDATE OR DELETE ON medication_schedules
FOR EACH ROW EXECUTE FUNCTION audit_medication_schedule_changes();

COMMIT;

