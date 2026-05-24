from .schemas import EventSchema, EventListSchema, EventCreateSchema, EventUpdateSchema
from fastapi import APIRouter


router = APIRouter()

@router.get("/")
def read_events() -> EventListSchema:
    return {
        "results" : [
        {"id" : 1}, 
        {"id" :2}, 
        {"id" :3}
        ],
        "count" : 3
    }

@router.post("/")
def create_event(payload:EventCreateSchema) -> EventSchema:
    print(payload.page)
    data = payload.model_dump() #to a dict
    return {
        "id" : 123, **data
    }

@router.get("/{event_id}")
def get_event(event_id:int) -> EventSchema:
    return {
        "id" : event_id
    }

@router.put("/{event_id}")
def get_event(event_id:int, payload:EventUpdateSchema) -> EventSchema:
    data = payload.model_dump()
    return {
        "id" : event_id, **data
    }