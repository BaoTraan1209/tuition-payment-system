import os
from pathlib import Path
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv
from jose import jwt

load_dotenv(Path(__file__).resolve().parents[2] / ".env")

SECRET_KEY = os.environ["JWT_SECRET_KEY"]
ALGORITHM = "HS256"

def create_access_token(user_id):
    payload = {
        "sub": str(user_id),
        "exp": datetime.now(timezone.utc) + timedelta(minutes=5)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def decode_access_token(token):
    return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])