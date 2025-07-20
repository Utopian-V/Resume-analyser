#!/usr/bin/env python3
"""
Simple server test script
"""
import asyncio
import uvicorn
from main import app

if __name__ == "__main__":
    print("🚀 Starting server test...")
    try:
        uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        import traceback
        traceback.print_exc() 