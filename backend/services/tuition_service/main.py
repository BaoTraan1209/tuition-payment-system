from fastapi import FastAPI

app = FastAPI(
    title="Tuition Service",
    version="1.0.0"
)


@app.get("/")
def root():
    return {
        "service": "Tuition Service",
        "status": "running"
    }