from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer
from jose import JWTError

from src.config.db import get_db
from src.Repositories.auth_repository import get_user_by_id
from src.Security.jwt import decode_access_token

bearer = HTTPBearer(auto_error=False)

def get_current_user(
    credentials=Depends(bearer),
    db=Depends(get_db)
):
    if credentials is None:
        raise HTTPException(401, "Chưa đăng nhập")

    try:
        payload = decode_access_token(credentials.credentials)
        user_id = int(payload["sub"])
    except (JWTError, KeyError, ValueError, TypeError):
        raise HTTPException(401, "Token không hợp lệ")

    user = get_user_by_id(db, user_id)

    if user is None:
        raise HTTPException(401, "Tài khoản không tồn tại")

    return user