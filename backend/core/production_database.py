"""
Production Database Manager
Handled by: Database Team
Purpose: Production-ready database management with proper failover and monitoring

This follows industry best practices:
- Connection pooling for performance
- Health checks and circuit breakers
- Proper error handling and logging
- No dual database complexity
- Production-ready monitoring
"""
import asyncpg
import asyncio
import os
import logging
import time
from typing import Optional, Dict, Any
from contextlib import asynccontextmanager
from dataclasses import dataclass
from datetime import datetime, timedelta

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class DatabaseConfig:
    """Database configuration"""
    host: str
    port: int
    database: str
    user: str
    password: str
    min_connections: int = 5
    max_connections: int = 20
    connection_timeout: int = 30
    command_timeout: int = 60

@dataclass
class HealthStatus:
    """Database health status"""
    is_healthy: bool
    response_time_ms: float
    active_connections: int
    total_connections: int
    last_check: datetime
    error_count: int
    last_error: Optional[str] = None

class ProductionDatabaseManager:
    def __init__(self):
        self._pool: Optional[asyncpg.Pool] = None
        self._config = self._load_config()
        self._health_status = HealthStatus(
            is_healthy=False,
            response_time_ms=0.0,
            active_connections=0,
            total_connections=0,
            last_check=datetime.now(),
            error_count=0
        )
        self._circuit_breaker_open = False
        self._circuit_breaker_threshold = 5
        self._circuit_breaker_timeout = 60  # seconds
        
    def _load_config(self) -> DatabaseConfig:
        """Load database configuration from environment"""
        return DatabaseConfig(
            host=os.getenv('DB_HOST', 'localhost'),
            port=int(os.getenv('DB_PORT', '5432')),
            database=os.getenv('DB_NAME', 'prepnexus'),
            user=os.getenv('DB_USER', 'postgres'),
            password=os.getenv('DB_PASSWORD', ''),
            min_connections=int(os.getenv('DB_MIN_CONNECTIONS', '5')),
            max_connections=int(os.getenv('DB_MAX_CONNECTIONS', '20')),
            connection_timeout=int(os.getenv('DB_CONNECTION_TIMEOUT', '30')),
            command_timeout=int(os.getenv('DB_COMMAND_TIMEOUT', '60'))
        )
    
    async def initialize(self):
        """Initialize database connection pool"""
        logger.info("🔗 Initializing production database connection...")
        
        try:
            # Create connection pool
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
                    'application_name': 'prepnexus_backend'
                }
            )
            
            # Test connection
            await self._health_check()
            
            if self._health_status.is_healthy:
                logger.info("✅ Production database connection established")
            else:
                raise Exception("Database health check failed")
                
        except Exception as e:
            logger.error(f"❌ Database initialization failed: {e}")
            self._health_status.error_count += 1
            self._health_status.last_error = str(e)
            raise
    
    async def _health_check(self) -> bool:
        """Perform database health check"""
        start_time = time.time()
        
        try:
            async with self._pool.acquire() as conn:
                # Test basic connectivity
                result = await conn.fetchval("SELECT 1")
                
                # Get connection pool stats
                pool_stats = self._pool.get_size()
                
                # Update health status
                self._health_status.is_healthy = True
                self._health_status.response_time_ms = (time.time() - start_time) * 1000
                self._health_status.active_connections = pool_stats['active']
                self._health_status.total_connections = pool_stats['total']
                self._health_status.last_check = datetime.now()
                
                # Reset circuit breaker if healthy
                if self._circuit_breaker_open:
                    self._circuit_breaker_open = False
                    logger.info("🔄 Circuit breaker closed - database is healthy")
                
                return True
                
        except Exception as e:
            self._health_status.is_healthy = False
            self._health_status.error_count += 1
            self._health_status.last_error = str(e)
            self._health_status.last_check = datetime.now()
            
            # Check circuit breaker
            if self._health_status.error_count >= self._circuit_breaker_threshold:
                self._circuit_breaker_open = True
                logger.error(f"🚨 Circuit breaker opened - too many errors: {e}")
            
            return False
    
    async def close(self):
        """Close database connection pool"""
        if self._pool:
            await self._pool.close()
            logger.info("🛑 Database connection pool closed")
    
    @asynccontextmanager
    async def get_connection(self):
        """Get database connection with health check"""
        if self._circuit_breaker_open:
            raise Exception("Circuit breaker is open - database unavailable")
        
        if not self._health_status.is_healthy:
            await self._health_check()
        
        async with self._pool.acquire() as connection:
            yield connection
    
    async def execute(self, query: str, *args):
        """Execute a query with error handling"""
        try:
            async with self.get_connection() as conn:
                return await conn.execute(query, *args)
        except Exception as e:
            logger.error(f"Query execution failed: {e}")
            self._health_status.error_count += 1
            raise
    
    async def fetch(self, query: str, *args):
        """Fetch multiple rows with error handling"""
        try:
            async with self.get_connection() as conn:
                return await conn.fetch(query, *args)
        except Exception as e:
            logger.error(f"Query fetch failed: {e}")
            self._health_status.error_count += 1
            raise
    
    async def fetchval(self, query: str, *args):
        """Fetch single value with error handling"""
        try:
            async with self.get_connection() as conn:
                return await conn.fetchval(query, *args)
        except Exception as e:
            logger.error(f"Query fetchval failed: {e}")
            self._health_status.error_count += 1
            raise
    
    async def fetchrow(self, query: str, *args):
        """Fetch single row with error handling"""
        try:
            async with self.get_connection() as conn:
                return await conn.fetchrow(query, *args)
        except Exception as e:
            logger.error(f"Query fetchrow failed: {e}")
            self._health_status.error_count += 1
            raise
    
    async def get_health_report(self) -> Dict[str, Any]:
        """Get comprehensive health report"""
        await self._health_check()
        
        return {
            "status": "healthy" if self._health_status.is_healthy else "unhealthy",
            "database": {
                "host": self._config.host,
                "port": self._config.port,
                "database": self._config.database,
                "user": self._config.user
            },
            "performance": {
                "response_time_ms": self._health_status.response_time_ms,
                "active_connections": self._health_status.active_connections,
                "total_connections": self._health_status.total_connections
            },
            "circuit_breaker": {
                "open": self._circuit_breaker_open,
                "error_count": self._health_status.error_count,
                "threshold": self._circuit_breaker_threshold
            },
            "last_check": self._health_status.last_check.isoformat(),
            "last_error": self._health_status.last_error
        }

# Global production database manager instance
db = ProductionDatabaseManager() 