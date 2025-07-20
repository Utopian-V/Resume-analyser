#!/usr/bin/env python3
"""
Simple Redis Connection Test
Purpose: Debug Redis connection issues
"""
import asyncio
import os
import redis.asyncio as redis
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

async def test_redis_connection():
    """Test Redis connection with detailed error reporting"""
    
    print("🔧 Redis Connection Test")
    print("=" * 40)
    
    # Get Redis URL
    redis_url = os.getenv('REDIS_URL')
    print(f"📋 Redis URL: {redis_url}")
    
    if not redis_url:
        print("❌ No REDIS_URL found in environment")
        return
    
    try:
        print(f"\n🚀 Attempting to connect...")
        
        # Create Redis connection
        r = redis.from_url(
            redis_url,
            decode_responses=True,
            socket_connect_timeout=10,
            socket_timeout=10
        )
        
        # Test connection
        result = await r.ping()
        print(f"✅ Connection successful! Ping response: {result}")
        
        # Test basic operations
        print(f"\n🧪 Testing basic operations...")
        
        # Set a test key
        await r.set("test:connection", "Hello Redis!", ex=60)
        print(f"✅ Set operation successful")
        
        # Get the test key
        value = await r.get("test:connection")
        print(f"✅ Get operation successful: {value}")
        
        # Delete the test key
        await r.delete("test:connection")
        print(f"✅ Delete operation successful")
        
        # Get Redis info
        info = await r.info()
        print(f"\n📊 Redis Server Info:")
        print(f"  Version: {info.get('redis_version', 'Unknown')}")
        print(f"  Memory: {info.get('used_memory_human', 'Unknown')}")
        print(f"  Connected Clients: {info.get('connected_clients', 'Unknown')}")
        
        await r.close()
        print(f"\n🎉 All tests passed! Redis is working correctly.")
        
    except redis.AuthenticationError as e:
        print(f"❌ Authentication failed: {e}")
        print(f"💡 Check your username and password in the Redis URL")
        print(f"💡 Make sure you're using the correct credentials from your Redis provider")
        
    except redis.ConnectionError as e:
        print(f"❌ Connection failed: {e}")
        print(f"💡 Check if the Redis server is running and accessible")
        print(f"💡 Verify the host and port in your Redis URL")
        
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        print(f"💡 Check your Redis URL format")

if __name__ == "__main__":
    asyncio.run(test_redis_connection()) 