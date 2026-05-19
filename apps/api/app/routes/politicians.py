from fastapi import APIRouter

router = APIRouter()

POLITICIANS = [
    {"id": "p1", "full_name": "Jordan Lee", "party": "Independent", "state": "CA", "district": "12"},
    {"id": "p2", "full_name": "Casey Morgan", "party": "Democratic", "state": "AZ", "district": "At-large"},
]

@router.get("")
def list_politicians() -> list[dict]:
    return POLITICIANS

@router.get("/{politician_id}")
def get_politician(politician_id: str) -> dict:
    return next((p for p in POLITICIANS if p["id"] == politician_id), {"error": "not found"})
