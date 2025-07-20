"""
Database connection and management
Handled by: Database Team
Purpose: High-performance database management with caching and optimization

This module provides an optimized database interface that:
- Uses PostgreSQL with intelligent connection pooling
- Implements Redis caching for maximum performance
- Provides background health monitoring
- Optimizes queries and reduces latency
"""
from .optimized_database import db

# Re-export the optimized database manager
# This provides a clean interface for the rest of the application 