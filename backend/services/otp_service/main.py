from fastapi import FastAPI

app = FastAPI(
    title="OTP Service",
    version="1.0.0"
)


@app.get("/")
def root():
    return {
        "service": "OTP Service",
        "status": "running"
    }