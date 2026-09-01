from fastapi import FastAPI

app = FastAPI(
    title="Notification Service",
    version="1.0.0"
)


@app.get("/")
def root():
    return {
        "service": "Notification Service",
        "status": "running"
    }