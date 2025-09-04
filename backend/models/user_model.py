from pydantic import BaseModel, EmailStr
from typing import List, Optional

class Milestone(BaseModel):
    week: int
    completed: bool
    date: Optional[str] = None

class Comments(BaseModel):
    comments: str
    date: str

class CourseEntry(BaseModel):
    courseName: str
    startedAt: str
    milestones: List[Milestone]
    comments: List[Comments]

class UserSignup(BaseModel):
    username: str
    password: str
    firstName: str
    lastName: str

class UserLogin(BaseModel):
    username: str
    password: str
