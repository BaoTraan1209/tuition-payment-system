
from sqlalchemy import text
from sqlalchemy.orm import Session


def get_transactions_by_payer(db: Session, payer_id: int):
    rows = db.execute(
        text("""
            SELECT
                tr.transaction_id,
                p.tuition_id,
                tr.type,
                tr.amount,
                tr.status,
                tr.created_at
            FROM transactions tr
            LEFT JOIN payments p
                ON p.payment_id = tr.payment_id
            WHERE tr.payer_id = :payer_id
            ORDER BY tr.created_at DESC,
                     tr.transaction_id DESC
        """),
        {"payer_id": payer_id}
    ).mappings().all()

    return [
        {
            **dict(row),
            "amount": float(row["amount"])
        }
        for row in rows
    ]
