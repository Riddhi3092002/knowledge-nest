from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import quiz_router
from routers import user_router
from routers import course_router
from routers import summarize_router

from dotenv import load_dotenv

load_dotenv()
app = FastAPI()


# Allow requests from your Angular app
origins = [
    "http://localhost:4200",  # Angular dev server
    "https://theknowledgenest.netlify.app"
]

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,              # who can access
    allow_credentials=True,
    allow_methods=["*"],                # allow all HTTP methods
    allow_headers=["*"],                # allow all headers
)

# Register the router
app.include_router(course_router.router, prefix="/api")
app.include_router(user_router.user_router, prefix="/api")
app.include_router(summarize_router.router, prefix="/utils", tags=["Summarization"])
app.include_router(quiz_router.router, prefix="/quiz", tags=["Quiz"])

@app.get("/")
def root():
    return {"message": "FastAPI backend is running!"}
