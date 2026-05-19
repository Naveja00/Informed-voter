from fastapi import APIRouter

router = APIRouter()

@router.get("")
def list_bills() -> list[dict]:
    return [{"id": "hr-1024", "title": "Election Data Transparency Act", "status": "introduced"}]

@router.get("/{bill_id}")
def get_bill(bill_id: str) -> dict:
    return {
        "id": bill_id,
        "official_summary": "Official source summary placeholder.",
        "ai_summary": "AI explanation placeholder.",
        "ai_summary_disclaimer": "AI-generated explanation. Verify with official text.",
    }
