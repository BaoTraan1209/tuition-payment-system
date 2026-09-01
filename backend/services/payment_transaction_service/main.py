from fastapi import FastAPI

app = FastAPI(
    title="Payment & Transaction Service",
    version="1.0.0"
)


@app.get("/")
def root():
    return {
        "service": "Payment & Transaction Service",
        "status": "running"
    }