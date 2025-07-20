"""
RSS Feed Generation Service
Handled by: SEO Team
Responsibilities: Generate dynamic RSS feeds for blog content
"""
from fastapi import APIRouter, HTTPException
from fastapi.responses import XMLResponse
from datetime import datetime
from typing import List, Dict
import xml.etree.ElementTree as ET
from xml.dom import minidom

from backend.core.database import db

router = APIRouter(prefix="/seo", tags=["seo"])

class RSSGenerator:
    def __init__(self, base_url: str = "https://prepnexus.netlify.app"):
        self.base_url = base_url
        self.site_title = "PrepNexus - Career Preparation Platform"
        self.site_description = "AI-powered career preparation with interview prep, DSA practice, and job opportunities"
    
    async def generate_rss(self) -> str:
        """Generate RSS feed"""
        # Create root element
        rss = ET.Element("rss")
        rss.set("version", "2.0")
        rss.set("xmlns:atom", "http://www.w3.org/2005/Atom")
        
        # Create channel element
        channel = ET.SubElement(rss, "channel")
        
        # Channel metadata
        title = ET.SubElement(channel, "title")
        title.text = self.site_title
        
        link = ET.SubElement(channel, "link")
        link.text = self.base_url
        
        description = ET.SubElement(channel, "description")
        description.text = self.site_description
        
        language = ET.SubElement(channel, "language")
        language.text = "en-US"
        
        last_build_date = ET.SubElement(channel, "lastBuildDate")
        last_build_date.text = datetime.utcnow().strftime("%a, %d %b %Y %H:%M:%S GMT")
        
        # Add atom link
        atom_link = ET.SubElement(channel, "atom:link")
        atom_link.set("href", f"{self.base_url}/seo/rss.xml")
        atom_link.set("rel", "self")
        atom_link.set("type", "application/rss+xml")
        
        # Add blog items
        blogs = await self._get_recent_blogs()
        for blog in blogs:
            item = self._create_item_element(blog)
            channel.append(item)
        
        # Format XML
        xml_str = ET.tostring(rss, encoding='unicode')
        return minidom.parseString(xml_str).toprettyxml(indent="  ")
    
    def _create_item_element(self, blog: Dict) -> ET.Element:
        """Create an item element for RSS feed"""
        item = ET.Element("item")
        
        title = ET.SubElement(item, "title")
        title.text = blog['title']
        
        link = ET.SubElement(item, "link")
        link.text = f"{self.base_url}/blog/{blog['id']}"
        
        description = ET.SubElement(item, "description")
        # Strip HTML tags for RSS description
        content = blog['content'][:300] + "..." if len(blog['content']) > 300 else blog['content']
        description.text = content
        
        pub_date = ET.SubElement(item, "pubDate")
        pub_date.text = blog['created_at'].strftime("%a, %d %b %Y %H:%M:%S GMT")
        
        guid = ET.SubElement(item, "guid")
        guid.text = f"{self.base_url}/blog/{blog['id']}"
        
        return item
    
    async def _get_recent_blogs(self, limit: int = 20) -> List[Dict]:
        """Get recent blogs from database"""
        query = """
        SELECT id, title, content, created_at 
        FROM blogs 
        ORDER BY created_at DESC 
        LIMIT $1
        """
        return await db.fetch(query, limit)

@router.get("/rss.xml")
async def get_rss():
    """Generate and return RSS feed"""
    try:
        generator = RSSGenerator()
        rss_content = await generator.generate_rss()
        return XMLResponse(content=rss_content, media_type="application/rss+xml")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"RSS generation failed: {str(e)}") 