from fastapi import FastAPI

app = FastAPI(
    title="User & Auth Service",
    version="1.0.0"
)


@app.get("/")
def root():
    return {
        "service": "User & Auth Service",
        "status": "running"
    }