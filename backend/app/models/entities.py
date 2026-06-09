from __future__ import annotations

from datetime import date, datetime, time
from enum import Enum
from typing import Any
from uuid import uuid4

from sqlalchemy import Boolean, Date, DateTime, Float, ForeignKey, Integer, Numeric, String, Text, Time, func
from sqlalchemy.dialects.postgresql import ARRAY, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship as sa_relationship

from app.core.database import Base


class TimestampMixin:
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))


class UUIDMixin:
    id: Mapped[Any] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)


class User(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "users"

    name: Mapped[str] = mapped_column(String(255))
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    phone: Mapped[str | None] = mapped_column(String(50))
    children: Mapped[list["Child"]] = sa_relationship(back_populates="user", cascade="all,delete-orphan")
    chat_sessions: Mapped[list["ChatSession"]] = sa_relationship(back_populates="user", cascade="all,delete-orphan")
    notifications: Mapped[list["Notification"]] = sa_relationship(back_populates="user", cascade="all,delete-orphan")


class Child(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "children"

    user_id: Mapped[Any] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="RESTRICT"), index=True)
    name: Mapped[str] = mapped_column(String(255))
    birth_date: Mapped[date] = mapped_column(Date)
    weight_kg: Mapped[float | None] = mapped_column(Numeric(5, 2))
    diagnosis_date: Mapped[date | None] = mapped_column(Date)
    user: Mapped["User"] = sa_relationship(back_populates="children")
    medication_schedules: Mapped[list["MedicationSchedule"]] = sa_relationship(back_populates="child", cascade="all,delete-orphan")
    medication_logs: Mapped[list["MedicationLog"]] = sa_relationship(back_populates="child", cascade="all,delete-orphan")
    appointments: Mapped[list["Appointment"]] = sa_relationship(back_populates="child", cascade="all,delete-orphan")
    exams: Mapped[list["Exam"]] = sa_relationship(back_populates="child", cascade="all,delete-orphan")
    glucose_records: Mapped[list["GlucoseRecord"]] = sa_relationship(back_populates="child", cascade="all,delete-orphan")
    emergency_contacts: Mapped[list["EmergencyContact"]] = sa_relationship(back_populates="child", cascade="all,delete-orphan")
    notifications: Mapped[list["Notification"]] = sa_relationship(back_populates="child")


class Medication(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "medications"

    name: Mapped[str] = mapped_column(String(255))
    manufacturer: Mapped[str | None] = mapped_column(String(255))
    type: Mapped[str] = mapped_column(String(100))
    description: Mapped[str | None] = mapped_column(Text)
    schedules: Mapped[list["MedicationSchedule"]] = sa_relationship(back_populates="medication")
    logs: Mapped[list["MedicationLog"]] = sa_relationship(back_populates="medication")


class MedicationSchedule(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "medication_schedules"

    child_id: Mapped[Any] = mapped_column(UUID(as_uuid=True), ForeignKey("children.id", ondelete="CASCADE"), index=True)
    medication_id: Mapped[Any] = mapped_column(UUID(as_uuid=True), ForeignKey("medications.id", ondelete="RESTRICT"), index=True)
    dose_amount: Mapped[float] = mapped_column(Numeric(5, 2))
    scheduled_time: Mapped[time] = mapped_column(Time)
    relation_carbs: Mapped[float | None] = mapped_column(Numeric(5, 2))
    sensitivity_factor: Mapped[float | None] = mapped_column(Numeric(5, 2))
    notes: Mapped[str | None] = mapped_column(Text)
    child: Mapped["Child"] = sa_relationship(back_populates="medication_schedules")
    medication: Mapped["Medication"] = sa_relationship(back_populates="schedules")
    logs: Mapped[list["MedicationLog"]] = sa_relationship(back_populates="schedule")


class MedicationLog(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "medication_logs"

    schedule_id: Mapped[Any | None] = mapped_column(UUID(as_uuid=True), ForeignKey("medication_schedules.id", ondelete="SET NULL"))
    child_id: Mapped[Any] = mapped_column(UUID(as_uuid=True), ForeignKey("children.id", ondelete="CASCADE"), index=True)
    medication_id: Mapped[Any] = mapped_column(UUID(as_uuid=True), ForeignKey("medications.id", ondelete="RESTRICT"))
    actual_dose: Mapped[float] = mapped_column(Numeric(5, 2))
    taken_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    status: Mapped[str] = mapped_column(String(50))
    notes: Mapped[str | None] = mapped_column(Text)
    child: Mapped["Child"] = sa_relationship(back_populates="medication_logs")
    medication: Mapped["Medication"] = sa_relationship(back_populates="logs")
    schedule: Mapped["MedicationSchedule | None"] = sa_relationship(back_populates="logs")


class Appointment(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "appointments"

    child_id: Mapped[Any] = mapped_column(UUID(as_uuid=True), ForeignKey("children.id", ondelete="CASCADE"), index=True)
    professional_name: Mapped[str] = mapped_column(String(255))
    specialty: Mapped[str] = mapped_column(String(100))
    appointment_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    status: Mapped[str] = mapped_column(String(50))
    notes: Mapped[str | None] = mapped_column(Text)
    child: Mapped["Child"] = sa_relationship(back_populates="appointments")
    history: Mapped[list["AppointmentHistory"]] = sa_relationship(back_populates="appointment", cascade="all,delete-orphan")


class AppointmentHistory(UUIDMixin, Base):
    __tablename__ = "appointment_histories"

    appointment_id: Mapped[Any] = mapped_column(UUID(as_uuid=True), ForeignKey("appointments.id", ondelete="CASCADE"))
    previous_status: Mapped[str | None] = mapped_column(String(50))
    new_status: Mapped[str] = mapped_column(String(50))
    previous_time: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    new_time: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    reason: Mapped[str | None] = mapped_column(Text)
    changed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    appointment: Mapped["Appointment"] = sa_relationship(back_populates="history")


class Exam(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "exams"

    child_id: Mapped[Any] = mapped_column(UUID(as_uuid=True), ForeignKey("children.id", ondelete="CASCADE"), index=True)
    name: Mapped[str] = mapped_column(String(255))
    requested_by: Mapped[str | None] = mapped_column(String(255))
    requested_at: Mapped[date] = mapped_column(Date)
    due_at: Mapped[date | None] = mapped_column(Date)
    status: Mapped[str] = mapped_column(String(50))
    child: Mapped["Child"] = sa_relationship(back_populates="exams")
    results: Mapped[list["ExamResult"]] = sa_relationship(back_populates="exam", cascade="all,delete-orphan")


class ExamResult(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "exam_results"

    exam_id: Mapped[Any] = mapped_column(UUID(as_uuid=True), ForeignKey("exams.id", ondelete="CASCADE"), index=True)
    result_value: Mapped[float] = mapped_column(Numeric(10, 3))
    unit: Mapped[str] = mapped_column(String(50))
    reference_range: Mapped[str | None] = mapped_column(String(100))
    is_normal: Mapped[bool] = mapped_column(Boolean, default=True)
    realized_at: Mapped[date] = mapped_column(Date)
    notes: Mapped[str | None] = mapped_column(Text)
    exam: Mapped["Exam"] = sa_relationship(back_populates="results")


class GlucoseRecord(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "glucose_records"

    child_id: Mapped[Any] = mapped_column(UUID(as_uuid=True), ForeignKey("children.id", ondelete="CASCADE"), index=True)
    glucose_value: Mapped[int] = mapped_column(Integer)
    measurement_type: Mapped[str] = mapped_column(String(50))
    carbs_grams: Mapped[int | None] = mapped_column(Integer)
    bolus_correction: Mapped[float | None] = mapped_column(Numeric(5, 2))
    bolus_food: Mapped[float | None] = mapped_column(Numeric(5, 2))
    activity_intensity: Mapped[str | None] = mapped_column(String(50))
    notes: Mapped[str | None] = mapped_column(Text)
    recorded_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    child: Mapped["Child"] = sa_relationship(back_populates="glucose_records")


class EmergencyContact(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "emergency_contacts"

    child_id: Mapped[Any] = mapped_column(UUID(as_uuid=True), ForeignKey("children.id", ondelete="CASCADE"), index=True)
    name: Mapped[str] = mapped_column(String(255))
    relationship: Mapped[str] = mapped_column("relationship", String(100))
    phone: Mapped[str] = mapped_column(String(50))
    is_primary: Mapped[bool] = mapped_column(Boolean, default=False)
    child: Mapped["Child"] = sa_relationship(back_populates="emergency_contacts")


class Notification(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "notifications"

    user_id: Mapped[Any] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), index=True)
    child_id: Mapped[Any | None] = mapped_column(UUID(as_uuid=True), ForeignKey("children.id", ondelete="CASCADE"))
    type: Mapped[str] = mapped_column(String(50))
    title: Mapped[str] = mapped_column(String(255))
    message: Mapped[str] = mapped_column(Text)
    scheduled_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    sent_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    status: Mapped[str] = mapped_column(String(50))
    user: Mapped["User"] = sa_relationship(back_populates="notifications")
    child: Mapped["Child | None"] = sa_relationship(back_populates="notifications")


class ChatSession(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "chat_sessions"

    user_id: Mapped[Any] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), index=True)
    title: Mapped[str] = mapped_column(String(255), default="Nova Conversa")
    user: Mapped["User"] = sa_relationship(back_populates="chat_sessions")
    messages: Mapped[list["ChatMessage"]] = sa_relationship(back_populates="session", cascade="all,delete-orphan")


class ChatMessage(UUIDMixin, Base):
    __tablename__ = "chat_messages"

    session_id: Mapped[Any] = mapped_column(UUID(as_uuid=True), ForeignKey("chat_sessions.id", ondelete="CASCADE"), index=True)
    sender: Mapped[str] = mapped_column(String(50))
    message_text: Mapped[str] = mapped_column(Text)
    confidence_score: Mapped[float | None] = mapped_column(Numeric(5, 2))
    citations: Mapped[list[str] | None] = mapped_column(ARRAY(String), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    session: Mapped["ChatSession"] = sa_relationship(back_populates="messages")


class Document(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "documents"

    filename: Mapped[str] = mapped_column(String(255), unique=True)
    title: Mapped[str] = mapped_column(String(255))
    source_organization: Mapped[str | None] = mapped_column(String(150))
    file_hash: Mapped[str] = mapped_column(String(64))
    chunks: Mapped[list["DocumentChunk"]] = sa_relationship(back_populates="document", cascade="all,delete-orphan")


class DocumentChunk(UUIDMixin, Base):
    __tablename__ = "document_chunks"

    document_id: Mapped[Any] = mapped_column(UUID(as_uuid=True), ForeignKey("documents.id", ondelete="CASCADE"), index=True)
    chunk_index: Mapped[int] = mapped_column(Integer)
    content: Mapped[str] = mapped_column(Text)
    vector_id: Mapped[str] = mapped_column(String(100))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    document: Mapped["Document"] = sa_relationship(back_populates="chunks")


class MedicationScheduleAuditLog(UUIDMixin, Base):
    __tablename__ = "medication_schedule_audit_logs"

    schedule_id: Mapped[Any] = mapped_column(UUID(as_uuid=True))
    child_id: Mapped[Any] = mapped_column(UUID(as_uuid=True))
    action: Mapped[str] = mapped_column(String(50))
    old_dose: Mapped[float | None] = mapped_column(Numeric(5, 2))
    new_dose: Mapped[float | None] = mapped_column(Numeric(5, 2))
    old_time: Mapped[time | None] = mapped_column(Time)
    new_time: Mapped[time | None] = mapped_column(Time)
    changed_by_user_id: Mapped[Any | None] = mapped_column(UUID(as_uuid=True))
    changed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
