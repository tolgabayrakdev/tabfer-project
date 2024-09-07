from pydantic import BaseModel

class LoginUser(BaseModel):
    email: str
    password: str

class RegisterUser(BaseModel):
    username: str
    email: str
    password: str