from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .controller import (
    authentication_controller,
    user_controller,
    deal_controller,
    ticket_controller,
    contact_controller,
)

from .database import engine
from . import model
from app.middleware.logging_middleware import logging_middleware

model.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.middleware("http")(logging_middleware)

origins = ["http://localhost:5173", "https://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    router=authentication_controller.router, prefix="/api/v1/authentication"
)
app.include_router(router=user_controller.router, prefix="/api/v1/user")
app.include_router(router=deal_controller.router, prefix="/api/v1/deal")
app.include_router(router=ticket_controller.router, prefix="/api/v1/ticket")
app.include_router(router=contact_controller.router, prefix="/api/v1/contact")


@app.get("/")
def read_root():
    return {"Hello": "World"}
