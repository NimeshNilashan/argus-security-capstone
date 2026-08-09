from typing import Any
from pydantic import BaseModel, Field


class OSINTRequest(BaseModel):
    domain: str = Field(..., example="example.com", description="Target domain for OSINT reconnaissance")


class WhoisResponse(BaseModel):
    domain_name: Any = None
    registrar: Any = None
    creation_date: str | None = None
    expiration_date: str | None = None
    updated_date: str | None = None
    name_servers: Any = None
    country: Any = None
    error: str | None = None


class DNSResponse(BaseModel):
    A: list[str] = []
    MX: list[str] = []
    TXT: list[list[str]] = []
    NS: list[str] = []


class OSINTResponse(BaseModel):
    target: str
    whois: WhoisResponse
    dns: DNSResponse
    reputation: dict[str, Any]