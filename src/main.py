from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.db.session import init_db
from api.events import router as event_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # before app startup
    init_db()
    yield
    # after app shutdown


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(event_router, prefix='/api/events')


@app.get("/")
def read_root():
    return {"Hello": "Wow Real Updates"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: str | None = None):
    return {"item_id": item_id, "q": q}


@app.get("/healthz")
def read_api_health():
    return {"status": "ok"}
