import os
import pdfplumber
import requests
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama3-8b-8192")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def extract_text_from_pdf(file_path):
    try:
        with pdfplumber.open(file_path) as pdf:
            text = "\n".join(page.extract_text() or "" for page in pdf.pages)
        return text
    except Exception as e:
        raise RuntimeError(f"PDF extraction failed: {str(e)}")

def build_prompt(resume_text):
    return (
        "You are a professional resume reviewer. Analyze the following resume text and provide feedback in the following JSON format ONLY (do not include any explanation or text outside the JSON):\n"
        "{\n"
        "  \"score\": <number>,\n"
        "  \"ats_compliance\": {\n"
        "    \"score\": <number>,\n"
        "    \"issues\": [<string>],\n"
        "    \"passed_checks\": [<string>],\n"
        "    \"failed_checks\": [<string>]\n"
        "  },\n"
        "  \"improvements\": [\n"
        "    {\n"
        "      \"suggestion\": <string>,\n"
        "      \"reason\": <string>,\n"
        "      \"highlight_text\": <string>\n"
        "    }\n"
        "  ],\n"
        "  \"skill_match\": {\n"
        "    \"matched_skills\": [<string>],\n"
        "    \"missing_skills\": [<string>]\n"
        "  },\n"
        "  \"targeted_roles\": [<string>],\n"
        "  \"red_flags\": [<string>],\n"
        "  \"comments\": <string>\n"
        "}\n"
        "Resume:\n"
        "'''\n"
        f"{resume_text}\n"
        "'''\n"
        "Return ONLY valid JSON, no explanation, no markdown, no extra text."
    )

def call_groq(prompt, model=GROQ_MODEL):
    try:
        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": model,
                "messages": [
                    {"role": "user", "content": prompt}
                ],
                "max_tokens": 1200,
                "temperature": 0.4,
            },
            timeout=60
        )
        response.raise_for_status()
        data = response.json()
        return data["choices"][0]["message"]["content"]
    except Exception as e:
        raise RuntimeError(f"Groq API error: {str(e)}")

@app.post("/analyze-resume/")
async def analyze_resume(file: UploadFile = File(...)):
    file_location = f"temp_{file.filename}"
    with open(file_location, "wb") as f:
        f.write(await file.read())
    try:
        resume_text = extract_text_from_pdf(file_location)
        if not resume_text.strip():
            return JSONResponse(content={"error": "No extractable text found in PDF. Please upload a text-based resume PDF."}, status_code=400)
        prompt = build_prompt(resume_text)
        try:
            content = call_groq(prompt)
        except Exception as oe:
            return JSONResponse(content={"error": f"Groq API error: {str(oe)}"}, status_code=500)
        import json
        import re
        match = re.search(r"\{.*\}", content, re.DOTALL)
        if match:
            try:
                feedback = json.loads(match.group())
            except Exception as je:
                feedback = {"error": f"LLM response JSON parse error: {str(je)}", "llm_response": content}
        else:
            feedback = {"error": "Could not parse LLM response.", "llm_response": content}
        if os.getenv("DEBUG_FEEDBACK") == "1":
            feedback["_debug"] = {"extracted_text": resume_text, "llm_response": content}
        return JSONResponse(content=feedback)
    except Exception as e:
        import traceback
        print("Exception in /analyze-resume/:", e)
        traceback.print_exc()
        return JSONResponse(content={"error": f"Server error: {str(e)}"}, status_code=500)
    finally:
        os.remove(file_location) 