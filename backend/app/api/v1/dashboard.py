from datetime import UTC, datetime
from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.models.entities import Medication, MedicationLog, MedicationSchedule

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/daily-routine")
async def get_daily_routine(child_id: UUID, session: AsyncSession = Depends(get_session)):
    schedules_result = await session.execute(
        select(MedicationSchedule)
        .where(MedicationSchedule.child_id == child_id, MedicationSchedule.deleted_at.is_(None))
    )
    schedules = list(schedules_result.scalars().all())

    if not schedules:
        return []

    medication_ids = [s.medication_id for s in schedules]
    medications_result = await session.execute(
        select(Medication).where(Medication.id.in_(medication_ids))
    )
    medications_map = {m.id: m for m in medications_result.scalars().all()}

    now = datetime.now(UTC)
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    today_end = now.replace(hour=23, minute=59, second=59, microsecond=999999)

    logs_result = await session.execute(
        select(MedicationLog).where(
            MedicationLog.child_id == child_id,
            MedicationLog.taken_at >= today_start,
            MedicationLog.taken_at <= today_end,
        )
    )
    logs_today = list(logs_result.scalars().all())
    completed_schedule_ids = {log.schedule_id for log in logs_today if log.schedule_id}

    routine = []
    for schedule in schedules:
        medication = medications_map.get(schedule.medication_id)
        if not medication:
            continue
        routine.append({
            "schedule_id": str(schedule.id),
            "medication_id": str(schedule.medication_id),
            "name": medication.name,
            "time": schedule.scheduled_time.strftime("%H:%M") if schedule.scheduled_time else None,
            "dosage": str(schedule.dose_amount),
            "type": medication.medication_type,
            "status": "completed" if schedule.id in completed_schedule_ids else "pending",
        })

    routine.sort(key=lambda x: x["time"] or "")
    return routine
