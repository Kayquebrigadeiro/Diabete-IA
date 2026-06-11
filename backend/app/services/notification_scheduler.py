from __future__ import annotations

import logging
from datetime import UTC, datetime

from sqlalchemy import select

from app.core.database import AsyncSessionLocal
from app.models.entities import Child, MedicationSchedule, Notification

logger = logging.getLogger("uvicorn")


async def check_and_generate_notifications() -> None:
    agora = datetime.now().strftime("%H:%M")
    logger.info("[Scheduler] Verificando agendamentos para %s", agora)

    async with AsyncSessionLocal() as session:
        try:
            schedules_result = await session.execute(
                select(MedicationSchedule).where(
                    MedicationSchedule.deleted_at.is_(None),
                )
            )
            schedules = list(schedules_result.scalars().all())

            hoje_inicio = datetime.now(UTC).replace(hour=0, minute=0, second=0, microsecond=0)

            for schedule in schedules:
                if schedule.scheduled_time is None:
                    continue
                if schedule.scheduled_time.strftime("%H:%M") != agora:
                    continue

                titulo = f"Hora do Medicamento"

                ja_existe = await session.execute(
                    select(Notification).where(
                        Notification.child_id == schedule.child_id,
                        Notification.type == "MEDICAMENTO",
                        Notification.scheduled_at >= hoje_inicio,
                        Notification.message.contains(str(schedule.medication_id)),
                    )
                )
                if ja_existe.scalar_one_or_none():
                    continue

                child_result = await session.execute(
                    select(Child.user_id).where(Child.id == schedule.child_id, Child.deleted_at.is_(None))
                )
                user_id = child_result.scalar_one_or_none()
                if not user_id:
                    continue

                nova = Notification(
                    user_id=user_id,
                    child_id=schedule.child_id,
                    type="MEDICAMENTO",
                    title=titulo,
                    message=f"Dose de {schedule.dose_amount}U agendada às {agora}. (ref: {schedule.medication_id})",
                    scheduled_at=datetime.now(UTC),
                    status="PENDENTE",
                )
                session.add(nova)
                logger.info("[Scheduler] Notificação criada para criança %s às %s", schedule.child_id, agora)

            await session.commit()
        except Exception:
            await session.rollback()
            logger.exception("[Scheduler] Erro ao processar notificações automáticas")
