from pydantic import BaseModel

class ModuleStatus(BaseModel):
    name: str
    endpoint: str
    status: str

class SystemOverviewResponse(BaseModel):
    status: str
    version: str
    active_modules: int
    modules: list[ModuleStatus]