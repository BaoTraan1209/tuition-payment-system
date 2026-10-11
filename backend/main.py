from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

# Tài khoản mẫu
users = {
    "ngoc123": "123456"
}

# Dữ liệu đăng nhập
class LoginRequest(BaseModel):
    username: str
    password: str

# API đăng nhập
@app.post("/login")
def login(data: LoginRequest):

    # Kiểm tra tài khoản
    if data.username not in users:
        raise HTTPException(
            status_code=401,
            detail="Sai tài khoản hoặc mật khẩu"
        )

    # Kiểm tra mật khẩu
    if users[data.username] != data.password:
        raise HTTPException(
            status_code=401,
            detail="Sai tài khoản hoặc mật khẩu"
        )

    return {
        "message": "Đăng nhập thành công"
    }