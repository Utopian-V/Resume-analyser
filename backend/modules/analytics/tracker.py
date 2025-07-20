"""
Analytics Tracking Service
Handled by: Analytics Team
Responsibilities: User behavior tracking, performance metrics, business intelligence
"""
from fastapi import APIRouter, Request
from datetime import datetime
from typing import Dict, Any, Optional
import json

from core.database import db

router = APIRouter(prefix="/analytics", tags=["analytics"])

class AnalyticsTracker:
    def __init__(self):
        self.events = []
    
    async def track_event(self, event_type: str, user_id: Optional[str], data: Dict[str, Any]):
        """Track user event"""
        event = {
            "event_type": event_type,
            "user_id": user_id,
            "data": data,
            "timestamp": datetime.utcnow(),
            "session_id": data.get("session_id"),
            "page_url": data.get("page_url"),
            "user_agent": data.get("user_agent")
        }
        
        # Store in database
        await self._store_event(event)
        
        # Add to memory for real-time analytics
        self.events.append(event)
        
        # Keep only last 1000 events in memory
        if len(self.events) > 1000:
            self.events = self.events[-1000:]
    
    async def _store_event(self, event: Dict):
        """Store event in database"""
        query = """
        INSERT INTO analytics_events (event_type, user_id, data, timestamp, session_id, page_url, user_agent)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        """
        
        await db.execute(
            query,
            event["event_type"],
            event["user_id"],
            json.dumps(event["data"]),
            event["timestamp"],
            event["session_id"],
            event["page_url"],
            event["user_agent"]
        )
    
    async def get_user_metrics(self, user_id: str) -> Dict[str, Any]:
        """Get user-specific metrics"""
        query = """
        SELECT 
            COUNT(*) as total_events,
            COUNT(DISTINCT session_id) as total_sessions,
            MIN(timestamp) as first_visit,
            MAX(timestamp) as last_visit
        FROM analytics_events 
        WHERE user_id = $1
        """
        
        result = await db.fetchrow(query, user_id)
        return dict(result) if result else {}
    
    async def get_page_analytics(self, page_url: str, days: int = 30) -> Dict[str, Any]:
        """Get page-specific analytics"""
        query = """
        SELECT 
            COUNT(*) as page_views,
            COUNT(DISTINCT user_id) as unique_users,
            COUNT(DISTINCT session_id) as unique_sessions
        FROM analytics_events 
        WHERE page_url = $1 
        AND timestamp >= NOW() - INTERVAL '$2 days'
        """
        
        result = await db.fetchrow(query, page_url, days)
        return dict(result) if result else {}
    
    async def get_blog_analytics(self, blog_id: int) -> Dict[str, Any]:
        """Get blog-specific analytics"""
        page_url = f"/blog/{blog_id}"
        return await self.get_page_analytics(page_url)

@router.post("/track")
async def track_event(request: Request):
    """Track user event"""
    try:
        data = await request.json()
        tracker = AnalyticsTracker()
        
        await tracker.track_event(
            event_type=data.get("event_type", "page_view"),
            user_id=data.get("user_id"),
            data=data
        )
        
        return {"success": True, "message": "Event tracked successfully"}
    except Exception as e:
        return {"success": False, "error": str(e)}

@router.get("/metrics/user/{user_id}")
async def get_user_metrics(user_id: str):
    """Get user metrics"""
    try:
        tracker = AnalyticsTracker()
        metrics = await tracker.get_user_metrics(user_id)
        return {"success": True, "metrics": metrics}
    except Exception as e:
        return {"success": False, "error": str(e)}

@router.get("/metrics/page")
async def get_page_analytics(page_url: str, days: int = 30):
    """Get page analytics"""
    try:
        tracker = AnalyticsTracker()
        analytics = await tracker.get_page_analytics(page_url, days)
        return {"success": True, "analytics": analytics}
    except Exception as e:
        return {"success": False, "error": str(e)}

@router.get("/metrics/blog/{blog_id}")
async def get_blog_analytics(blog_id: int):
    """Get blog analytics"""
    try:
        tracker = AnalyticsTracker()
        analytics = await tracker.get_blog_analytics(blog_id)
        return {"success": True, "analytics": analytics}
    except Exception as e:
        return {"success": False, "error": str(e)} 