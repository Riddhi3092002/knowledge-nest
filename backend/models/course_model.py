from pydantic import BaseModel, Field
from typing import List, Optional

class Course(BaseModel):
    _id: str
    Title: str
    URL: str
    Short_Intro: Optional[str] = Field(None, alias="Short Intro")
    Skills: Optional[str]  
    Rating: Optional[str]
    Instructors: Optional[str]
    Duration: Optional[str]
    Site: Optional[str]
    Categories: List[str]

    class Config:
        allow_population_by_field_name = True