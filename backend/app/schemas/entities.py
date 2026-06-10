from __future__ import annotations

from datetime import date, datetime, time
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator

from app.core.config import get_settings
from app.schemas.common import IDResponse, ORMBaseModel

settings = get_settings()


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone: str | None = None


class UserUpdate(BaseModel):
    name: str | None = None
    email: EmailStr | None = None
    phone: str | None = None


class UserResponse(IDResponse):
    name: str
    email: EmailStr
    phone: str | None = None


class ChildCreate(BaseModel):
    user_id: UUID | None = None
    name: str
    birth_date: date
    weight_kg: float | None = Field(default=None, ge=0)
    diagnosis_date: date | None = None


class ChildUpdate(BaseModel):
    name: str | None = None
    birth_date: date | None = None
    weight_kg: float | None = Field(default=None, ge=0)
    diagnosis_date: date | None = None


class ChildResponse(IDResponse):
    user_id: UUID
    name: str
    birth_date: date
    weight_kg: float | None = None
    diagnosis_date: date | None = None


class MedicationCreate(BaseModel):
    child_id: UUID
    name: str
    medication_type: str
    dosage: str
    frequency: str
    scheduled_time: str | None = None
    notes: str | None = None


class MedicationUpdate(BaseModel):
    name: str | None = None
    manufacturer: str | None = None
    type: str | None = None
    description: str | None = None


class MedicationResponse(IDResponse):
    child_id: UUID
    name: str
    medication_type: str
    dosage: str
    frequency: str
    scheduled_time: str | None = None
    notes: str | None = None


class MedicationScheduleCreate(BaseModel):
    child_id: UUID
    medication_id: UUID
    dose_amount: float = Field(gt=0)
    scheduled_time: time
    relation_carbs: float | None = Field(default=None, gt=0)
    sensitivity_factor: float | None = Field(default=None, gt=0)
    notes: str | None = None


class MedicationScheduleUpdate(BaseModel):
    child_id: UUID | None = None
    medication_id: UUID | None = None
    dose_amount: float | None = Field(default=None, gt=0)
    scheduled_time: time | None = None
    relation_carbs: float | None = Field(default=None, gt=0)
    sensitivity_factor: float | None = Field(default=None, gt=0)
    notes: str | None = None


class MedicationScheduleResponse(IDResponse):
    child_id: UUID
    medication_id: UUID
    dose_amount: float
    scheduled_time: time
    relation_carbs: float | None = None
    sensitivity_factor: float | None = None
    notes: str | None = None


class MedicationLogCreate(BaseModel):
    schedule_id: UUID | None = None
    child_id: UUID
    medication_id: UUID
    actual_dose: float
    taken_at: datetime | None = None
    status: str
    notes: str | None = None


class MedicationLogUpdate(BaseModel):
    schedule_id: UUID | None = None
    medication_id: UUID | None = None
    actual_dose: float | None = None
    taken_at: datetime | None = None
    status: str | None = None
    notes: str | None = None


class MedicationLogResponse(IDResponse):
    schedule_id: UUID | None = None
    child_id: UUID
    medication_id: UUID
    actual_dose: float
    taken_at: datetime | None = None
    status: str
    notes: str | None = None


class AppointmentCreate(BaseModel):
    child_id: UUID
    professional_name: str
    specialty: str
    appointment_at: datetime
    status: str
    notes: str | None = None


class AppointmentUpdate(BaseModel):
    professional_name: str | None = None
    specialty: str | None = None
    appointment_at: datetime | None = None
    status: str | None = None
    notes: str | None = None


class AppointmentResponse(IDResponse):
    child_id: UUID
    professional_name: str
    specialty: str
    appointment_at: datetime
    status: str
    notes: str | None = None


class AppointmentHistoryResponse(ORMBaseModel):
    id: UUID
    appointment_id: UUID
    previous_status: str | None = None
    new_status: str
    previous_time: datetime | None = None
    new_time: datetime
    reason: str | None = None
    changed_at: datetime


class AppointmentRescheduleRequest(BaseModel):
    new_time: datetime
    reason: str


class AppointmentCancelRequest(BaseModel):
    reason: str


class ExamCreate(BaseModel):
    child_id: UUID
    name: str
    requested_by: str | None = None
    requested_at: date
    due_at: date | None = None
    status: str


class ExamUpdate(BaseModel):
    name: str | None = None
    requested_by: str | None = None
    requested_at: date | None = None
    due_at: date | None = None
    status: str | None = None


class ExamResponse(IDResponse):
    child_id: UUID
    name: str
    requested_by: str | None = None
    requested_at: date
    due_at: date | None = None
    status: str


class ExamResultCreate(BaseModel):
    exam_id: UUID
    result_value: float
    unit: str
    reference_range: str | None = None
    is_normal: bool = True
    realized_at: date
    notes: str | None = None


class ExamResultUpdate(BaseModel):
    result_value: float | None = None
    unit: str | None = None
    reference_range: str | None = None
    is_normal: bool | None = None
    realized_at: date | None = None
    notes: str | None = None


class ExamResultResponse(IDResponse):
    exam_id: UUID
    result_value: float
    unit: str
    reference_range: str | None = None
    is_normal: bool
    realized_at: date
    notes: str | None = None


class GlucoseRecordCreate(BaseModel):
    child_id: UUID
    glucose_value: int = Field(..., description="Glicemia capilar ou sensor")
    measurement_type: str = Field(..., pattern="^(CAPILAR|SENSOR)$")
    carbs_grams: int | None = Field(default=0, ge=0)
    bolus_correction: float | None = None
    bolus_food: float | None = None
    activity_intensity: str | None = None
    notes: str | None = None
    recorded_at: datetime

    @field_validator("glucose_value")
    @classmethod
    def validate_glucose_limits(cls, value: int) -> int:
        if value < settings.min_glycemia_value or value > settings.max_glycemia_value:
            raise ValueError("Glicemia deve estar entre 20 e 600 mg/dL")
        return value


class GlucoseRecordUpdate(BaseModel):
    glucose_value: int | None = None
    measurement_type: str | None = None
    carbs_grams: int | None = Field(default=None, ge=0)
    bolus_correction: float | None = None
    bolus_food: float | None = None
    activity_intensity: str | None = None
    notes: str | None = None
    recorded_at: datetime | None = None


class GlucoseRecordResponse(IDResponse):
    child_id: UUID
    glucose_value: int
    measurement_type: str
    carbs_grams: int | None = None
    bolus_correction: float | None = None
    bolus_food: float | None = None
    activity_intensity: str | None = None
    notes: str | None = None
    recorded_at: datetime


class EmergencyContactCreate(BaseModel):
    child_id: UUID
    name: str
    relationship: str
    phone: str
    is_primary: bool = False


class EmergencyContactUpdate(BaseModel):
    name: str | None = None
    relationship: str | None = None
    phone: str | None = None
    is_primary: bool | None = None


class EmergencyContactResponse(IDResponse):
    child_id: UUID
    name: str
    relationship: str
    phone: str
    is_primary: bool


class NotificationCreate(BaseModel):
    user_id: UUID
    child_id: UUID | None = None
    type: str
    title: str
    message: str
    scheduled_at: datetime
    sent_at: datetime | None = None
    status: str


class NotificationUpdate(BaseModel):
    type: str | None = None
    title: str | None = None
    message: str | None = None
    scheduled_at: datetime | None = None
    sent_at: datetime | None = None
    status: str | None = None


class NotificationResponse(IDResponse):
    user_id: UUID
    child_id: UUID | None = None
    type: str
    title: str
    message: str
    scheduled_at: datetime
    sent_at: datetime | None = None
    status: str


class ChatSessionCreate(BaseModel):
    user_id: UUID
    title: str = "Nova Conversa"


class ChatSessionUpdate(BaseModel):
    title: str | None = None


class ChatSessionResponse(IDResponse):
    user_id: UUID
    title: str


class ChatMessageCreate(BaseModel):
    session_id: UUID
    sender: str
    message_text: str
    confidence_score: float | None = None
    citations: list[str] | None = None


class ChatMessageResponse(ORMBaseModel):
    id: UUID
    session_id: UUID
    sender: str
    message_text: str
    confidence_score: float | None = None
    citations: list[str] | None = None
    created_at: datetime


class DocumentCreate(BaseModel):
    filename: str
    title: str
    source_organization: str | None = None
    file_hash: str


class DocumentUpdate(BaseModel):
    title: str | None = None
    source_organization: str | None = None
    file_hash: str | None = None


class DocumentResponse(IDResponse):
    filename: str
    title: str
    source_organization: str | None = None
    file_hash: str


class DocumentChunkCreate(BaseModel):
    document_id: UUID
    chunk_index: int
    content: str
    vector_id: str


class DocumentChunkResponse(ORMBaseModel):
    id: UUID
    document_id: UUID
    chunk_index: int
    content: str
    vector_id: str
    created_at: datetime


class ChatQuery(BaseModel):
    session_id: UUID | None = None
    user_id: UUID
    message: str


class SourceCitation(BaseModel):
    document: str
    chunk_index: int
    excerpt: str | None = None


class ChatAnswer(BaseModel):
    answer: str
    confidence_score: float
    confidence_label: str
    citations: list[SourceCitation] = Field(default_factory=list)
    fallback: bool = False
