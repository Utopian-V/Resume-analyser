from fastapi import APIRouter, HTTPException, UploadFile, File
import aiofiles
import pdfplumber
import io
from modules.genai.resume_analyzer import resume_analyzer

router = APIRouter(prefix="/resume", tags=["resume"])

@router.post("/analyze")
async def analyze_resume(file: UploadFile = File(...)):
    """Analyze uploaded resume and return skill assessment"""
    try:
        # Validate file type
        if not file.filename.lower().endswith(('.pdf', '.docx', '.txt')):
            raise HTTPException(status_code=400, detail="Unsupported file type. Please upload PDF, DOCX, or TXT")
        
        # Read file content
        content = await file.read()
        
        # Extract text based on file type
        if file.filename.lower().endswith('.pdf'):
            resume_text = await extract_pdf_text(content)
        elif file.filename.lower().endswith('.txt'):
            resume_text = content.decode('utf-8')
        else:
            # For now, handle as text (DOCX support can be added later)
            resume_text = content.decode('utf-8')
        
        if not resume_text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from the uploaded file")
        
        # Analyze resume using AI
        analysis_result = await resume_analyzer.analyze_resume_text(resume_text)
        
        return analysis_result
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Resume analysis failed: {str(e)}")

async def extract_pdf_text(content: bytes) -> str:
    """Extract text from PDF content"""
    try:
        with pdfplumber.open(io.BytesIO(content)) as pdf:
            text = ""
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
            return text.strip()
    except Exception as e:
        raise Exception(f"Failed to extract text from PDF: {str(e)}") 