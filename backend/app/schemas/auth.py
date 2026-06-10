from pydantic import BaseModel, EmailStr, Field, field_validator


class RegisterRequest(BaseModel):
    name: str = Field(min_length=2)
    email: EmailStr
    password: str = Field(min_length=8)
    phone: str | None = None

    @field_validator("password")
    def password_max_bytes(cls, v: str) -> str:
        if v is None:
            return v
        if len(v.encode("utf-8")) > 72:
            raise ValueError("password must be at most 72 bytes when encoded in UTF-8")
        return v


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    user_id: str | None = None
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RefreshRequest(BaseModel):
    refresh_token: str


class LogoutRequest(BaseModel):
    token: str
