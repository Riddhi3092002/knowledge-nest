from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import quiz_router
from routers import user_router
from routers import course_router
from routers import summarize_router

from dotenv import load_dotenv

load_dotenv()
app = FastAPI()

origins = [
    "http://localhost:4200",  
    "https://theknowledgenest.netlify.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,              
    allow_credentials=True,
    allow_methods=["*"],                
    allow_headers=["*"],                
)

app.include_router(course_router.router, prefix="/api")
app.include_router(user_router.user_router, prefix="/api")
app.include_router(summarize_router.router, prefix="/utils", tags=["Summarization"])
app.include_router(quiz_router.router, prefix="/quiz", tags=["Quiz"])

@app.get("/")
def root():
    return {"message": "FastAPI backend is running!"}
