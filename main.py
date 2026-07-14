from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import engine, SessionLocal
import models
import schemas

# SQLAlchemy to create all tables defined in model.py
models.Base.metadata.create_all(bind=engine)

app = FastAPI()
# Api request to each tmp session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

#Routes

@app.post("/logs/",response_model=schemas.StudyLogResponse)
def create_log(log:schemas.StudyLogCreate, db: Session = Depends(get_db)):
    db_log = models.StudyLog(
            topic=log.topic,
            category=log.category,
            understood=log.understood
        )
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log

@app.get("/logs/",response_model=list[schemas.StudyLogResponse])
def get_logs(db:Session = Depends(get_db)):
    logs = db.query(models.StudyLog).all()
    return logs

# update routes
@app.put("/logs/{log_id}",response_model=schemas.StudyLogResponse)
def update_log(log_id: int, log: schemas.StudyLogCreate, db: Session = Depends(get_db)):
    db_log = db.query(models.StudyLog).filter(models.StudyLog.id == log_id).first()

    if db_log is None:
        raise HTTPException(status_code=404, detail="log not found")

    db_log.topic = log.topic
    db_log.category = log.category
    db_log.understood = log.understood

    db.commit()
    db.refresh(db_log)

@app.delete("/logs/{log_id}")
def delete_log(log_id: int, db: Session = Depends(get_db)):
    db_log = db.query(models.StudyLog).filter(models.StudyLog.id == log_id).first()


    if db_log is None:
        raise HTTPException(status_code=404, detail="Log not found")
    db.delete(db_log)
    db.commit()
    return {"message":f"Log {log_id} was successfully deleted!"}
'''
@app.get("/")
def read_root():
    return {"message":"Welcome to the Dev Tracker API!"}
'''
