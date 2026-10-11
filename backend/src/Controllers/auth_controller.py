from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.config.db import get_db
from src.Schemas.auth_schema import LoginRequest, LoginResponse, UserResponse
from src.Services.auth_service import login_user
from src.Security.auth_dependency import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login", response_model=LoginResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    return login_user(db, data.username, data.password)

@router.get("/me", response_model=UserResponse)
def get_profile(user=Depends(get_current_user)):
    return user