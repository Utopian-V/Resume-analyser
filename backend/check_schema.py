#!/usr/bin/env python3
"""
Check Database Schema
Purpose: Check what columns exist in the blogs table
"""
import asyncio
from core.database import db

async def check_schema():
    """Check the current database schema"""
    print("🔍 Checking Database Schema...")
    
    try:
        await db.initialize()
        
        # Check blogs table columns
        result = await db.fetch("""
            SELECT column_name, data_type, is_nullable 
            FROM information_schema.columns 
            WHERE table_name = 'blogs' 
            ORDER BY ordinal_position
        """)
        
        print("\n📋 Blogs Table Schema:")
        print("=" * 50)
        for row in result:
            nullable = "NULL" if row['is_nullable'] == 'YES' else "NOT NULL"
            print(f"  - {row['column_name']}: {row['data_type']} ({nullable})")
        
        # Check if blogs table exists
        table_check = await db.fetch("""
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'blogs'
            )
        """)
        
        if table_check[0]['exists']:
            print(f"\n✅ Blogs table exists")
        else:
            print(f"\n❌ Blogs table does not exist")
        
        # Count blogs
        count_result = await db.fetch("SELECT COUNT(*) as count FROM blogs")
        print(f"📊 Total blogs: {count_result[0]['count']}")
        
        await db.close()
        
    except Exception as e:
        print(f"❌ Error checking schema: {e}")

if __name__ == "__main__":
    asyncio.run(check_schema()) 