from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text

from src.config.db import get_db
from src.Schemas.auth_schema import LoginRequest, LoginResponse, UserResponse
from src.Services.auth_service import login_user
from src.Security.auth_dependency import get_current_user
from src.Models.account import Account

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login", response_model=LoginResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    return login_user(db, data.username, data.password)


@router.get("/me", response_model=UserResponse)
def get_profile(
    user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    account = db.query(Account).filter(
        Account.payer_id == user.payer_id
    ).first()

    student = db.execute(
        text("""
            SELECT s.mssv
            FROM payers p
            JOIN students s ON p.student_id = s.student_id
            WHERE p.payer_id = :payer_id
        """),
        {"payer_id": user.payer_id}
    ).mappings().first()

    return {
        "payer_id": user.payer_id,
        "username": user.username,
        "fullname": user.fullname,
        "phone": user.phone,
        "email": user.email,
        "balance": float(account.balance),
        "status": account.status,
        "mssv": student["mssv"] if student else None
    }


@router.get("/my-email")
def get_my_email(current_user=Depends(get_current_user)):
    return {
        "payer_id": current_user.payer_id,
        "username": current_user.username,
        "email": current_user.email
    }