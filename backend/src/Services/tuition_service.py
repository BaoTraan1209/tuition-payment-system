
from sqlalchemy import text
from sqlalchemy.orm import Session


def get_student_tuitions(db: Session, mssv: str):
    rows = db.execute(
        text("""
            SELECT
                t.tuition_id,
                s.mssv,
                s.fullname,
                t.amount,
                t.status
            FROM tuitions t
            JOIN students s ON s.student_id = t.student_id
            WHERE s.mssv = :mssv
            ORDER BY t.tuition_id DESC
        """),
        {"mssv": mssv.strip()}
    ).mappings().all()

    return [
        {
            "tuition_id": row["tuition_id"],
            "mssv": row["mssv"],
            "fullName": row["fullname"],
            "amount": float(row["amount"]),
            "status": row["status"]
        }
        for row in rows
    ]


def get_student_tuition_status(db: Session, mssv: str):
    return [
        {
            "tuition_id": item["tuition_id"],
            "status": item["status"],
            "amount": item["amount"]
        }
        for item in get_student_tuitions(db, mssv)
    ]
