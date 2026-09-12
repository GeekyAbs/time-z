import timescaledb
from sqlmodel import Session, SQLModel

from .config import DATABASE_URL

if DATABASE_URL == "":
    raise NotImplementedError("DATABASE_URL needs to be set")

engine = timescaledb.create_engine(DATABASE_URL, timezone="UTC")


def init_db():
    print("creating tables")
    SQLModel.metadata.create_all(engine)
    # converts the plain tables into hypertables + applies retention
    print("creating hypertables")
    timescaledb.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session
