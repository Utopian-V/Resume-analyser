"""
Performance Monitoring Endpoints
Handled by: DevOps Team
Purpose: Performance monitoring and optimization

This module provides performance monitoring endpoints that:
- Track response times and throughput
- Monitor database performance
- Provide cache statistics
- Help identify bottlenecks
"""
from fastapi import APIRouter, HTTPException
from typing import Dict, Any
import time
import psutil
import asyncio
from core.database import db

router = APIRouter(prefix="/performance", tags=["performance"])

# Performance tracking
_request_times = {}
_cache_hits = 0
_cache_misses = 0
_total_requests = 0

@router.get("/metrics")
async def get_performance_metrics():
    """
    Get comprehensive performance metrics.
    
    Returns:
        dict: Performance metrics including response times, cache stats, and system resources
    """
    try:
        # Get database health
        db_health = await db.get_health_report()
        
        # Calculate cache hit rate
        total_cache_requests = _cache_hits + _cache_misses
        cache_hit_rate = (_cache_hits / total_cache_requests * 100) if total_cache_requests > 0 else 0
        
        # Get system metrics
        system_metrics = {
            "cpu_percent": psutil.cpu_percent(interval=1),
            "memory_percent": psutil.virtual_memory().percent,
            "disk_percent": psutil.disk_usage('/').percent,
            "load_average": psutil.getloadavg()
        }
        
        # Calculate average response times
        avg_response_time = sum(_request_times.values()) / len(_request_times) if _request_times else 0
        
        return {
            "timestamp": time.time(),
            "performance": {
                "total_requests": _total_requests,
                "average_response_time_ms": round(avg_response_time, 2),
                "cache_hit_rate_percent": round(cache_hit_rate, 2),
                "cache_hits": _cache_hits,
                "cache_misses": _cache_misses
            },
            "database": db_health,
            "system": system_metrics,
            "optimizations": {
                "connection_pooling": True,
                "intelligent_caching": True,
                "query_optimization": True,
                "background_health_checks": True
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get performance metrics: {e}")

@router.get("/cache/stats")
async def get_cache_stats():
    """
    Get cache statistics and performance.
    
    Returns:
        dict: Cache performance statistics
    """
    try:
        total_cache_requests = _cache_hits + _cache_misses
        cache_hit_rate = (_cache_hits / total_cache_requests * 100) if total_cache_requests > 0 else 0
        
        return {
            "cache_hits": _cache_hits,
            "cache_misses": _cache_misses,
            "total_requests": total_cache_requests,
            "hit_rate_percent": round(cache_hit_rate, 2),
            "efficiency": "excellent" if cache_hit_rate > 80 else "good" if cache_hit_rate > 60 else "needs_optimization"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get cache stats: {e}")

@router.post("/cache/clear")
async def clear_cache():
    """
    Clear all cache entries.
    
    Returns:
        dict: Cache clearing status
    """
    try:
        await db.clear_cache()
        return {
            "message": "Cache cleared successfully",
            "timestamp": time.time()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to clear cache: {e}")

@router.get("/optimization/recommendations")
async def get_optimization_recommendations():
    """
    Get performance optimization recommendations.
    
    Returns:
        dict: Optimization recommendations based on current metrics
    """
    try:
        recommendations = []
        
        # Check cache hit rate
        total_cache_requests = _cache_hits + _cache_misses
        cache_hit_rate = (_cache_hits / total_cache_requests * 100) if total_cache_requests > 0 else 0
        
        if cache_hit_rate < 60:
            recommendations.append({
                "type": "cache_optimization",
                "priority": "high",
                "description": "Cache hit rate is low. Consider increasing cache TTL or adding more cacheable queries.",
                "current_value": f"{cache_hit_rate:.1f}%",
                "target_value": ">80%"
            })
        
        # Check system resources
        memory_percent = psutil.virtual_memory().percent
        if memory_percent > 80:
            recommendations.append({
                "type": "memory_optimization",
                "priority": "high",
                "description": "Memory usage is high. Consider optimizing memory usage or increasing available memory.",
                "current_value": f"{memory_percent:.1f}%",
                "target_value": "<80%"
            })
        
        # Check database connections
        db_health = await db.get_health_report()
        active_connections = db_health.get("performance", {}).get("active_connections", 0)
        total_connections = db_health.get("performance", {}).get("total_connections", 0)
        
        if total_connections > 0 and (active_connections / total_connections) > 0.8:
            recommendations.append({
                "type": "database_optimization",
                "priority": "medium",
                "description": "Database connection pool usage is high. Consider increasing pool size or optimizing queries.",
                "current_value": f"{active_connections}/{total_connections}",
                "target_value": "<80% usage"
            })
        
        # Check response times
        avg_response_time = sum(_request_times.values()) / len(_request_times) if _request_times else 0
        if avg_response_time > 1000:  # 1 second
            recommendations.append({
                "type": "response_time_optimization",
                "priority": "high",
                "description": "Average response time is high. Consider query optimization or caching improvements.",
                "current_value": f"{avg_response_time:.0f}ms",
                "target_value": "<500ms"
            })
        
        return {
            "recommendations": recommendations,
            "total_recommendations": len(recommendations),
            "timestamp": time.time()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get optimization recommendations: {e}")

# Performance tracking decorator
def track_performance(endpoint_name: str):
    """Decorator to track endpoint performance"""
    def decorator(func):
        async def wrapper(*args, **kwargs):
            global _total_requests
            _total_requests += 1
            
            start_time = time.time()
            try:
                result = await func(*args, **kwargs)
                response_time = (time.time() - start_time) * 1000
                _request_times[endpoint_name] = response_time
                return result
            except Exception as e:
                response_time = (time.time() - start_time) * 1000
                _request_times[endpoint_name] = response_time
                raise
        return wrapper
    return decorator 