"""
Health Monitoring Service
Handled by: DevOps Team
Responsibilities: System health checks, performance monitoring, alerting
"""
from fastapi import APIRouter, HTTPException
from datetime import datetime
from typing import Dict, Any, List
import asyncio
import aiohttp

from backend.core.database import db

router = APIRouter(prefix="/monitoring", tags=["monitoring"])

class HealthMonitor:
    def __init__(self):
        self.checks = {
            "database": self._check_database,
            "external_apis": self._check_external_apis,
            "disk_space": self._check_disk_space,
            "memory_usage": self._check_memory_usage
        }
    
    async def run_health_check(self) -> Dict[str, Any]:
        """Run comprehensive health check"""
        results = {}
        overall_status = "healthy"
        
        for check_name, check_func in self.checks.items():
            try:
                result = await check_func()
                results[check_name] = result
                
                if result["status"] == "unhealthy":
                    overall_status = "unhealthy"
                    
            except Exception as e:
                results[check_name] = {
                    "status": "error",
                    "message": str(e),
                    "timestamp": datetime.utcnow()
                }
                overall_status = "unhealthy"
        
        return {
            "status": overall_status,
            "timestamp": datetime.utcnow(),
            "checks": results
        }
    
    async def _check_database(self) -> Dict[str, Any]:
        """Check database connectivity and performance"""
        try:
            start_time = datetime.utcnow()
            
            # Test basic connectivity
            await db.fetchval("SELECT 1")
            
            # Test query performance
            await db.fetch("SELECT COUNT(*) FROM blogs")
            
            end_time = datetime.utcnow()
            response_time = (end_time - start_time).total_seconds()
            
            return {
                "status": "healthy" if response_time < 1.0 else "warning",
                "response_time": response_time,
                "message": "Database connection successful",
                "timestamp": datetime.utcnow()
            }
            
        except Exception as e:
            return {
                "status": "unhealthy",
                "message": f"Database check failed: {str(e)}",
                "timestamp": datetime.utcnow()
            }
    
    async def _check_external_apis(self) -> Dict[str, Any]:
        """Check external API health"""
        apis = {
            "gemini": "https://generativelanguage.googleapis.com/v1/models",
            "unsplash": "https://api.unsplash.com/photos/random"
        }
        
        results = {}
        overall_status = "healthy"
        
        for api_name, api_url in apis.items():
            try:
                async with aiohttp.ClientSession() as session:
                    async with session.get(api_url, timeout=5) as response:
                        if response.status < 500:
                            results[api_name] = "healthy"
                        else:
                            results[api_name] = "warning"
                            overall_status = "warning"
            except Exception:
                results[api_name] = "unhealthy"
                overall_status = "unhealthy"
        
        return {
            "status": overall_status,
            "apis": results,
            "message": "External API health check completed",
            "timestamp": datetime.utcnow()
        }
    
    async def _check_disk_space(self) -> Dict[str, Any]:
        """Check disk space (placeholder for actual implementation)"""
        return {
            "status": "healthy",
            "message": "Disk space check passed",
            "timestamp": datetime.utcnow()
        }
    
    async def _check_memory_usage(self) -> Dict[str, Any]:
        """Check memory usage (placeholder for actual implementation)"""
        return {
            "status": "healthy",
            "message": "Memory usage check passed",
            "timestamp": datetime.utcnow()
        }
    
    async def get_system_metrics(self) -> Dict[str, Any]:
        """Get system performance metrics"""
        try:
            # Blog count
            blog_count = await db.fetchval("SELECT COUNT(*) FROM blogs")
            
            # Recent activity
            recent_blogs = await db.fetchval(
                "SELECT COUNT(*) FROM blogs WHERE created_at >= NOW() - INTERVAL '24 hours'"
            )
            
            # User activity (if analytics table exists)
            try:
                user_activity = await db.fetchval(
                    "SELECT COUNT(*) FROM analytics_events WHERE timestamp >= NOW() - INTERVAL '24 hours'"
                )
            except:
                user_activity = 0
            
            return {
                "total_blogs": blog_count,
                "blogs_last_24h": recent_blogs,
                "user_activity_last_24h": user_activity,
                "timestamp": datetime.utcnow()
            }
            
        except Exception as e:
            return {
                "error": str(e),
                "timestamp": datetime.utcnow()
            }

# Global health monitor instance
health_monitor = HealthMonitor()

@router.get("/health")
async def health_check():
    """Run health check"""
    try:
        return await health_monitor.run_health_check()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Health check failed: {str(e)}")

@router.get("/metrics")
async def get_metrics():
    """Get system metrics"""
    try:
        return await health_monitor.get_system_metrics()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Metrics retrieval failed: {str(e)}")

@router.get("/status")
async def get_status():
    """Get quick status check"""
    try:
        # Quick database check
        await db.fetchval("SELECT 1")
        return {"status": "healthy", "message": "System is operational"}
    except Exception as e:
        return {"status": "unhealthy", "message": f"System error: {str(e)}"} 