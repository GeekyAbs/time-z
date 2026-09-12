from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func
from sqlmodel import Session, select
from timescaledb.hyperfunctions import time_bucket

from api.db.session import get_session

from .models import (
    EventModel,
    EventBucketSchema,
    EventCreateSchema,
    EventUpdateSchema,
    get_utc_now,
)

router = APIRouter()


@router.get("/", response_model=List[EventBucketSchema])
def read_events(
    duration: str = Query("1 day"),
    pages: List[str] = Query(None),
    session: Session = Depends(get_session),
):
    bucket = time_bucket(duration, EventModel.time)
    query = select(
        bucket.label("bucket"),
        EventModel.page.label("page"),
        func.count().label("count"),
    )
    if pages:
        query = query.where(EventModel.page.in_(pages))
    query = query.group_by(bucket, EventModel.page).order_by(bucket)
    return session.exec(query).all()


@router.post("/", response_model=EventModel, status_code=status.HTTP_201_CREATED)
def create_event(payload: EventCreateSchema, session: Session = Depends(get_session)):
    obj = EventModel.model_validate(payload)
    session.add(obj)
    session.commit()
    session.refresh(obj)
    return obj


# session.get() won't work anymore - the PK is now (id, time)
def get_event_or_404(event_id: int, session: Session) -> EventModel:
    query = select(EventModel).where(EventModel.id == event_id)
    obj = session.exec(query).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Event not found")
    return obj


@router.get("/{event_id}", response_model=EventModel)
def get_event(event_id: int, session: Session = Depends(get_session)):
    return get_event_or_404(event_id, session)


@router.put("/{event_id}", response_model=EventModel)
def update_event(
    event_id: int,
    payload: EventUpdateSchema,
    session: Session = Depends(get_session),
):
    obj = get_event_or_404(event_id, session)
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
    obj = get_event_or_404(event_id, session)
    session.delete(obj)
    session.commit()
    return None
