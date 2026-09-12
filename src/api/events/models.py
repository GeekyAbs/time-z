from datetime import datetime
from typing import ClassVar, List, Optional

from sqlalchemy import DateTime
from sqlmodel import SQLModel, Field
from timescaledb import TimescaleModel
from timescaledb.utils import get_utc_now


# id + time (the partition column) come from TimescaleModel as a composite PK
class EventModel(TimescaleModel, table=True):
    page: str = Field(index=True)
    description: Optional[str] = ""
    updated_at: datetime = Field(
        default_factory=get_utc_now,
        sa_type=DateTime(timezone=True),
        nullable=False,
    )

    __chunk_time_interval__: ClassVar[str] = "INTERVAL 1 day"
    __drop_after__: ClassVar[str] = "INTERVAL 3 months"


class EventCreateSchema(SQLModel):
    page: str
    description: Optional[str] = Field(default="")


class EventUpdateSchema(SQLModel):
    description: str


class EventBucketSchema(SQLModel):
    bucket: datetime
    page: str
    count: int


class EventListSchema(SQLModel):
    results: List[EventModel]
    count: int
