from fastapi import APIRouter

from app.api.v1 import appointments, auth, chat, children, dashboard, documents, exams, glucose, logs, medications, notifications, schedules, users

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(dashboard.router)
api_router.include_router(users.router)
api_router.include_router(children.router)
api_router.include_router(medications.router)
api_router.include_router(schedules.router)
api_router.include_router(logs.router)
api_router.include_router(appointments.router)
api_router.include_router(exams.router)
api_router.include_router(glucose.router)
api_router.include_router(notifications.router)
api_router.include_router(chat.router)
api_router.include_router(documents.router)

