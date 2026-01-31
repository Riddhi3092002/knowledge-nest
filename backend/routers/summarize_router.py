import os
from dotenv import load_dotenv
from fastapi import FastAPI, Form, UploadFile, File, APIRouter, Depends, HTTPException
from openai import OpenAI
import fitz
import re

load_dotenv()
GROQ_API_KEY = os.getenv("OPENAI_API_KEY")
client = OpenAI(
    api_key=GROQ_API_KEY, 
    base_url="https://api.groq.com/openai/v1"
)
MODEL_NAME = "llama-3.3-70b-versatile"
router = APIRouter()

MAX_CHARS_PER_CHUNK = 1500  

def extract_text_from_pdf(file: UploadFile) -> str:
    doc = fitz.open(stream=file.file.read(), filetype="pdf")
    text = "".join([page.get_text() for page in doc])
    return text

def clean_text(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()

def chunk_text(text: str, max_chars=MAX_CHARS_PER_CHUNK):
    chunks = []
    text = text.strip()
    while len(text) > max_chars:
        chunk = text[:max_chars]
        last_period = chunk.rfind(".")
        if last_period != -1:
            chunk = chunk[:last_period+1]
        chunks.append(chunk.strip())
        text = text[len(chunk):].strip()
    if text:
        chunks.append(text)
    return chunks

def summarize_chunk(text: str) -> str:
    response = client.chat.completions.create(
        model=MODEL_NAME,
        messages=[
            {"role": "system", "content": "You are a helpful assistant who summarizes text."},
            {"role": "user", "content": f"Summarize this text concisely:\n\n{text}"}
        ],
        temperature=0.3,
        max_tokens=500
    )
    return response.choices[0].message.content.strip()

def summarize_text(text: str) -> str:
    text = clean_text(text)
    chunks = chunk_text(text)
    summaries = [summarize_chunk(chunk) for chunk in chunks]
    return " ".join(summaries)

@router.post("/summarize/")
async def summarize_endpoint(text: str = Form(None), pdf: UploadFile = File(None)):
    if pdf:
        text = extract_text_from_pdf(pdf)
    if not text or text.strip() == "":
        return {"error": "No text or file provided."}
    summary = summarize_text(text)
    return {"summary": summary}
