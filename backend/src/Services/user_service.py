from sqlalchemy.orm import Session

from src.Repositories.user_repository import get_user_by_id, update_user_profile


def get_user_profile(db: Session, payer_id: int):
    if payer_id <= 0:
        raise ValueError("Invalid payer ID.")
    user = get_user_by_id(db, payer_id)
    if user is None:
        raise ValueError("User was not found.")
    return user


def edit_user_profile(db: Session, payer_id: int, updates: dict):
    if payer_id <= 0:
        raise ValueError("Invalid payer ID.")

    allowed = {"fullname", "phone", "email"}
    values = {key: value for key, value in updates.items() if key in allowed}
    if not values:
        raise ValueError("Provide at least one profile field to update.")

    if "fullname" in values and values["fullname"] is not None:
        values["fullname"] = values["fullname"].strip()
        if not values["fullname"]:
            raise ValueError("Full name cannot be empty.")

    if "phone" in values and values["phone"] is not None:
        values["phone"] = values["phone"].strip() or None

    if "email" in values and values["email"] is not None:
        values["email"] = values["email"].strip().lower()
        if values["email"] and ("@" not in values["email"] or "." not in values["email"].rsplit("@", 1)[-1]):
            raise ValueError("Email address is invalid.")

    return update_user_profile(db, payer_id, **values)
