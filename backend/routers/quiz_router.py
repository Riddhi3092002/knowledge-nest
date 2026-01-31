import re
from typing import List
import os
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from auth.dependencies import get_current_user
from openai import OpenAI
from models.quiz_model import Question, QuizRequest, QuizResponse

load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
client = OpenAI(
    api_key=GROQ_API_KEY, 
    base_url="https://api.groq.com/openai/v1"
)
MODEL_NAME = "llama-3.3-70b-versatile"

router = APIRouter()
def github_generate_quiz(skills: str) -> str:
    prompt = f"""
    You are a helpful assistant. Generate 3 multiple-choice questions (A-D) to test knowledge of the following skills: {skills}.
    
    Formatting rules:
    1. Each question must start with "Question X:".
    2. Question text immediately after "Question X:".
    3. Options as a), b), c), d).
    4. Correct answer on separate line: "Answer: X".
    5. Separate questions with "---".
    6. Do NOT include the skill/topic in the question title.
    """
    response = client.chat.completions.create(
        model=MODEL_NAME,
        messages=[
            {"role": "system", "content": "You are a helpful assistant who generates quizzes."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.3,
        max_tokens=500
    )
    return response.choices[0].message.content.strip()

def parse_gpt_quiz(text: str) -> QuizResponse:
    questions = []

    blocks = text.split("---")
    for block in blocks:
        block = block.strip()
        if not block:
            continue

        q_match = re.search(r'Question \d+:\s*(.*?)\n[a-d]\)', block, re.DOTALL)
        if not q_match:
            continue
        q_text = q_match.group(1).strip()

        opts = re.findall(r'[a-d]\)\s.*', block, re.IGNORECASE)

        ans_match = re.search(r'Answer:\s*([a-dA-D])', block)
        ans = ans_match.group(1).upper() if ans_match else ""

        if q_text and opts and ans:
            questions.append(Question(question=q_text, options=opts, answer=ans))

    return QuizResponse(questions=questions)

@router.post("/generate/", response_model=QuizResponse)
async def generate_quiz(request: QuizRequest):
    if not request.skills.strip():
        raise HTTPException(status_code=400, detail="No skills provided.")
    text = github_generate_quiz(request.skills)
    print(text)
    quiz = parse_gpt_quiz(text)
    return quiz

@router.get("/completed-skills/")
async def get_user_skills(current_user: str = Depends(get_current_user)):
    from database.mongo import user_collection, courses_collection

    user = await user_collection.find_one({"username": current_user}, {"courses.courseName": 1})
    if not user or "courses" not in user:
        raise HTTPException(status_code=404, detail="User or courses not found")

    course_names = [c["courseName"] for c in user["courses"]]
    skills_set = set()

    courses_cursor = courses_collection.find({"Title": {"$in": course_names}}, {"Skills": 1})
    async for course in courses_cursor:
        skills_str = course.get("Skills", "")
        skills = [s.strip() for s in skills_str.split(",") if s.strip()]
        skills_set.update(skills)

    return list(skills_set)