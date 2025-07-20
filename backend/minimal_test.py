#!/usr/bin/env python3
"""
Minimal database test
"""
import asyncio
from core.database import db

async def test_db():
    try:
        print("Testing database connection...")
        await db.initialize()
        print("✅ Database initialized successfully")
        
        # Test a simple query
        result = await db.fetchval("SELECT 1")
        print(f"✅ Database query successful: {result}")
        
        await db.close()
        print("✅ Database closed successfully")
        
    except Exception as e:
        print(f"❌ Database test failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_db()) 