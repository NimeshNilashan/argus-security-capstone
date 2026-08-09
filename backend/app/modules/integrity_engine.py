import hashlib


def calculate_bytes_hash(content: bytes) -> str:
    return hashlib.sha256(content).hexdigest()


def verify_file_integrity(file_content: bytes, baseline_hash: str) -> dict:
    current_hash = calculate_bytes_hash(file_content)
    matches = current_hash.lower() == baseline_hash.lower()

    return {
        "computed_hash": current_hash,
        "baseline_hash": baseline_hash,
        "is_intact": matches,
        "status": "VERIFIED" if matches else "TAMPERED_OR_MODIFIED"
    }