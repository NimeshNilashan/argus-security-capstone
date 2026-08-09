import dns.resolver
import whois
from fastapi import APIRouter, HTTPException
from app.schemas.osint import OsintRequest, OsintResponse

router = APIRouter(prefix="/osint", tags=["OSINT"])


def get_whois_info(domain: str) -> dict:
    try:
        w = whois.whois(domain)
        creation_date = w.creation_date[0] if isinstance(w.creation_date, list) else w.creation_date
        expiration_date = w.expiration_date[0] if isinstance(w.expiration_date, list) else w.expiration_date
        return {
            "registrar": w.registrar,
            "creation_date": str(creation_date) if creation_date else None,
            "expiration_date": str(expiration_date) if expiration_date else None,
            "country": w.country,
        }
    except Exception as e:
        return {"error": str(e)}


def get_dns_records(domain: str) -> dict:
    records = {"A": [], "MX": [], "NS": [], "TXT": []}
    for record_type in records.keys():
        try:
            answers = dns.resolver.resolve(domain, record_type)
            for rdata in answers:
                if record_type == "MX":
                    records[record_type].append(str(rdata.exchange))
                elif record_type == "TXT":
                    records[record_type].append(
                        [s.decode('utf-[8]') if isinstance(s, bytes) else str(s) for s in rdata.strings])
                else:
                    records[record_type].append(str(rdata))
        except Exception:
            pass
    return records


@router.post("/recon", response_model=OsintResponse)
def execute_osint_recon(payload: OsintRequest):
    domain = payload.domain.strip().lower()
    if not domain:
        raise HTTPException(status_code=400, detail="Domain cannot be empty.")

    whois_data = get_whois_info(domain)
    dns_data = get_dns_records(domain)

    # VirusTotal placeholder if API key is not configured
    reputation_data = {
        "stats": {
            "harmless": 0,
            "malicious": 0,
            "suspicious": 0,
            "undetected": 0
        }
    }

    return OsintResponse(
        target=domain,
        whois=whois_data,
        dns=dns_data,
        reputation=reputation_data
    )