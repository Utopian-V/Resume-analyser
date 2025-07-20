"""
Health Monitoring Endpoints
Handled by: DevOps Team
Purpose: Application and database health monitoring

This module provides production-ready health monitoring endpoints that:
- Follow industry standards (Kubernetes, AWS, etc.)
- Provide comprehensive system status
- Include performance metrics
- Support load balancer health checks
"""
from fastapi import APIRouter, HTTPException
from typing import Dict, Any
import time
import psutil
import os
from core.database import db

router = APIRouter(prefix="/health", tags=["health"])

@router.get("/")
async def health_check():
    """
    Basic health check endpoint for load balancers and monitoring systems.
    
    This endpoint is used by:
    - Load balancers to check service health
    - Kubernetes liveness/readiness probes
    - AWS ALB/NLB health checks
    - Monitoring systems (Prometheus, DataDog, etc.)
    
    Returns:
        dict: Basic health status
    """
    return {
        "status": "healthy",
        "timestamp": time.time(),
        "service": "prepnexus-api",
        "version": "1.0.0"
    }

@router.get("/detailed")
async def detailed_health_check():
    """
    Detailed health check with system metrics and database status.
    
    This endpoint provides comprehensive health information including:
    - System resource usage
    - Database connection status
    - Application performance metrics
    - Error rates and circuit breaker status
    
    Returns:
        dict: Detailed health information
    """
    try:
        # Get system metrics
        system_metrics = {
            "cpu_percent": psutil.cpu_percent(interval=1),
            "memory_percent": psutil.virtual_memory().percent,
            "disk_percent": psutil.disk_usage('/').percent,
            "uptime_seconds": time.time() - psutil.boot_time()
        }
        
        # Get database health
        db_health = await db.get_health_report()
        
        # Determine overall health
        is_healthy = (
            db_health["status"] == "healthy" and
            system_metrics["cpu_percent"] < 90 and
            system_metrics["memory_percent"] < 90 and
            system_metrics["disk_percent"] < 90
        )
        
        return {
            "status": "healthy" if is_healthy else "unhealthy",
            "timestamp": time.time(),
            "service": "prepnexus-api",
            "version": "1.0.0",
            "environment": os.getenv("ENVIRONMENT", "development"),
            "system": system_metrics,
            "database": db_health,
            "dependencies": {
                "database": db_health["status"] == "healthy",
                "system_resources": all([
                    system_metrics["cpu_percent"] < 90,
                    system_metrics["memory_percent"] < 90,
                    system_metrics["disk_percent"] < 90
                ])
            }
        }
        
    except Exception as e:
        return {
            "status": "unhealthy",
            "timestamp": time.time(),
            "service": "prepnexus-api",
            "version": "1.0.0",
            "error": str(e),
            "dependencies": {
                "database": False,
                "system_resources": False
            }
        }

@router.get("/ready")
async def readiness_check():
    """
    Readiness check for Kubernetes and container orchestration.
    
    This endpoint checks if the application is ready to receive traffic:
    - Database connection is established
    - All required services are available
    - Application is fully initialized
    
    Returns:
        dict: Readiness status
    """
    try:
        # Check database readiness
        db_health = await db.get_health_report()
        
        is_ready = db_health["status"] == "healthy"
        
        return {
            "ready": is_ready,
            "timestamp": time.time(),
            "checks": {
                "database": db_health["status"] == "healthy"
            }
        }
        
    except Exception as e:
        return {
            "ready": False,
            "timestamp": time.time(),
            "error": str(e),
            "checks": {
                "database": False
            }
        }

@router.get("/live")
async def liveness_check():
    """
    Liveness check for Kubernetes and container orchestration.
    
    This endpoint checks if the application process is alive and responsive.
    It should be lightweight and not depend on external services.
    
    Returns:
        dict: Liveness status
    """
    return {
        "alive": True,
        "timestamp": time.time(),
        "pid": os.getpid()
    }

@router.get("/metrics")
async def metrics():
    """
    Application metrics for monitoring systems (Prometheus, etc.).
    
    This endpoint provides metrics in a format suitable for monitoring systems:
    - Database performance metrics
    - System resource usage
    - Application-specific metrics
    
    Returns:
        dict: Application metrics
    """
    try:
        db_health = await db.get_health_report()
        
        return {
            "timestamp": time.time(),
            "metrics": {
                "database": {
                    "response_time_ms": db_health["performance"]["response_time_ms"],
                    "active_connections": db_health["performance"]["active_connections"],
                    "total_connections": db_health["performance"]["total_connections"],
                    "error_count": db_health["circuit_breaker"]["error_count"],
                    "circuit_breaker_open": db_health["circuit_breaker"]["open"]
                },
                "system": {
                    "cpu_percent": psutil.cpu_percent(interval=1),
                    "memory_percent": psutil.virtual_memory().percent,
                    "disk_percent": psutil.disk_usage('/').percent
                }
            }
        }
        
    except Exception as e:
        return {
            "timestamp": time.time(),
            "error": str(e),
            "metrics": {}
        } 