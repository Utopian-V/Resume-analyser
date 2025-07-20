"""
Utility Functions for PrepNexus Backend
Handled by: Backend Team
Purpose: Common utility functions used across the application
"""
import pdfplumber
from typing import Optional

def extract_text_from_pdf(file_path: str) -> str:
    """
    Extract text content from a PDF file using pdfplumber.
    
    This function is used for resume analysis to extract text content
    from uploaded PDF resumes for skill assessment and analysis.
    
    Args:
        file_path (str): Path to the PDF file to extract text from
        
    Returns:
        str: Extracted text content from the PDF
        
    Raises:
        RuntimeError: If PDF extraction fails due to file corruption or unsupported format
        
    Note:
        Uses pdfplumber library which is more reliable than PyPDF2 for text extraction
        and handles various PDF formats including scanned documents with OCR.
    """
    try:
        with pdfplumber.open(file_path) as pdf:
            # Extract text from each page and join with newlines
            # Handle None values from pages that don't have extractable text
            text = "\n".join(page.extract_text() or "" for page in pdf.pages)
        return text
    except Exception as e:
        # Wrap the original exception with a more descriptive error message
        raise RuntimeError(f"PDF extraction failed: {str(e)}")

def validate_file_type(filename: str, allowed_extensions: list) -> bool:
    """
    Validate if a file has an allowed extension.
    
    Used for validating uploaded files (resumes, documents) before processing.
    
    Args:
        filename (str): Name of the file to validate
        allowed_extensions (list): List of allowed file extensions (e.g., ['.pdf', '.docx'])
        
    Returns:
        bool: True if file extension is allowed, False otherwise
    """
    return any(filename.lower().endswith(ext.lower()) for ext in allowed_extensions)

def sanitize_filename(filename: str) -> str:
    """
    Sanitize filename to prevent security issues.
    
    Removes potentially dangerous characters and ensures filename is safe
    for file system operations.
    
    Args:
        filename (str): Original filename to sanitize
        
    Returns:
        str: Sanitized filename safe for file operations
    """
    import re
    # Remove or replace dangerous characters
    sanitized = re.sub(r'[<>:"/\\|?*]', '_', filename)
    # Limit length to prevent issues
    return sanitized[:255]
