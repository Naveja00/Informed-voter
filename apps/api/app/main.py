from fastapi import FastAPI
from app.routes import politicians, elections, bills, health

app = FastAPI(title="Informed Voter API", version="0.1.0")

app.include_router(health.router)
app.include_router(politicians.router, prefix="/api/v1/politicians", tags=["politicians"])
app.include_router(elections.router, prefix="/api/v1/elections", tags=["elections"])
app.include_router(bills.router, prefix="/api/v1/bills", tags=["bills"])
