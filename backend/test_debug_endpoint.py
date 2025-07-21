#!/usr/bin/env python3
"""
Test Debug Endpoint
Purpose: Test the debug endpoint locally
"""
import asyncio
from core.database import db

async def test_debug_query():
    """Test the debug query locally"""
    print("🔍 Testing Debug Query...")
    
    try:
        await db.initialize()
        
        # Test basic database connection
        await db.execute("SELECT 1")
        print("✅ Basic connection test passed")
        
        # Check if blogs table exists
        table_check = await db.fetch("""
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'blogs'
            )
        """)
        
        if not table_check[0]['exists']:
            print("❌ Blogs table does not exist")
            return False
        
        print("✅ Blogs table exists")
        
        # Check table schema
        schema = await db.fetch("""
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'blogs' 
            ORDER BY ordinal_position
        """)
        
        print("📋 Schema:")
        for row in schema:
            print(f"  - {row['column_name']}: {row['data_type']}")
        
        # Count blogs
        count = await db.fetchval("SELECT COUNT(*) FROM blogs")
        print(f"📊 Blog count: {count}")
        
        await db.close()
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    asyncio.run(test_debug_query()) 