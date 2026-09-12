# import os
# from urllib.parse import quote_plus
# from dotenv import load_dotenv
# from sqlalchemy import create_engine
# from sqlalchemy.orm import sessionmaker, declarative_base

# load_dotenv()

# # 1. Lấy thông tin kết nối từ .env
# connection_string = os.getenv("SQL_CONNECTION_STRING")


# # 2. Encode connection string
# params = quote_plus(connection_string)


# # 3. Tạo đường dẫn kết nối SQLAlchemy -> SQL Server
# DATABASE_URL = f"mssql+pyodbc:///?odbc_connect={params}"


# # 4. Tạo Engine
# engine = create_engine(DATABASE_URL)


# # 5. Tạo Session
# SessionLocal = sessionmaker(
#     autocommit=False,
#     autoflush=False,
#     bind=engine
# )


# # 6. Base dùng cho các Model
# Base = declarative_base()


# # 7. Cấp database session cho API
# def get_db():
#     db = SessionLocal()

#     try:
#         yield db
#     finally:
#         db.close()

import mysql.connector
db=mysql.connector.connect(user='root', password='123456',host='localhost')

#QUERY
code='CREATE SHEMA'

#RUN
mycursor=db.cursor()
mycursor.execute(code)