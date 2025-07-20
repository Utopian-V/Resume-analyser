#!/usr/bin/env python3
"""
Performance Diagnostic Script
Purpose: Identify whether performance issues are from Neon database or code

This script will test:
1. Direct database connection speed
2. Query performance
3. Connection pool efficiency
4. Network latency to Neon
5. Code execution overhead
"""
import asyncio
import time
import asyncpg
import os
import psutil
from typing import Dict, Any
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

async def test_neon_connection_speed():
    """Test direct connection speed to Neon database"""
    print("🔗 Testing Neon Database Connection Speed...")
    
    # Get Neon connection details
    neon_url = os.getenv('NEON_DATABASE_URL')
    if not neon_url:
        print("❌ No NEON_DATABASE_URL found in environment variables")
        return None
    
    # Convert postgresql+asyncpg:// to postgresql:// for asyncpg
    if neon_url.startswith('postgresql+asyncpg://'):
        neon_url = neon_url.replace('postgresql+asyncpg://', 'postgresql://')
    
    try:
        # Test connection establishment time
        start_time = time.time()
        conn = await asyncpg.connect(neon_url)
        connection_time = (time.time() - start_time) * 1000
        
        # Test simple query
        start_time = time.time()
        result = await conn.fetchval("SELECT 1")
        query_time = (time.time() - start_time) * 1000
        
        # Test complex query
        start_time = time.time()
        await conn.fetch("SELECT * FROM blogs LIMIT 10")
        complex_query_time = (time.time() - start_time) * 1000
        
        await conn.close()
        
        print(f"  Connection establishment: {connection_time:.2f}ms")
        print(f"  Simple query: {query_time:.2f}ms")
        print(f"  Complex query: {complex_query_time:.2f}ms")
        
        return {
            "connection_time": connection_time,
            "simple_query": query_time,
            "complex_query": complex_query_time,
            "status": "healthy" if connection_time < 1000 else "slow"
        }
        
    except Exception as e:
        print(f"❌ Neon connection test failed: {e}")
        return None

async def test_connection_pool_performance():
    """Test connection pool performance"""
    print("\n🏊 Testing Connection Pool Performance...")
    
    neon_url = os.getenv('NEON_DATABASE_URL')
    if not neon_url:
        print("❌ No NEON_DATABASE_URL found")
        return None
    
    # Convert postgresql+asyncpg:// to postgresql:// for asyncpg
    if neon_url.startswith('postgresql+asyncpg://'):
        neon_url = neon_url.replace('postgresql+asyncpg://', 'postgresql://')
    
    try:
        # Create connection pool
        start_time = time.time()
        pool = await asyncpg.create_pool(
            neon_url,
            min_size=5,
            max_size=20,
            command_timeout=30
        )
        pool_creation_time = (time.time() - start_time) * 1000
        
        # Test pool performance
        times = []
        for i in range(10):
            start_time = time.time()
            async with pool.acquire() as conn:
                await conn.fetchval("SELECT 1")
                query_time = (time.time() - start_time) * 1000
                times.append(query_time)
        
        avg_time = sum(times) / len(times)
        min_time = min(times)
        max_time = max(times)
        
        print(f"  Pool creation: {pool_creation_time:.2f}ms")
        print(f"  Average query time: {avg_time:.2f}ms")
        print(f"  Min query time: {min_time:.2f}ms")
        print(f"  Max query time: {max_time:.2f}ms")
        
        await pool.close()
        
        return {
            "pool_creation": pool_creation_time,
            "avg_query": avg_time,
            "min_query": min_time,
            "max_query": max_time
        }
        
    except Exception as e:
        print(f"❌ Connection pool test failed: {e}")
        return None

async def test_network_latency():
    """Test network latency to Neon"""
    print("\n🌐 Testing Network Latency to Neon...")
    
    import socket
    import subprocess
    
    # Extract host from NEON_DATABASE_URL
    neon_url = os.getenv('NEON_DATABASE_URL')
    if not neon_url:
        print("❌ No NEON_DATABASE_URL found")
        return None
    
    try:
        # Parse host from URL
        if neon_url.startswith('postgresql://'):
            host = neon_url.split('@')[1].split('/')[0].split(':')[0]
        else:
            host = neon_url.split('@')[1].split('/')[0].split(':')[0]
        
        # Test ping
        try:
            result = subprocess.run(['ping', '-c', '3', host], 
                                  capture_output=True, text=True, timeout=10)
            if result.returncode == 0:
                # Parse ping results
                lines = result.stdout.split('\n')
                for line in lines:
                    if 'time=' in line:
                        ping_time = float(line.split('time=')[1].split()[0])
                        print(f"  Ping to {host}: {ping_time:.2f}ms")
                        return {"ping_time": ping_time, "host": host}
        except:
            pass
        
        # Fallback: DNS resolution
        start_time = time.time()
        socket.gethostbyname(host)
        dns_time = (time.time() - start_time) * 1000
        print(f"  DNS resolution for {host}: {dns_time:.2f}ms")
        
        return {"dns_time": dns_time, "host": host}
        
    except Exception as e:
        print(f"❌ Network latency test failed: {e}")
        return None

async def test_code_performance():
    """Test code execution performance"""
    print("\n⚡ Testing Code Performance...")
    
    try:
        # Import and test our optimized database
        from core.database import db
        
        # Initialize database
        start_time = time.time()
        await db.initialize()
        init_time = (time.time() - start_time) * 1000
        
        # Test with caching
        start_time = time.time()
        result1 = await db.fetch("SELECT * FROM blogs LIMIT 5", use_cache=True)
        cached_time = (time.time() - start_time) * 1000
        
        # Test without caching
        start_time = time.time()
        result2 = await db.fetch("SELECT * FROM blogs LIMIT 5", use_cache=False)
        uncached_time = (time.time() - start_time) * 1000
        
        # Test cached query again
        start_time = time.time()
        result3 = await db.fetch("SELECT * FROM blogs LIMIT 5", use_cache=True)
        cached_again_time = (time.time() - start_time) * 1000
        
        await db.close()
        
        print(f"  Database initialization: {init_time:.2f}ms")
        print(f"  First cached query: {cached_time:.2f}ms")
        print(f"  Uncached query: {uncached_time:.2f}ms")
        print(f"  Second cached query: {cached_again_time:.2f}ms")
        print(f"  Cache speedup: {uncached_time/cached_again_time:.1f}x")
        
        return {
            "init_time": init_time,
            "cached_time": cached_time,
            "uncached_time": uncached_time,
            "cached_again_time": cached_again_time,
            "cache_speedup": uncached_time/cached_again_time
        }
        
    except Exception as e:
        print(f"❌ Code performance test failed: {e}")
        return None

def get_system_info():
    """Get system information"""
    print("\n💻 System Information...")
    
    info = {
        "cpu_count": psutil.cpu_count(),
        "memory_total": psutil.virtual_memory().total / (1024**3),  # GB
        "memory_available": psutil.virtual_memory().available / (1024**3),  # GB
        "memory_percent": psutil.virtual_memory().percent,
        "disk_usage": psutil.disk_usage('/').percent
    }
    
    print(f"  CPU cores: {info['cpu_count']}")
    print(f"  Total memory: {info['memory_total']:.1f}GB")
    print(f"  Available memory: {info['memory_available']:.1f}GB")
    print(f"  Memory usage: {info['memory_percent']:.1f}%")
    print(f"  Disk usage: {info['disk_usage']:.1f}%")
    
    return info

def analyze_results(results: Dict[str, Any]):
    """Analyze test results and provide recommendations"""
    print("\n📊 Performance Analysis & Recommendations")
    print("=" * 50)
    
    # Check Neon performance
    if results.get('neon'):
        neon = results['neon']
        if neon['connection_time'] > 1000:
            print("🚨 ISSUE: Neon connection is slow (>1s)")
            print("   - This indicates network latency or Neon server issues")
            print("   - Consider: Check your internet connection, Neon region, or upgrade plan")
        elif neon['connection_time'] > 500:
            print("⚠️ WARNING: Neon connection is moderately slow (500ms-1s)")
            print("   - This might be due to distance to Neon server")
            print("   - Consider: Choose a Neon region closer to your location")
        else:
            print("✅ Neon connection is fast (<500ms)")
    
    # Check connection pool
    if results.get('pool'):
        pool = results['pool']
        if pool['avg_query'] > 200:
            print("🚨 ISSUE: Connection pool queries are slow (>200ms)")
            print("   - This indicates database performance issues")
            print("   - Consider: Optimize queries, add indexes, or upgrade Neon plan")
        elif pool['avg_query'] > 100:
            print("⚠️ WARNING: Connection pool queries are moderately slow (100-200ms)")
            print("   - This might be acceptable but could be improved")
        else:
            print("✅ Connection pool queries are fast (<100ms)")
    
    # Check code performance
    if results.get('code'):
        code = results['code']
        if code['cache_speedup'] < 2:
            print("⚠️ WARNING: Caching is not providing significant speedup")
            print("   - This might indicate Redis issues or cache configuration")
            print("   - Consider: Check Redis connection, increase cache TTL")
        else:
            print(f"✅ Caching is working well ({code['cache_speedup']:.1f}x speedup)")
    
    # Check system resources
    if results.get('system'):
        system = results['system']
        if system['memory_percent'] > 90:
            print("🚨 ISSUE: High memory usage (>90%)")
            print("   - This can cause performance issues")
            print("   - Consider: Close other applications, increase system memory")
        elif system['memory_percent'] > 80:
            print("⚠️ WARNING: High memory usage (80-90%)")
            print("   - Monitor memory usage during application operation")
    
    # Overall recommendation
    print("\n🎯 Overall Assessment:")
    
    if results.get('neon') and results['neon']['connection_time'] > 1000:
        print("   PRIMARY ISSUE: Neon database connection is slow")
        print("   ACTION: Check network, Neon region, or upgrade plan")
    elif results.get('pool') and results['pool']['avg_query'] > 200:
        print("   PRIMARY ISSUE: Database queries are slow")
        print("   ACTION: Optimize queries, add indexes, or upgrade Neon plan")
    elif results.get('code') and results['code']['cache_speedup'] < 2:
        print("   PRIMARY ISSUE: Caching is not effective")
        print("   ACTION: Check Redis configuration and cache settings")
    else:
        print("   ✅ Performance appears to be good")
        print("   ACTION: Monitor during actual usage")

async def main():
    """Run all diagnostic tests"""
    print("🔍 PrepNexus Performance Diagnostic")
    print("=" * 50)
    
    results = {}
    
    # Run tests
    results['neon'] = await test_neon_connection_speed()
    results['pool'] = await test_connection_pool_performance()
    results['network'] = await test_network_latency()
    results['code'] = await test_code_performance()
    results['system'] = get_system_info()
    
    # Analyze results
    analyze_results(results)
    
    print("\n📋 Next Steps:")
    print("1. If Neon is slow: Check your internet connection and Neon region")
    print("2. If queries are slow: Consider optimizing database schema")
    print("3. If caching is ineffective: Check Redis configuration")
    print("4. Run this test again after making changes")
    
    return results

if __name__ == "__main__":
    asyncio.run(main()) 