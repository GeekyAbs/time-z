from sqlmodel import SQLModel, Field
from typing import List, Optional


class EventModel(SQLModel):
    id : int
    page : Optional[str] = ""
    description: Optional[str] = ""

class EventCreateSchema(SQLModel):
    page: str
    description: Optional[str] = Field(default="")

class EventUpdateSchema(SQLModel):
    description: str   

class EventListSchema(SQLModel):
    results : List[EventSchema]
    count : int 
