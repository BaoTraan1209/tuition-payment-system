from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import synonym
from src.config.db import Base

class User(Base):
    __tablename__ = "payers"
    payer_id = Column(Integer, primary_key=True)
    username = Column(String(50), unique=True, nullable=False)
    password_hash = Column("password", String(255), nullable=False)
    fullname = Column(String(100), nullable=False)
    phone = Column(String(20))
    email = Column(String(100))
    # Hỗ trợ code Auth cũ sử dụng user.id và user.full_name
    id = synonym("payer_id")
    full_name = synonym("fullname")
