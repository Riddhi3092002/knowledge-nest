from fastapi import APIRouter, Depends, HTTPException, Body
from auth.dependencies import get_current_user
from models.course_model import Course
from database.mongo import courses_collection
from utils.course_utils import parse_duration_to_milestones

router = APIRouter()

@router.get("/courses")
async def get_all_courses(current_user: str = Depends(get_current_user)):
    courses_cursor = courses_collection.find({}, {'_id': 0})
    courses = await courses_cursor.to_list(length=None)
    return courses

@router.get("/unique-categories")
async def get_unique_categories(current_user: str = Depends(get_current_user)):
    unique_categories_cursor = courses_collection.aggregate([
        {"$unwind": "$Categories"},
        {"$match": {"Categories": {"$ne": None}}},
        {"$group": {"_id": None, "allCategories": {"$addToSet": "$Categories"}}}
    ])
    result = await unique_categories_cursor.to_list(length=None)
    if result:
        return result[0]["allCategories"]
    return []

@router.get("/courses/by-topic/{topic}")
async def get_courses_by_topic(topic: str, current_user: str = Depends(get_current_user)):
    courses_cursor = courses_collection.find(
        {"Categories": topic},
        {'_id': 0}
    )
    courses = await courses_cursor.to_list(length=None)
    return courses


@router.post("/addCourseToUser")
async def add_course_to_user(
    course: dict = Body(...),
    current_user: str = Depends(get_current_user)
):
    
    from database.mongo import user_collection  
    from datetime import datetime

    course_name = course.get("Title")
    duration = course.get("Duration", "")
    milestones = parse_duration_to_milestones(duration)
    started_at = datetime.utcnow().isoformat()

    course_entry = {
        "courseName": course_name,
        "startedAt": started_at,
        "milestones": [m.dict() for m in milestones],
        "comments": [],
        "status": "in-progress",
    }

    print(f"Adding course entry: {course_entry}")

    
    result = await user_collection.update_one(
        {"username": current_user},
        {"$push": {"courses": course_entry}}
    )

    if result.modified_count == 1:
        return {"message": "Course added to user"}
    else:
        raise HTTPException(status_code=404, detail="User not found or course not added")

@router.get("/user-courses")
async def get_user_courses(current_user: str = Depends(get_current_user)):
    from database.mongo import user_collection  

    user = await user_collection.find_one({"username": current_user}, {"_id": 0, "courses": 1})
    if user and "courses" in user:
        return user["courses"]
    else:
        return []
    


@router.get("/course/by-name/{course_name}")
async def get_course_by_name(course_name: str, current_user: str = Depends(get_current_user)):
    course = await courses_collection.find_one({"Title": course_name}, {"_id": 0})
    if course:
        return course
    else:
        raise HTTPException(status_code=404, detail="Course not found")
    

@router.post("/user-course/add-comment")
async def add_comment(
    course_name: str = Body(...),
    comment: dict = Body(...), 
    current_user: str = Depends(get_current_user)
):
    from database.mongo import user_collection

    result = await user_collection.update_one(
        {"username": current_user, "courses.courseName": course_name},
        {"$push": {"courses.$.comments": comment}}
    )
    if result.modified_count == 1:
        return {"message": "Comment added"}
    raise HTTPException(status_code=404, detail="Course or user not found")

@router.post("/user-course/update-milestones")
async def update_milestones(
    course_name: str = Body(...),
    milestones: list = Body(...),  
    current_user: str = Depends(get_current_user)
):
    from database.mongo import user_collection

    
    user = await user_collection.find_one(
        {"username": current_user, "courses.courseName": course_name},
        {"courses.$": 1}
    )
    if not user or "courses" not in user or not user["courses"]:
        raise HTTPException(status_code=404, detail="Course or user not found")

    course = user["courses"][0]
    milestone_map = {m["week"]: m for m in milestones}

    for m in course["milestones"]:
        if m["week"] in milestone_map:
            m["completed"] = milestone_map[m["week"]]["completed"]
            m["date"] = milestone_map[m["week"]]["date"]

    result = await user_collection.update_one(
        {"username": current_user, "courses.courseName": course_name},
        {"$set": {"courses.$.milestones": course["milestones"]}}
    )
    if result.modified_count == 1:
        return {"message": "Milestones updated"}
    raise HTTPException(status_code=404, detail="Update failed")

@router.post("/user-course/complete")
async def complete_course(
    data: dict = Body(...),
    current_user: str = Depends(get_current_user)
):
    from database.mongo import user_collection
    
    
    course_name = data["course_name"]
    result = await user_collection.update_one(
        {"username": current_user, "courses.courseName": course_name},
        {"$set": {"courses.$.status": "completed"}}
    )
    if result.modified_count == 1:
        return {"message": "Course marked as completed"}
    raise HTTPException(status_code=404, detail="Course or user not found")