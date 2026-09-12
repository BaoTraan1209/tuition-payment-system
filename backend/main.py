from fastapi import FastAPI, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

from src.config.db import get_db

app = FastAPI()


@app.get("/")
def test_connection(db: Session = Depends(get_db)):
    result = db.execute(text("SELECT 1"))
    
    return {
        "message": "Kết nối database thành công!",
        "result": result.scalar()
    }
