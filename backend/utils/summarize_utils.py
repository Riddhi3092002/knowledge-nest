from transformers import pipeline
import fitz  
import docx2txt

# Load model once
summarizer = pipeline("summarization", model="t5-small", tokenizer="t5-small")

def summarize_text(text: str) -> str:
    # T5-small has a token limit of ~512
    words = text.split()
    if len(words) > 512:
        text = " ".join(words[:512])

    input_text = "summarize: " + text
    summary = summarizer(input_text, max_length=120, min_length=30, do_sample=False)
    return summary[0]['summary_text']

async def extract_text_from_file(file) -> str:
    contents = await file.read()

    if file.filename.endswith(".pdf"):
        return extract_text_from_pdf(contents)
    elif file.filename.endswith(".txt"):
        return contents.decode("utf-8")
    elif file.filename.endswith(".docx"):
        return docx2txt.process(file.file)
    else:
        return ""

def extract_text_from_pdf(binary_data: bytes) -> str:
    text = ""
    with fitz.open(stream=binary_data, filetype="pdf") as doc:
        for page in doc:
            text += page.get_text()
    return text
