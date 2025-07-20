"""
Database connection and management
Handled by: Database Team
"""
import asyncpg
import os
from typing import Optional
from contextlib import asynccontextmanager

class DatabaseManager:
    def __init__(self):
        self._pool: Optional[asyncpg.Pool] = None
        self.database_url = os.getenv('NEON_DATABASE_URL')
    
    async def initialize(self):
        """Initialize database connection pool"""
        if not self._pool:
            self._pool = await asyncpg.create_pool(self.database_url)
    
    async def close(self):
        """Close database connection pool"""
        if self._pool:
            await self._pool.close()
    
    @asynccontextmanager
    async def get_connection(self):
        """Get database connection from pool"""
        if not self._pool:
            await self.initialize()
        
        async with self._pool.acquire() as connection:
            yield connection
    
    async def execute(self, query: str, *args):
        """Execute a query"""
        async with self.get_connection() as conn:
            return await conn.execute(query, *args)
    
    async def fetch(self, query: str, *args):
        """Fetch multiple rows"""
        async with self.get_connection() as conn:
            return await conn.fetch(query, *args)
    
    async def fetchval(self, query: str, *args):
        """Fetch single value"""
        async with self.get_connection() as conn:
            return await conn.fetchval(query, *args)
    
    async def fetchrow(self, query: str, *args):
        """Fetch single row"""
        async with self.get_connection() as conn:
            return await conn.fetchrow(query, *args)

# Global database manager instance
db = DatabaseManager() 