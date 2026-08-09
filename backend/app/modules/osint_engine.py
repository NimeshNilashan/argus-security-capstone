import os
import time
import dns.resolver
import requests
import whois


def get_whois(domain: str) -> dict:
    try:
        detail = whois.whois(domain)
        return {
            "domain_name": detail.domain_name,
            "registrar": detail.registrar,
            "creation_date": str(detail.creation_date) if detail.creation_date else None,
            "expiration_date": str(detail.expiration_date) if detail.expiration_date else None,
            "updated_date": str(detail.updated_date) if detail.updated_date else None,
            "name_servers": detail.name_servers,
            "country": detail.country,
        }
    except Exception as e:
        return {"error": str(e)}


def get_dns_records(domain: str) -> dict:
    records = {"A": [], "MX": [], "TXT": [], "NS": []}

    for record_type in records.keys():
        try:
            answers = dns.resolver.resolve(domain, record_type)
            for rdata in answers:
                if record_type == "A":
                    records["A"].append(rdata.address)
                elif record_type == "MX":
                    records["MX"].append(str(rdata.exchange))
                elif record_type == "TXT":
                    records["TXT"].append([s.decode('utf-8', errors='ignore') for s in rdata.strings])
                elif record_type == "NS":
                    records["NS"].append(str(rdata.target))
        except Exception:
            pass

    return records


def check_reputation(domain: str, api_key: str = None) -> dict:
    key = api_key or os.getenv("VIRUSTOTAL_API_KEY")
    if not key:
        return {"error": "VirusTotal API key not configured"}

    headers = {
        "x-apikey": key,
        "User-Agent": "Mozilla/5.0"
    }

    try:
        post_resp = requests.post(
            "https://www.virustotal.com/api/v3/urls",
            headers=headers,
            data={"url": domain},
            timeout=10
        )
        post_data = post_resp.json()
        analysis_id = post_data["data"]["id"]

        time.sleep(3)

        get_resp = requests.get(
            f"https://www.virustotal.com/api/v3/analyses/{analysis_id}",
            headers={"x-apikey": key},
            timeout=10
        )
        result_data = get_resp.json()

        attributes = result_data.get("data", {}).get("attributes", {})
        return {
            "stats": attributes.get("stats", {}),
            "results": attributes.get("results", {})
        }
    except Exception as e:
        return {"error": str(e)}


def run_osint_recon(domain: str, api_key: str = None) -> dict:
    return {
        "target": domain,
        "whois": get_whois(domain),
        "dns": get_dns_records(domain),
        "reputation": check_reputation(domain, api_key)
    }