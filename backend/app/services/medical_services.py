from __future__ import annotations

from datetime import UTC, datetime
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.core.exceptions import ValidationException
from app.models.entities import (
    Appointment,
    AppointmentHistory,
    ChatMessage,
    ChatSession,
    Child,
    Document,
    Exam,
    ExamResult,
    GlucoseRecord,
    Medication,
    MedicationLog,
    MedicationSchedule,
    Notification,
    User,
)
from app.repositories.base import CRUDRepository
from app.schemas.entities import (
    AppointmentCreate,
    ChildCreate,
    DocumentCreate,
    ExamCreate,
    ExamResultCreate,
    GlucoseRecordCreate,
    MedicationCreate,
    MedicationLogCreate,
    MedicationScheduleCreate,
    NotificationCreate,
)

settings = get_settings()


class UserService:
    def __init__(self) -> None:
        self.repo = CRUDRepository(User)

    async def me(self, session: AsyncSession, user_id: UUID) -> User:
        return await self.repo.get(session, user_id)

    async def update_me(self, session: AsyncSession, user_id: UUID, data: dict) -> User:
        user = await self.repo.get(session, user_id)
        return await self.repo.update(session, user, data)

    async def delete_me(self, session: AsyncSession, user_id: UUID) -> User:
        user = await self.repo.get(session, user_id)
        return await self.repo.soft_delete(session, user)


class ChildService:
    def __init__(self) -> None:
        self.repo = CRUDRepository(Child)

    async def list_for_user(self, session: AsyncSession, user_id: UUID) -> list[Child]:
        return await self.repo.list(session, Child.user_id == user_id)

    async def create(self, session: AsyncSession, current_user_id: UUID, payload: ChildCreate) -> Child:
        if payload.user_id != current_user_id:
            raise ValidationException("A criança deve pertencer ao usuário autenticado")
        return await self.repo.create(session, payload.model_dump())


class MedicationService:
    def __init__(self) -> None:
        self.repo = CRUDRepository(Medication)

    async def list(self, session: AsyncSession) -> list[Medication]:
        return await self.repo.list(session)

    async def create(self, session: AsyncSession, payload: MedicationCreate) -> Medication:
        return await self.repo.create(session, payload.model_dump())

    async def update(self, session: AsyncSession, medication_id: UUID, data: dict) -> Medication:
        medication = await self.repo.get(session, medication_id)
        return await self.repo.update(session, medication, data)

    async def delete(self, session: AsyncSession, medication_id: UUID) -> Medication:
        medication = await self.repo.get(session, medication_id)
        return await self.repo.soft_delete(session, medication)


class NotificationService:
    def __init__(self) -> None:
        self.repo = CRUDRepository(Notification)

    async def list_for_user(self, session: AsyncSession, user_id: UUID) -> list[Notification]:
        return await self.repo.list(session, Notification.user_id == user_id)

    async def mark_as_read(self, session: AsyncSession, notification_id: UUID) -> Notification:
        notification = await self.repo.get(session, notification_id)
        return await self.repo.update(
            session,
            notification,
            {"status": "ENVIADO", "sent_at": notification.sent_at or datetime.now(UTC)},
        )

    async def create(self, session: AsyncSession, payload: NotificationCreate) -> Notification:
        return await self.repo.create(session, payload.model_dump())

    async def delete(self, session: AsyncSession, notification_id: UUID) -> Notification:
        notification = await self.repo.get(session, notification_id)
        return await self.repo.soft_delete(session, notification)


class MedicationScheduleService:
    def __init__(self) -> None:
        self.repo = CRUDRepository(MedicationSchedule)
        self.notification_service = NotificationService()

    async def create(self, session: AsyncSession, payload: MedicationScheduleCreate) -> MedicationSchedule:
        schedule = await self.repo.create(session, payload.model_dump())
        await self.notification_service.create(
            session,
            NotificationCreate(
                user_id=await self._user_id_for_child(session, payload.child_id),
                child_id=payload.child_id,
                type="MEDICAMENTO",
                title="Dose agendada",
                message=f"Dose de medicamento às {payload.scheduled_time.strftime('%H:%M')}",
                scheduled_at=datetime.combine(datetime.now(UTC).date(), payload.scheduled_time, tzinfo=UTC),
                status="PENDENTE",
            ),
        )
        return schedule

    async def list_for_child(self, session: AsyncSession, child_id: UUID) -> list[MedicationSchedule]:
        return await self.repo.list(session, MedicationSchedule.child_id == child_id)

    async def update(self, session: AsyncSession, schedule_id: UUID, data: dict) -> MedicationSchedule:
        schedule = await self.repo.get(session, schedule_id)
        return await self.repo.update(session, schedule, data)

    async def delete(self, session: AsyncSession, schedule_id: UUID) -> MedicationSchedule:
        schedule = await self.repo.get(session, schedule_id)
        return await self.repo.soft_delete(session, schedule)

    async def _user_id_for_child(self, session: AsyncSession, child_id: UUID) -> UUID:
        result = await session.execute(select(Child.user_id).where(Child.id == child_id, Child.deleted_at.is_(None)))
        user_id = result.scalar_one_or_none()
        if user_id is None:
            raise ValidationException("Criança não encontrada")
        return user_id


class MedicationLogService:
    def __init__(self) -> None:
        self.repo = CRUDRepository(MedicationLog)

    async def create(self, session: AsyncSession, payload: MedicationLogCreate) -> MedicationLog:
        return await self.repo.create(session, payload.model_dump())

    async def list_for_child(self, session: AsyncSession, child_id: UUID) -> list[MedicationLog]:
        return await self.repo.list(session, MedicationLog.child_id == child_id)


class AppointmentService:
    def __init__(self) -> None:
        self.repo = CRUDRepository(Appointment)
        self.history_repo = CRUDRepository(AppointmentHistory)

    async def create(self, session: AsyncSession, payload: AppointmentCreate) -> Appointment:
        return await self.repo.create(session, payload.model_dump())

    async def list_for_child(self, session: AsyncSession, child_id: UUID) -> list[Appointment]:
        return await self.repo.list(session, Appointment.child_id == child_id)

    async def update(self, session: AsyncSession, appointment_id: UUID, data: dict) -> Appointment:
        appointment = await self.repo.get(session, appointment_id)
        return await self.repo.update(session, appointment, data)

    async def reschedule(self, session: AsyncSession, appointment_id: UUID, new_time: datetime, reason: str) -> Appointment:
        appointment = await self.repo.get(session, appointment_id)
        await self.history_repo.create(
            session,
            {
                "appointment_id": appointment.id,
                "previous_status": appointment.status,
                "new_status": "REAGENDADO",
                "previous_time": appointment.appointment_at,
                "new_time": new_time,
                "reason": reason,
            },
        )
        return await self.repo.update(session, appointment, {"appointment_at": new_time, "status": "REAGENDADO"})

    async def cancel(self, session: AsyncSession, appointment_id: UUID, reason: str) -> Appointment:
        if not reason:
            raise ValidationException("Motivo obrigatório para cancelamento")
        appointment = await self.repo.get(session, appointment_id)
        await self.history_repo.create(
            session,
            {
                "appointment_id": appointment.id,
                "previous_status": appointment.status,
                "new_status": "CANCELADO",
                "previous_time": appointment.appointment_at,
                "new_time": appointment.appointment_at,
                "reason": reason,
            },
        )
        return await self.repo.update(session, appointment, {"status": "CANCELADO"})

    async def delete(self, session: AsyncSession, appointment_id: UUID) -> Appointment:
        appointment = await self.repo.get(session, appointment_id)
        return await self.repo.soft_delete(session, appointment)


class ExamService:
    def __init__(self) -> None:
        self.repo = CRUDRepository(Exam)
        self.result_repo = CRUDRepository(ExamResult)

    async def create(self, session: AsyncSession, payload: ExamCreate) -> Exam:
        return await self.repo.create(session, payload.model_dump())

    async def list_for_child(self, session: AsyncSession, child_id: UUID) -> list[Exam]:
        return await self.repo.list(session, Exam.child_id == child_id)

    async def add_result(self, session: AsyncSession, payload: ExamResultCreate) -> ExamResult:
        return await self.result_repo.create(session, payload.model_dump())


class GlucoseService:
    def __init__(self) -> None:
        self.repo = CRUDRepository(GlucoseRecord)
        self.notification_service = NotificationService()

    async def create(self, session: AsyncSession, payload: GlucoseRecordCreate) -> GlucoseRecord:
        if payload.glucose_value < settings.min_glycemia_value or payload.glucose_value > settings.max_glycemia_value:
            raise ValidationException("Glicemia deve estar entre 20 e 600 mg/dL")
        computed = payload.model_dump()
        if computed.get("carbs_grams") is None:
            computed["carbs_grams"] = 0
        record = await self.repo.create(session, computed)
        if payload.glucose_value > 250:
            user_id = await self._user_id_for_child(session, payload.child_id)
            await self.notification_service.create(
                session,
                NotificationCreate(
                    user_id=user_id,
                    child_id=payload.child_id,
                    type="ALERTA_GLICEMIA",
                    title="Alerta de hiperglicemia",
                    message=f"Glicemia registrada em {payload.glucose_value} mg/dL",
                    scheduled_at=datetime.now(UTC),
                    status="PENDENTE",
                ),
            )
        return record

    async def list_for_child(self, session: AsyncSession, child_id: UUID) -> list[GlucoseRecord]:
        return await self.repo.list(session, GlucoseRecord.child_id == child_id)

    async def _user_id_for_child(self, session: AsyncSession, child_id: UUID) -> UUID:
        result = await session.execute(select(Child.user_id).where(Child.id == child_id, Child.deleted_at.is_(None)))
        user_id = result.scalar_one_or_none()
        if user_id is None:
            raise ValidationException("Criança não encontrada")
        return user_id


class ChatService:
    def __init__(self) -> None:
        self.session_repo = CRUDRepository(ChatSession)
        self.message_repo = CRUDRepository(ChatMessage)
        self.rag = None

    async def create_session(self, session: AsyncSession, user_id: UUID, title: str = "Nova Conversa") -> ChatSession:
        return await self.session_repo.create(session, {"user_id": user_id, "title": title})

    async def add_message(self, session: AsyncSession, payload: dict) -> ChatMessage:
        return await self.message_repo.create(session, payload)


class DocumentService:
    def __init__(self) -> None:
        self.repo = CRUDRepository(Document)

    async def create(self, session: AsyncSession, payload: DocumentCreate) -> Document:
        return await self.repo.create(session, payload.model_dump())
