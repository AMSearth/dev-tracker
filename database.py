from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base


#Create Database
SQLALCHEMY_DATABASE_URL = "sqlite:///./dev_tracker.db"


#Engine for communicating with database
engine = create_engine(
        # check_same_th = False for the Sqlite in fastapi 
        SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread":False}
    )

# class used to create individual database sessions for each request!
SessionLocal = sessionmaker(autocommit=False,autoflush=False,bind=engine)

Base = declarative_base()#factory function that return class
