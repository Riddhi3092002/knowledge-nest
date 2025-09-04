from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = "mongodb://localhost:27017/"
client = AsyncIOMotorClient(MONGO_URI)
db = client["SmartStudy"]
courses_collection = db["Courses"]
user_collection = db["users"]
