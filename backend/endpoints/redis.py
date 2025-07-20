"""
Redis Management Endpoints
Handled by: DevOps Team
Purpose: Redis cache management and monitoring

This module provides endpoints for:
- Redis cache statistics and monitoring
- Cache management operations
- Performance optimization
- Health checks
"""
from fastapi import APIRouter, HTTPException
from typing import Dict, Any
import time
from core.redis_manager import redis_manager

router = APIRouter(prefix="/redis", tags=["redis"])

@router.get("/status")
async def get_redis_status():
    """
    Get Redis connection status and basic info.
    
    Returns:
        dict: Redis connection status and basic information
    """
    try:
        is_connected = redis_manager.is_connected()
        
        return {
            "connected": is_connected,
            "timestamp": time.time(),
            "status": "healthy" if is_connected else "disconnected"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get Redis status: {e}")

@router.get("/stats")
async def get_redis_stats():
    """
    Get Redis cache performance statistics.
    
    Returns:
        dict: Cache performance statistics including hit rate
    """
    try:
        stats = redis_manager.get_cache_stats()
        
        return {
            "timestamp": time.time(),
            "stats": stats,
            "recommendations": get_cache_recommendations(stats)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get Redis stats: {e}")

@router.get("/info")
async def get_redis_info():
    """
    Get Redis server information and metrics.
    
    Returns:
        dict: Redis server information and performance metrics
    """
    try:
        info = await redis_manager.get_redis_info()
        
        return {
            "timestamp": time.time(),
            "server_info": info
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get Redis info: {e}")

@router.post("/health")
async def check_redis_health():
    """
    Perform Redis health check.
    
    Returns:
        dict: Health check results
    """
    try:
        is_healthy = await redis_manager.health_check()
        
        return {
            "healthy": is_healthy,
            "timestamp": time.time(),
            "status": "healthy" if is_healthy else "unhealthy"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Health check failed: {e}")

@router.post("/clear")
async def clear_all_cache():
    """
    Clear all cache entries.
    
    Returns:
        dict: Cache clearing results
    """
    try:
        deleted_count = await redis_manager.invalidate_all_cache()
        
        return {
            "message": "Cache cleared successfully",
            "deleted_keys": deleted_count,
            "timestamp": time.time()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to clear cache: {e}")

@router.post("/clear/blogs")
async def clear_blogs_cache():
    """
    Clear blog-related cache entries.
    
    Returns:
        dict: Cache clearing results
    """
    try:
        deleted_count = await redis_manager.invalidate_blogs_cache()
        
        return {
            "message": "Blogs cache cleared successfully",
            "deleted_keys": deleted_count,
            "timestamp": time.time()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to clear blogs cache: {e}")

@router.post("/clear/users")
async def clear_users_cache():
    """
    Clear user-related cache entries.
    
    Returns:
        dict: Cache clearing results
    """
    try:
        deleted_count = await redis_manager.invalidate_users_cache()
        
        return {
            "message": "Users cache cleared successfully",
            "deleted_keys": deleted_count,
            "timestamp": time.time()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to clear users cache: {e}")

@router.post("/clear/jobs")
async def clear_jobs_cache():
    """
    Clear job-related cache entries.
    
    Returns:
        dict: Cache clearing results
    """
    try:
        deleted_count = await redis_manager.invalidate_jobs_cache()
        
        return {
            "message": "Jobs cache cleared successfully",
            "deleted_keys": deleted_count,
            "timestamp": time.time()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to clear jobs cache: {e}")

@router.get("/keys/{pattern}")
async def get_cache_keys(pattern: str = "*"):
    """
    Get cache keys matching pattern.
    
    Args:
        pattern: Redis key pattern (default: "*")
        
    Returns:
        dict: Matching cache keys and their values
    """
    try:
        keys_data = await redis_manager.get_pattern(pattern)
        
        return {
            "pattern": pattern,
            "keys_count": len(keys_data),
            "keys": keys_data,
            "timestamp": time.time()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get cache keys: {e}")

@router.delete("/keys/{pattern}")
async def delete_cache_keys(pattern: str):
    """
    Delete cache keys matching pattern.
    
    Args:
        pattern: Redis key pattern to delete
        
    Returns:
        dict: Deletion results
    """
    try:
        deleted_count = await redis_manager.delete_pattern(pattern)
        
        return {
            "message": f"Keys matching '{pattern}' deleted successfully",
            "deleted_keys": deleted_count,
            "pattern": pattern,
            "timestamp": time.time()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete cache keys: {e}")

@router.get("/optimization/recommendations")
async def get_cache_optimization_recommendations():
    """
    Get cache optimization recommendations based on current performance.
    
    Returns:
        dict: Optimization recommendations
    """
    try:
        stats = redis_manager.get_cache_stats()
        recommendations = []
        
        # Check hit rate
        hit_rate = stats.get("hit_rate_percent", 0)
        if hit_rate < 60:
            recommendations.append({
                "type": "hit_rate",
                "priority": "high",
                "description": "Cache hit rate is low. Consider increasing cache TTL or adding more cacheable queries.",
                "current_value": f"{hit_rate}%",
                "target_value": ">80%"
            })
        elif hit_rate < 80:
            recommendations.append({
                "type": "hit_rate",
                "priority": "medium",
                "description": "Cache hit rate could be improved. Consider optimizing cache keys or TTL settings.",
                "current_value": f"{hit_rate}%",
                "target_value": ">80%"
            })
        
        # Check connection status
        if not stats.get("connected", False):
            recommendations.append({
                "type": "connection",
                "priority": "critical",
                "description": "Redis is not connected. Check Redis service and connection settings.",
                "current_value": "disconnected",
                "target_value": "connected"
            })
        
        # Check total requests
        total_requests = stats.get("total_requests", 0)
        if total_requests == 0:
            recommendations.append({
                "type": "usage",
                "priority": "low",
                "description": "No cache requests detected. Ensure caching is enabled in your application.",
                "current_value": "0 requests",
                "target_value": ">0 requests"
            })
        
        return {
            "timestamp": time.time(),
            "current_stats": stats,
            "recommendations": recommendations,
            "total_recommendations": len(recommendations)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get optimization recommendations: {e}")

def get_cache_recommendations(stats: Dict[str, Any]) -> list:
    """Get cache optimization recommendations"""
    recommendations = []
    
    hit_rate = stats.get("hit_rate_percent", 0)
    if hit_rate < 60:
        recommendations.append("Increase cache TTL for frequently accessed data")
        recommendations.append("Add caching to more database queries")
    elif hit_rate < 80:
        recommendations.append("Optimize cache key patterns")
        recommendations.append("Review cache invalidation strategies")
    
    if not stats.get("connected", False):
        recommendations.append("Check Redis connection and configuration")
    
    return recommendations 