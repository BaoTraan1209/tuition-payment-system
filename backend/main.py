from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.Controllers.auth_controller import router as auth_router

app = FastAPI()

# Cho phép Frontend React kết nối Backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"]
)

# Đăng ký các API Authentication
app.include_router(auth_router)

