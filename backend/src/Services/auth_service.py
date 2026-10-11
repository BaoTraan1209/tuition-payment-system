from fastapi import HTTPException
from src.Repositories.auth_repository import get_user_by_username
from src.Security.password import verify_password
from src.Security.jwt import create_access_token

def login_user(db, username, password):
    user = get_user_by_username(db, username)

    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(
            status_code=401,
            detail="Sai tên đăng nhập hoặc mật khẩu"
        )

    return {
        "access_token": create_access_token(user.id),
        "token_type": "bearer"
    }