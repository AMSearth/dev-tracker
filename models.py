from sqlalchemy import Column, Integer, String,Boolean
from database import Base

class StudyLog(Base):
    __tablename__ = "study_logs"
    id = Column(Integer, primary_key=True, index=True)
    topic = Column(String, index=True)
    category = Column(String)
    understood = Column(Boolean, default=False)

