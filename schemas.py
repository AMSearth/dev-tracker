from pydantic import BaseModel

# React sends us
class StudyLogCreate(BaseModel):
    topic: str
    category:str
    understood:bool = False
# send back from backend to frontend.
class StudyLogResponse(StudyLogCreate):
    id: int

    class Config:
        from_attributes = True # REad data from models
