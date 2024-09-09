from pydantic import BaseModel

class Server(BaseModel):
    address: str
    port: str | None = None