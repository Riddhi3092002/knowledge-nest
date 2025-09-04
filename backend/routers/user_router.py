from fastapi import APIRouter, HTTPException
from models.user_model import UserSignup, UserLogin
from database.mongo import user_collection
from auth.hash_handler import hash_password, verify_password
from auth.jwt_handler import create_access_token

user_router = APIRouter()

@user_router.post("/signup")
async def signup(user: UserSignup):
    if await user_collection.find_one({"username": user.username}):
        raise HTTPException(status_code=400, detail="Username already exists")

    user_dict = user.dict()
    user_dict["password"] = hash_password(user.password)
    user_dict["courses"] = []
    await user_collection.insert_one(user_dict)
    return {"message": "User created successfully"}


@user_router.post("/login")
async def login(user: UserLogin):
    db_user = await user_collection.find_one({"username": user.username})
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": user.username})
    return {"access_token": token, "token_type": "bearer", "firstName": db_user.get("firstName", ""), "lastName": db_user.get("lastName", "")}

