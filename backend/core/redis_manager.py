"""
Redis Manager for High-Performance Caching
Handled by: DevOps Team
Purpose: Redis caching and session management

This module provides:
- Intelligent caching with TTL management
- Session storage and management
- Cache invalidation patterns
- Performance monitoring
- Fallback mechanisms
"""
import redis.asyncio as redis
import json
import os
import logging
import time
from typing import Optional, Any, Dict, List
from datetime import datetime, date
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logger = logging.getLogger(__name__)

class DateTimeEncoder(json.JSONEncoder):
    """Custom JSON encoder to handle datetime objects"""
    def default(self, obj):
        if isinstance(obj, (datetime, date)):
            return obj.isoformat()
        return super().default(obj)

class RedisManager:
    def __init__(self):
        self._redis: Optional[redis.Redis] = None
        self._is_connected = False
        self._cache_stats = {
            "hits": 0,
            "misses": 0,
            "sets": 0,
            "deletes": 0
        }
        
    async def initialize(self):
        """Initialize Redis connection"""
        try:
            # Check for REDIS_URL first (Render/Cloud standard)
            redis_url = os.getenv('REDIS_URL')
            if redis_url:
                self._redis = redis.from_url(
                    redis_url,
                    decode_responses=True,
                    socket_connect_timeout=5,
                    socket_timeout=5,
                    retry_on_timeout=True,
                    health_check_interval=30
                )
            else:
                # Fallback to individual parameters
                self._redis = redis.Redis(
                    host=os.getenv('REDIS_HOST', 'localhost'),
                    port=int(os.getenv('REDIS_PORT', '6379')),
                    password=os.getenv('REDIS_PASSWORD'),
                    db=int(os.getenv('REDIS_DB', '0')),
                    decode_responses=True,
                    socket_connect_timeout=5,
                    socket_timeout=5,
                    retry_on_timeout=True,
                    health_check_interval=30
                )
            
            # Test connection
            await self._redis.ping()
            self._is_connected = True
            logger.info("✅ Redis connection established")
            
        except Exception as e:
            logger.warning(f"⚠️ Redis connection failed: {e}")
            self._redis = None
            self._is_connected = False
    
    async def close(self):
        """Close Redis connection"""
        if self._redis:
            await self._redis.close()
            logger.info("🛑 Redis connection closed")
    
    def is_connected(self) -> bool:
        """Check if Redis is connected"""
        return self._is_connected
    
    # Cache Management Methods
    async def get(self, key: str, default: Any = None) -> Any:
        """Get value from cache"""
        if not self._is_connected:
            return default
        
        try:
            value = await self._redis.get(key)
            if value is not None:
                self._cache_stats["hits"] += 1
                return json.loads(value)
            else:
                self._cache_stats["misses"] += 1
                return default
        except Exception as e:
            logger.error(f"Redis get error: {e}")
            self._cache_stats["misses"] += 1
            return default
    
    async def set(self, key: str, value: Any, ttl: int = 300) -> bool:
        """Set value in cache with TTL"""
        if not self._is_connected:
            return False
        
        try:
            # Use custom encoder to handle datetime objects
            serialized_value = json.dumps(value, cls=DateTimeEncoder)
            await self._redis.setex(key, ttl, serialized_value)
            self._cache_stats["sets"] += 1
            return True
        except Exception as e:
            logger.error(f"Redis set error: {e}")
            return False
    
    async def delete(self, key: str) -> bool:
        """Delete key from cache"""
        if not self._is_connected:
            return False
        
        try:
            result = await self._redis.delete(key)
            self._cache_stats["deletes"] += 1
            return result > 0
        except Exception as e:
            logger.error(f"Redis delete error: {e}")
            return False
    
    async def exists(self, key: str) -> bool:
        """Check if key exists"""
        if not self._is_connected:
            return False
        
        try:
            return await self._redis.exists(key) > 0
        except Exception as e:
            logger.error(f"Redis exists error: {e}")
            return False
    
    async def expire(self, key: str, ttl: int) -> bool:
        """Set expiration for key"""
        if not self._is_connected:
            return False
        
        try:
            return await self._redis.expire(key, ttl)
        except Exception as e:
            logger.error(f"Redis expire error: {e}")
            return False
    
    # Pattern-based operations
    async def delete_pattern(self, pattern: str) -> int:
        """Delete all keys matching pattern"""
        if not self._is_connected:
            return 0
        
        try:
            keys = await self._redis.keys(pattern)
            if keys:
                result = await self._redis.delete(*keys)
                self._cache_stats["deletes"] += result
                return result
            return 0
        except Exception as e:
            logger.error(f"Redis delete pattern error: {e}")
            return 0
    
    async def get_pattern(self, pattern: str) -> Dict[str, Any]:
        """Get all keys and values matching pattern"""
        if not self._is_connected:
            return {}
        
        try:
            keys = await self._redis.keys(pattern)
            result = {}
            for key in keys:
                value = await self.get(key)
                if value is not None:
                    result[key] = value
            return result
        except Exception as e:
            logger.error(f"Redis get pattern error: {e}")
            return {}
    
    # Cache invalidation helpers
    async def invalidate_blogs_cache(self):
        """Invalidate all blog-related cache"""
        return await self.delete_pattern("cache:blogs:*")
    
    async def invalidate_users_cache(self):
        """Invalidate all user-related cache"""
        return await self.delete_pattern("cache:users:*")
    
    async def invalidate_jobs_cache(self):
        """Invalidate all job-related cache"""
        return await self.delete_pattern("cache:jobs:*")
    
    async def invalidate_all_cache(self):
        """Invalidate all cache"""
        return await self.delete_pattern("cache:*")
    
    # Session management
    async def set_session(self, session_id: str, data: Dict[str, Any], ttl: int = 3600) -> bool:
        """Set session data"""
        return await self.set(f"session:{session_id}", data, ttl)
    
    async def get_session(self, session_id: str) -> Optional[Dict[str, Any]]:
        """Get session data"""
        return await self.get(f"session:{session_id}")
    
    async def delete_session(self, session_id: str) -> bool:
        """Delete session"""
        return await self.delete(f"session:{session_id}")
    
    # Rate limiting
    async def increment_rate_limit(self, key: str, ttl: int = 60) -> int:
        """Increment rate limit counter"""
        if not self._is_connected:
            return 0
        
        try:
            pipe = self._redis.pipeline()
            pipe.incr(key)
            pipe.expire(key, ttl)
            results = await pipe.execute()
            return results[0]
        except Exception as e:
            logger.error(f"Redis rate limit error: {e}")
            return 0
    
    async def check_rate_limit(self, key: str, limit: int) -> bool:
        """Check if rate limit exceeded"""
        current = await self.increment_rate_limit(key)
        return current <= limit
    
    # Performance monitoring
    def get_cache_stats(self) -> Dict[str, Any]:
        """Get cache performance statistics"""
        total_requests = self._cache_stats["hits"] + self._cache_stats["misses"]
        hit_rate = (self._cache_stats["hits"] / total_requests * 100) if total_requests > 0 else 0
        
        return {
            "connected": self._is_connected,
            "hits": self._cache_stats["hits"],
            "misses": self._cache_stats["misses"],
            "sets": self._cache_stats["sets"],
            "deletes": self._cache_stats["deletes"],
            "total_requests": total_requests,
            "hit_rate_percent": round(hit_rate, 2),
            "efficiency": "excellent" if hit_rate > 80 else "good" if hit_rate > 60 else "needs_optimization"
        }
    
    async def get_redis_info(self) -> Dict[str, Any]:
        """Get Redis server information"""
        if not self._is_connected:
            return {"error": "Redis not connected"}
        
        try:
            info = await self._redis.info()
            return {
                "version": info.get("redis_version"),
                "connected_clients": info.get("connected_clients"),
                "used_memory_human": info.get("used_memory_human"),
                "total_commands_processed": info.get("total_commands_processed"),
                "keyspace_hits": info.get("keyspace_hits"),
                "keyspace_misses": info.get("keyspace_misses")
            }
        except Exception as e:
            logger.error(f"Redis info error: {e}")
            return {"error": str(e)}
    
    # Health check
    async def health_check(self) -> bool:
        """Perform Redis health check"""
        if not self._is_connected:
            return False
        
        try:
            await self._redis.ping()
            return True
        except Exception as e:
            logger.error(f"Redis health check failed: {e}")
            self._is_connected = False
            return False

# Global Redis manager instance
redis_manager = RedisManager() 