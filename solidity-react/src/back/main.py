from pydantic import BaseModel
from sqlalchemy.orm import sessionmaker, Session
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import create_engine, Column, Integer, String, DateTime
from typing import List
from datetime import datetime

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATABASE_URL = "sqlite:///./notes.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Note(Base):
    __tablename__ = "notes"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String, index=True)
    content = Column(String)
    timestamp = Column(Integer)
    created_by = Column(String)

Base.metadata.create_all(bind=engine)

class NoteCreate(BaseModel):
    title: str
    content: str
    timestamp: int
    created_by: str

class NoteResponse(NoteCreate):
    id: int

    class Config:
        orm_mode = True

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/notes/", response_model=NoteResponse)
def create_note(note: NoteCreate, db: Session = Depends(get_db)):
    db_note = Note(
        title=note.title,
        content=note.content,
        timestamp=note.timestamp,
        created_by=note.created_by
    )
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note

@app.get("/notes/{title}", response_model=NoteResponse)
def get_note(title: str, db: Session = Depends(get_db)):
    db_note = db.query(Note).filter(Note.title == title).first()
    if db_note is None:
        raise HTTPException(status_code=404, detail="Note not found")
    return db_note

@app.get("/notes/", response_model=List[NoteResponse])
def list_notes(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return db.query(Note).offset(skip).limit(limit).all()

@app.put("/notes/{title}", response_model=NoteResponse)
def update_note(title: str, updated_note: NoteCreate, db: Session = Depends(get_db)):
    db_note = db.query(Note).filter(Note.title == title).first()
    if db_note is None:
        raise HTTPException(status_code=404, detail="Note not found")
    db_note.title = updated_note.title
    db_note.content = updated_note.content
    db_note.timestamp = updated_note.timestamp
    db_note.created_by = updated_note.created_by
    db.commit()
    db.refresh(db_note)
    return db_note

@app.delete("/notes/{title}", response_model=dict)
def delete_note(title: str, db: Session = Depends(get_db)):
    db_note = db.query(Note).filter(Note.title == title).first()
    if db_note is None:
        raise HTTPException(status_code=404, detail="Note not found")
    db.delete(db_note)
    db.commit()
    return {"message": "Note deleted successfully"}