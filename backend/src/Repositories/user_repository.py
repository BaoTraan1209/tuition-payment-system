from sqlalchemy.orm import Session

from src.Models.user import User


def get_user_by_id(db: Session, payer_id: int):
    return db.query(User).filter(User.payer_id == payer_id).first()


def update_user_profile(
    db: Session,
    payer_id: int,
    *,
    fullname: str | None = None,
    phone: str | None = None,
    email: str | None = None,
):
    user = get_user_by_id(db, payer_id)
    if user is None:
        return None

    if fullname is not None:
        user.fullname = fullname.strip()
    if phone is not None:
        user.phone = phone.strip() or None
    if email is not None:
        user.email = email.strip() or None

    db.commit()
    db.refresh(user)
    return user
