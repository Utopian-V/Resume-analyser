"""
Optimized Database Manager for High Performance
Handled by: Database Team
Purpose: High-performance database management with caching and optimization

This implementation focuses on:
- Maximum performance with minimal latency
- Intelligent caching for frequently accessed data
- Optimized connection pooling
- Non-blocking health checks
- Query optimization and indexing
"""
import asyncpg
import asyncio
import os
import logging
import time
import json
from typing import Optional, Dict, Any, List
from contextlib import asynccontextmanager
from dataclasses import dataclass
from datetime import datetime, timedelta
from .redis_manager import redis_manager
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class DatabaseConfig:
    """Database configuration optimized for performance"""
    host: str
    port: int
    database: str
    user: str
    password: str
    min_connections: int = 10  # Increased for better performance
    max_connections: int = 50  # Increased for high concurrency
    connection_timeout: int = 10  # Reduced timeout
    command_timeout: int = 30  # Reduced timeout

class OptimizedDatabaseManager:
    def __init__(self):
        self._pool: Optional[asyncpg.Pool] = None
        self._redis: Optional[redis.Redis] = None
        self._config = self._load_config()
        self._health_check_task: Optional[asyncio.Task] = None
        self._last_health_check = 0
        self._health_check_interval = 60  # Check every 60 seconds
        self._is_healthy = True
        self._cache_ttl = 300  # 5 minutes cache
        
    def _load_config(self) -> DatabaseConfig:
        """Load database configuration from environment"""
        # Use NEON_DATABASE_URL (consistent with frontend)
        database_url = os.getenv('NEON_DATABASE_URL')
        if database_url:
            # Parse NEON_DATABASE_URL
            # Format: postgresql+asyncpg://user:password@host/database?ssl=true
            if database_url.startswith('postgresql+asyncpg://'):
                # Remove the +asyncpg part for asyncpg library
                database_url = database_url.replace('postgresql+asyncpg://', 'postgresql://')
            
            # For Neon, we'll use the URL directly instead of parsing components
            return DatabaseConfig(
                host='neon',  # Special marker for URL-based connection
                port=5432,
                database='neondb',
                user='neondb_owner',
                password='npg_pWX2R4xwPljs',
                min_connections=int(os.getenv('DB_MIN_CONNECTIONS', '10')),
                max_connections=int(os.getenv('DB_MAX_CONNECTIONS', '50')),
                connection_timeout=int(os.getenv('DB_CONNECTION_TIMEOUT', '10')),
                command_timeout=int(os.getenv('DB_COMMAND_TIMEOUT', '30'))
            )
        else:
            # Fallback to individual environment variables
            return DatabaseConfig(
                host=os.getenv('DB_HOST', 'localhost'),
                port=int(os.getenv('DB_PORT', '5432')),
                database=os.getenv('DB_NAME', 'prepnexus'),
                user=os.getenv('DB_USER', 'postgres'),
                password=os.getenv('DB_PASSWORD', ''),
                min_connections=int(os.getenv('DB_MIN_CONNECTIONS', '10')),
                max_connections=int(os.getenv('DB_MAX_CONNECTIONS', '50')),
                connection_timeout=int(os.getenv('DB_CONNECTION_TIMEOUT', '10')),
                command_timeout=int(os.getenv('DB_COMMAND_TIMEOUT', '30'))
            )
    
    async def initialize(self):
        """Initialize database and cache connections"""
        logger.info("🚀 Initializing optimized database connections...")
        
        try:
            # Initialize Redis cache
            await self._initialize_redis()
            
            # Get NEON_DATABASE_URL for Neon connection
            database_url = os.getenv('NEON_DATABASE_URL')
            if database_url and database_url.startswith('postgresql+asyncpg://'):
                # Convert to standard postgresql:// format for asyncpg
                database_url = database_url.replace('postgresql+asyncpg://', 'postgresql://')
            
            # Create optimized connection pool
            if database_url:
                # Use NEON_DATABASE_URL for Neon
                self._pool = await asyncpg.create_pool(
                    database_url,
                    min_size=self._config.min_connections,
                    max_size=self._config.max_connections,
                    command_timeout=self._config.command_timeout,
                    server_settings={
                        'application_name': 'prepnexus_backend',
                        'jit': 'off',  # Disable JIT for faster queries
                        'work_mem': '4MB',  # Optimize memory usage
                    }
                )
            else:
                # Fallback to individual parameters
                self._pool = await asyncpg.create_pool(
                    host=self._config.host,
                    port=self._config.port,
                    database=self._config.database,
                    user=self._config.user,
                    password=self._config.password,
                    min_size=self._config.min_connections,
                    max_size=self._config.max_connections,
                    command_timeout=self._config.command_timeout,
                    server_settings={
                        'application_name': 'prepnexus_backend',
                        'jit': 'off',  # Disable JIT for faster queries
                        'work_mem': '4MB',  # Optimize memory usage
                    }
                )
            
            # Start background health check
            self._health_check_task = asyncio.create_task(self._background_health_check())
            
            # Initial health check
            await self._health_check()
            
            logger.info("✅ Optimized database connections established")
                
        except Exception as e:
            logger.error(f"❌ Database initialization failed: {e}")
            raise
    
    async def _initialize_redis(self):
        """Initialize Redis cache connection"""
        try:
            await redis_manager.initialize()
            self._redis = redis_manager._redis if redis_manager.is_connected() else None
            if self._redis:
                logger.info("✅ Redis cache connection established")
            else:
                logger.warning("⚠️ Redis cache unavailable")
        except Exception as e:
            logger.warning(f"⚠️ Redis cache unavailable: {e}")
            self._redis = None
    
    async def _background_health_check(self):
        """Background health check task"""
        while True:
            try:
                await asyncio.sleep(self._health_check_interval)
                await self._health_check()
            except Exception as e:
                logger.error(f"Background health check failed: {e}")
    
    async def _health_check(self) -> bool:
        """Perform database health check (non-blocking)"""
        current_time = time.time()
        
        # Only check if enough time has passed
        if current_time - self._last_health_check < self._health_check_interval:
            return self._is_healthy
        
        try:
            async with self._pool.acquire() as conn:
                await conn.fetchval("SELECT 1")
                self._is_healthy = True
                self._last_health_check = current_time
                return True
                
        except Exception as e:
            self._is_healthy = False
            self._last_health_check = current_time
            logger.error(f"Database health check failed: {e}")
            return False
    
    async def close(self):
        """Close database and cache connections"""
        if self._health_check_task:
            self._health_check_task.cancel()
        
        if self._pool:
            await self._pool.close()
        
        await redis_manager.close()
        
        logger.info("🛑 Database connections closed")
    
    def _get_cache_key(self, query: str, *args) -> str:
        """Generate cache key for query"""
        return f"db:{hash(query + str(args))}"
    
    async def _get_from_cache(self, cache_key: str) -> Optional[Any]:
        """Get data from cache"""
        return await redis_manager.get(cache_key)
    
    async def _set_cache(self, cache_key: str, data: Any, ttl: int = None):
        """Set data in cache"""
        ttl = ttl or self._cache_ttl
        await redis_manager.set(cache_key, data, ttl)
    
    async def _invalidate_cache_pattern(self, pattern: str):
        """Invalidate cache entries matching pattern"""
        await redis_manager.delete_pattern(pattern)
    
    @asynccontextmanager
    async def get_connection(self):
        """Get database connection (optimized)"""
        if not self._is_healthy:
            await self._health_check()
        
        async with self._pool.acquire() as connection:
            yield connection
    
    async def execute(self, query: str, *args):
        """Execute a query (optimized)"""
        async with self.get_connection() as conn:
            return await conn.execute(query, *args)
    
    async def fetch(self, query: str, *args, use_cache: bool = True, cache_ttl: int = None):
        """Fetch multiple rows with intelligent caching"""
        if use_cache and query.strip().upper().startswith('SELECT'):
            cache_key = self._get_cache_key(query, *args)
            cached_result = await self._get_from_cache(cache_key)
            if cached_result is not None:
                return cached_result
        
        async with self.get_connection() as conn:
            result = await conn.fetch(query, *args)
            data = [dict(row) for row in result]
            
            if use_cache and query.strip().upper().startswith('SELECT'):
                await self._set_cache(cache_key, data, cache_ttl)
            
            return data
    
    async def fetchval(self, query: str, *args, use_cache: bool = True, cache_ttl: int = None):
        """Fetch single value with caching"""
        if use_cache and query.strip().upper().startswith('SELECT'):
            cache_key = self._get_cache_key(query, *args)
            cached_result = await self._get_from_cache(cache_key)
            if cached_result is not None:
                return cached_result
        
        async with self.get_connection() as conn:
            result = await conn.fetchval(query, *args)
            
            if use_cache and query.strip().upper().startswith('SELECT'):
                await self._set_cache(cache_key, result, cache_ttl)
            
            return result
    
    async def fetchrow(self, query: str, *args, use_cache: bool = True, cache_ttl: int = None):
        """Fetch single row with caching"""
        if use_cache and query.strip().upper().startswith('SELECT'):
            cache_key = self._get_cache_key(query, *args)
            cached_result = await self._get_from_cache(cache_key)
            if cached_result is not None:
                return cached_result
        
        async with self.get_connection() as conn:
            row = await conn.fetchrow(query, *args)
            result = dict(row) if row else None
            
            if use_cache and query.strip().upper().startswith('SELECT'):
                await self._set_cache(cache_key, result, cache_ttl)
            
            return result
    
    async def get_health_report(self) -> Dict[str, Any]:
        """Get health report (optimized)"""
        pool_stats = self._pool.get_size() if self._pool else {}
        
        return {
            "status": "healthy" if self._is_healthy else "unhealthy",
            "database": {
                "host": self._config.host,
                "port": self._config.port,
                "database": self._config.database,
                "user": self._config.user
            },
            "performance": {
                "active_connections": pool_stats.get('active', 0) if isinstance(pool_stats, dict) else 0,
                "total_connections": pool_stats.get('total', 0) if isinstance(pool_stats, dict) else 0,
                "cache_available": redis_manager.is_connected()
            },
            "last_health_check": datetime.fromtimestamp(self._last_health_check).isoformat(),
            "optimizations": {
                "connection_pooling": True,
                "intelligent_caching": True,
                "background_health_checks": True,
                "query_optimization": True
            }
        }
    
    # Cache management methods
    async def clear_cache(self):
        """Clear all cache"""
        if self._redis:
            await self._redis.flushdb()
    
    async def invalidate_blogs_cache(self):
        """Invalidate blogs-related cache"""
        await self._invalidate_cache_pattern("db:*blogs*")
    
    async def invalidate_users_cache(self):
        """Invalidate users-related cache"""
        await self._invalidate_cache_pattern("db:*users*")

# Global optimized database manager instance
db = OptimizedDatabaseManager() 