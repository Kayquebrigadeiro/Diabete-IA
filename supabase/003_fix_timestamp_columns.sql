ALTER TABLE medication_logs
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE exams
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE exam_results
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE glucose_records
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE emergency_contacts
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP;

DROP TRIGGER IF EXISTS trg_touch_medication_logs_updated_at ON medication_logs;
CREATE TRIGGER trg_touch_medication_logs_updated_at
BEFORE UPDATE ON medication_logs
FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

DROP TRIGGER IF EXISTS trg_touch_exams_updated_at ON exams;
CREATE TRIGGER trg_touch_exams_updated_at
BEFORE UPDATE ON exams
FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

DROP TRIGGER IF EXISTS trg_touch_exam_results_updated_at ON exam_results;
CREATE TRIGGER trg_touch_exam_results_updated_at
BEFORE UPDATE ON exam_results
FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

DROP TRIGGER IF EXISTS trg_touch_glucose_records_updated_at ON glucose_records;
CREATE TRIGGER trg_touch_glucose_records_updated_at
BEFORE UPDATE ON glucose_records
FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

DROP TRIGGER IF EXISTS trg_touch_emergency_contacts_updated_at ON emergency_contacts;
CREATE TRIGGER trg_touch_emergency_contacts_updated_at
BEFORE UPDATE ON emergency_contacts
FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
