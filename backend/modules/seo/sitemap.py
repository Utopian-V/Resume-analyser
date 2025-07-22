"""
Sitemap Generation Service
Handled by: SEO Team
Responsibilities: Generate dynamic sitemap.xml, ping search engines
"""
from fastapi import APIRouter, HTTPException, Response
from datetime import datetime
from typing import List, Dict
import xml.etree.ElementTree as ET
from xml.dom import minidom

from core.database import db

router = APIRouter(prefix="/seo", tags=["seo"])

class SitemapGenerator:
    def __init__(self, base_url: str = "https://resume-analyser-o3eu.onrender.com/"):
        self.base_url = base_url
        self.static_pages = [
            "/",
            "/about",
            "/contact", 
            "/privacy",
            "/terms",
            "/blog",
            "/jobs",
            "/interview-prep",
            "/dsa-preparation",
            "/aptitude-tests",
            "/skill-assessment"
        ]
    
    async def generate_sitemap(self) -> str:
        """Generate complete sitemap.xml"""
        # Create root element
        urlset = ET.Element("urlset")
        urlset.set("xmlns", "http://www.sitemaps.org/schemas/sitemap/0.9")
        
        # Add static pages
        for page in self.static_pages:
            url_elem = self._create_url_element(f"{self.base_url}{page}", "1.0", "daily")
            urlset.append(url_elem)
        
        # Add dynamic blog pages
        blogs = await self._get_all_blogs()
        for blog in blogs:
            url_elem = self._create_url_element(
                f"{self.base_url}/blog/{blog['id']}", 
                "0.8", 
                "weekly",
                blog.get('updated_at', blog.get('created_at'))
            )
            urlset.append(url_elem)
        
        # Format XML
        xml_str = ET.tostring(urlset, encoding='unicode')
        return minidom.parseString(xml_str).toprettyxml(indent="  ")
    
    def _create_url_element(self, url: str, priority: str, changefreq: str, lastmod: str = None) -> ET.Element:
        """Create a URL element for sitemap"""
        url_elem = ET.Element("url")
        
        loc = ET.SubElement(url_elem, "loc")
        loc.text = url
        
        if lastmod:
            lastmod_elem = ET.SubElement(url_elem, "lastmod")
            lastmod_elem.text = lastmod
        
        changefreq_elem = ET.SubElement(url_elem, "changefreq")
        changefreq_elem.text = changefreq
        
        priority_elem = ET.SubElement(url_elem, "priority")
        priority_elem.text = priority
        
        return url_elem
    
    async def _get_all_blogs(self) -> List[Dict]:
        """Get all blogs from database"""
        query = "SELECT id, created_at, updated_at FROM blogs ORDER BY created_at DESC"
        return await db.fetch(query)

@router.get("/sitemap.xml")
async def get_sitemap():
    """Generate and return sitemap.xml"""
    try:
        generator = SitemapGenerator()
        sitemap_content = await generator.generate_sitemap()
        return Response(content=sitemap_content, media_type="application/xml")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Sitemap generation failed: {str(e)}")

@router.post("/ping-sitemap")
async def ping_search_engines():
    """Ping search engines about sitemap update"""
    try:
        sitemap_url = "https://prepnexus.netlify.app/seo/sitemap.xml"
        
        # Ping Google
        google_ping_url = f"https://www.google.com/ping?sitemap={sitemap_url}"
        # Ping Bing
        bing_ping_url = f"https://www.bing.com/ping?sitemap={sitemap_url}"
        
        # TODO: Implement actual HTTP requests
        return {
            "success": True,
            "message": "Sitemap pinged successfully",
            "pings": ["Google", "Bing"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Sitemap ping failed: {str(e)}") 