#!/usr/bin/env python3
"""
Comprehensive Backend Endpoint Testing
Tests all major endpoints to ensure they're working correctly
"""
import asyncio
import aiohttp
import json
import os
from datetime import datetime

# Configuration
BASE_URL = "http://localhost:8000"
API_BASE = f"{BASE_URL}/api"

async def test_endpoint(session, method, url, data=None, expected_status=200, name=""):
    """Test a single endpoint"""
    try:
        if method.upper() == "GET":
            async with session.get(url) as response:
                status = response.status
                result = await response.text()
        elif method.upper() == "POST":
            async with session.post(url, json=data) as response:
                status = response.status
                result = await response.text()
        else:
            print(f"❌ Unsupported method: {method}")
            return False
        
        success = status == expected_status
        print(f"{'✅' if success else '❌'} {name}: {status} - {url}")
        
        if not success:
            print(f"   Expected: {expected_status}, Got: {status}")
            print(f"   Response: {result[:200]}...")
        
        return success
        
    except Exception as e:
        print(f"❌ {name}: Error - {str(e)}")
        return False

async def test_health_endpoints(session):
    """Test health and monitoring endpoints"""
    print("\n🏥 Testing Health Endpoints...")
    
    endpoints = [
        ("GET", f"{BASE_URL}/health", None, 200, "Basic Health"),
        ("GET", f"{BASE_URL}/health/detailed", None, 200, "Detailed Health"),
        ("GET", f"{BASE_URL}/health/ready", None, 200, "Readiness Probe"),
        ("GET", f"{BASE_URL}/health/live", None, 200, "Liveness Probe"),
        ("GET", f"{BASE_URL}/health/metrics", None, 200, "Metrics"),
    ]
    
    results = []
    for method, url, data, expected, name in endpoints:
        result = await test_endpoint(session, method, url, data, expected, name)
        results.append(result)
    
    return all(results)

async def test_api_endpoints(session):
    """Test main API endpoints"""
    print("\n🔗 Testing API Endpoints...")
    
    endpoints = [
        # Blogs
        ("GET", f"{API_BASE}/blogs/", None, 200, "Get Blogs"),
        ("GET", f"{API_BASE}/blogs/1", None, 200, "Get Single Blog"),
        
        # Jobs
        ("GET", f"{API_BASE}/jobs/corpus", None, 200, "Get Job Corpus"),
        ("GET", f"{API_BASE}/jobs/", None, 200, "Get Jobs"),
        ("GET", f"{API_BASE}/jobs/companies", None, 200, "Get Companies"),
        
        # Aptitude
        ("GET", f"{API_BASE}/aptitude/test/test1", None, 200, "Get Aptitude Test"),
        
        # DSA
        ("GET", f"{API_BASE}/dsa/questions", None, 200, "Get DSA Questions"),
        ("GET", f"{API_BASE}/dsa/categories", None, 200, "Get DSA Categories"),
        
        # Users
        ("GET", f"{API_BASE}/users/profile", None, 200, "Get User Profile"),
        
        # Interview
        ("POST", f"{API_BASE}/interview/chat", {"message": "Hello"}, 200, "Interview Chat"),
    ]
    
    results = []
    for method, url, data, expected, name in endpoints:
        result = await test_endpoint(session, method, url, data, expected, name)
        results.append(result)
    
    return all(results)

async def test_resume_analysis(session):
    """Test resume analysis endpoint"""
    print("\n📄 Testing Resume Analysis...")
    
    # Create a simple test PDF content (in real scenario, this would be a file upload)
    test_data = {
        "resume_text": """
        John Doe
        Software Engineer
        
        Experience:
        - Senior Developer at Tech Corp (2020-2023)
        - Junior Developer at Startup Inc (2018-2020)
        
        Skills:
        - JavaScript, React, Node.js
        - Python, Django, PostgreSQL
        - AWS, Docker, Git
        
        Education:
        - Bachelor's in Computer Science, University of Technology
        """
    }
    
    # Test the resume analysis endpoint
    try:
        async with session.post(f"{API_BASE}/resume/analyze", json=test_data) as response:
            status = response.status
            result = await response.text()
            
            success = status == 200
            print(f"{'✅' if success else '❌'} Resume Analysis: {status}")
            
            if success:
                try:
                    data = json.loads(result)
                    print(f"   Skills found: {len(data.get('skills', []))}")
                    print(f"   Overall score: {data.get('overall_score', 'N/A')}")
                    print(f"   Recommendations: {len(data.get('recommendations', []))}")
                except json.JSONDecodeError:
                    print("   Response is not valid JSON")
            else:
                print(f"   Expected: 200, Got: {status}")
                print(f"   Response: {result[:200]}...")
            
            return success
            
    except Exception as e:
        print(f"❌ Resume Analysis: Error - {str(e)}")
        return False

async def test_redis_endpoints(session):
    """Test Redis management endpoints"""
    print("\n🔴 Testing Redis Endpoints...")
    
    endpoints = [
        ("GET", f"{API_BASE}/redis/status", None, 200, "Redis Status"),
        ("GET", f"{API_BASE}/redis/stats", None, 200, "Redis Stats"),
        ("GET", f"{API_BASE}/redis/info", None, 200, "Redis Info"),
        ("GET", f"{API_BASE}/redis/health", None, 200, "Redis Health"),
    ]
    
    results = []
    for method, url, data, expected, name in endpoints:
        result = await test_endpoint(session, method, url, data, expected, name)
        results.append(result)
    
    return all(results)

async def test_performance_endpoints(session):
    """Test performance monitoring endpoints"""
    print("\n📊 Testing Performance Endpoints...")
    
    endpoints = [
        ("GET", f"{BASE_URL}/performance/metrics", None, 200, "Performance Metrics"),
        ("GET", f"{BASE_URL}/performance/health", None, 200, "Performance Health"),
    ]
    
    results = []
    for method, url, data, expected, name in endpoints:
        result = await test_endpoint(session, method, url, data, expected, name)
        results.append(result)
    
    return all(results)

async def test_seo_endpoints(session):
    """Test SEO endpoints"""
    print("\n🔍 Testing SEO Endpoints...")
    
    endpoints = [
        ("GET", f"{BASE_URL}/seo/sitemap.xml", None, 200, "Sitemap"),
        ("GET", f"{BASE_URL}/seo/rss", None, 200, "RSS Feed"),
    ]
    
    results = []
    for method, url, data, expected, name in endpoints:
        result = await test_endpoint(session, method, url, data, expected, name)
        results.append(result)
    
    return all(results)

async def main():
    """Main test function"""
    print("🚀 Starting Comprehensive Backend Endpoint Tests")
    print("=" * 60)
    print(f"Testing against: {BASE_URL}")
    print(f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Check if backend is running
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(f"{BASE_URL}/health") as response:
                if response.status != 200:
                    print("❌ Backend is not running or not accessible")
                    print("Please start the backend with: uvicorn main:app --reload")
                    return
    except Exception as e:
        print(f"❌ Cannot connect to backend: {e}")
        print("Please start the backend with: uvicorn main:app --reload")
        return
    
    print("✅ Backend is accessible")
    
    # Run all tests
    async with aiohttp.ClientSession() as session:
        results = []
        
        # Test all endpoint categories
        results.append(await test_health_endpoints(session))
        results.append(await test_api_endpoints(session))
        results.append(await test_resume_analysis(session))
        results.append(await test_redis_endpoints(session))
        results.append(await test_performance_endpoints(session))
        results.append(await test_seo_endpoints(session))
    
    # Summary
    print("\n" + "=" * 60)
    print("📋 Test Summary")
    print("=" * 60)
    
    categories = [
        "Health Endpoints",
        "API Endpoints", 
        "Resume Analysis",
        "Redis Endpoints",
        "Performance Endpoints",
        "SEO Endpoints"
    ]
    
    for i, (category, result) in enumerate(zip(categories, results)):
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} {category}")
    
    overall_success = all(results)
    print(f"\n{'🎉 All tests passed!' if overall_success else '⚠️ Some tests failed'}")
    
    if overall_success:
        print("✅ Backend is fully operational")
    else:
        print("🔧 Please check the failed endpoints above")
        print("💡 Common issues:")
        print("   - Database connection problems")
        print("   - Redis connection issues")
        print("   - Missing environment variables")
        print("   - API key configuration")

if __name__ == "__main__":
    asyncio.run(main()) 