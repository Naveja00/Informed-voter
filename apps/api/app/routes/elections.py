from fastapi import APIRouter

router = APIRouter()

@router.get("")
def list_elections() -> list[dict]:
    return [{"id": "e1", "year": 2026, "state": "AZ", "office": "Senate"}]

@router.get("/{election_id}/matchup")
def election_matchup(election_id: str) -> dict:
    return {
        "election_id": election_id,
        "candidates": [
            {"name": "Casey Morgan", "party": "Democratic", "fundraising_total": 12400000},
            {"name": "Avery Reed", "party": "Republican", "fundraising_total": 11700000},
        ],
    }
