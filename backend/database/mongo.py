from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
import certifi
import ssl

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

client = AsyncIOMotorClient(
    MONGO_URI,
    tls=True,
    tlsCAFile=certifi.where(),
    tlsAllowInvalidCertificates=False,
    ssl_cert_reqs=ssl.CERT_REQUIRED
)
db = client["SmartStudy"]
courses_collection = db["Courses"]
user_collection = db["users"]
