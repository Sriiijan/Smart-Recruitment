from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from langchain_community.document_loaders import PyPDFLoader
import tempfile
import os

from analyzer import analyze_resume_with_jd

app = FastAPI(title="Smart Recruitment API")

# Allow frontend (React) access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze")
async def analyze(
    resume: UploadFile = File(...),
    job_description: str = Form(...)
):
    # Save resume temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        tmp.write(await resume.read())
        path = tmp.name

    try:
        loader = PyPDFLoader(path)
        docs = loader.load()
        resume_text = "\n".join(d.page_content for d in docs)
    finally:
        os.remove(path)

    result = analyze_resume_with_jd(resume_text, job_description)

    return result
