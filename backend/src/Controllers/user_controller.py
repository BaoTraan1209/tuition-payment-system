from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from src.config.db import get_db
from src.Security.auth_dependency import get_current_user
from src.Schemas.user_schema import UserProfileResponse, UserProfileUpdate
from src.Services.user_service import get_user_profile, edit_user_profile

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserProfileResponse)
def get_my_profile(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    try:
        return get_user_profile(db, int(current_user.payer_id))
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc))


@router.patch("/me", response_model=UserProfileResponse)
def update_my_profile(
    data: UserProfileUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    try:
        updated = edit_user_profile(
            db,
            int(current_user.payer_id),
            data.model_dump(exclude_unset=True),
        )
        if updated is None:
            raise HTTPException(status_code=404, detail="User was not found.")
        return updated
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="The supplied profile data conflicts with an existing record.")
