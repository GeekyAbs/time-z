from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from api.db.session import get_session

from .models import (
    EventModel,
    EventCreateSchema,
    EventUpdateSchema,
    EventListSchema,
    get_utc_now,
)

router = APIRouter()


@router.get("/", response_model=EventListSchema)
def read_events(session: Session = Depends(get_session), limit: int = 10):
    query = select(EventModel).order_by(EventModel.id.desc()).limit(limit)
    results = session.exec(query).all()
    return {"results": results, "count": len(results)}


@router.post("/", response_model=EventModel, status_code=status.HTTP_201_CREATED)
def create_event(payload: EventCreateSchema, session: Session = Depends(get_session)):
    obj = EventModel.model_validate(payload)
    session.add(obj)
    session.commit()
    session.refresh(obj)
    return obj


@router.get("/{event_id}", response_model=EventModel)
def get_event(event_id: int, session: Session = Depends(get_session)):
    obj = session.get(EventModel, event_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Event not found")
    return obj


@router.put("/{event_id}", response_model=EventModel)
def update_event(
    event_id: int,
    payload: EventUpdateSchema,
    session: Session = Depends(get_session),
):
    obj = session.get(EventModel, event_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Event not found")
    data = payload.model_dump(exclude_unset=True)
    for key, value in data.items():
        setattr(obj, key, value)
    obj.updated_at = get_utc_now()
    session.add(obj)
    session.commit()
    session.refresh(obj)
    return obj


@router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_event(event_id: int, session: Session = Depends(get_session)):
    obj = session.get(EventModel, event_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Event not found")
    session.delete(obj)
    session.commit()
    return None
