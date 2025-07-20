# Redis Integration Setup Guide

## 🚀 Overview

This guide covers the complete Redis integration setup for the PrepNexus backend, including caching, session management, and performance optimization.

## 📋 Prerequisites

- Python 3.8+
- Redis server (local or cloud)
- Environment variables configured

## 🔧 Installation

### 1. Install Redis Dependencies

```bash
pip install redis==5.0.1 redis-py-cluster==2.1.3
```

### 2. Environment Variables

Add to your `.env` file:

```bash
# Redis Configuration
REDIS_URL=redis://username:password@host:port
# OR individual parameters:
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_password
REDIS_DB=0
```

## 🌐 Cloud Setup

### Render Redis Service

1. **Create Redis Service:**
   - Go to Render Dashboard
   - Click "New" → "Redis"
   - Choose plan (Free tier available)
   - Set service name (e.g., "prepnexus-redis")

2. **Get Connection URL:**
   - Copy the `REDIS_URL` from your Redis service
   - Add it to your web service environment variables

3. **Environment Variables:**
   ```bash
   REDIS_URL=redis://default:password@host:port
   ```

### Other Cloud Providers

- **AWS ElastiCache:** Use Redis cluster endpoints
- **Google Cloud Memorystore:** Use Redis instance connection string
- **Azure Cache for Redis:** Use connection string from Azure portal
- **Upstash Redis:** Use connection URL from dashboard

## 🏠 Local Development

### macOS
```bash
# Install Redis
brew install redis

# Start Redis server
redis-server

# Test connection
redis-cli ping
```

### Ubuntu/Debian
```bash
# Install Redis
sudo apt update
sudo apt install redis-server

# Start Redis
sudo systemctl start redis-server

# Enable auto-start
sudo systemctl enable redis-server
```

### Windows
```bash
# Using WSL2 (recommended)
# Follow Ubuntu instructions above

# Or using Docker
docker run -d -p 6379:6379 redis:alpine
```

## 🧪 Testing Setup

### 1. Run Setup Script

```bash
cd backend
python setup_redis.py
```

### 2. Manual Testing

```python
import asyncio
from core.redis_manager import redis_manager

async def test_redis():
    await redis_manager.initialize()
    
    # Test basic operations
    await redis_manager.set("test:key", {"data": "value"}, ttl=60)
    value = await redis_manager.get("test:key")
    print(f"Retrieved: {value}")
    
    await redis_manager.close()

asyncio.run(test_redis())
```

## 📊 Monitoring Endpoints

Once Redis is configured, monitor performance using these endpoints:

### Cache Statistics
```bash
GET /api/redis/stats
```

Response:
```json
{
  "timestamp": 1640995200.0,
  "stats": {
    "connected": true,
    "hits": 150,
    "misses": 25,
    "sets": 50,
    "deletes": 10,
    "total_requests": 175,
    "hit_rate_percent": 85.71,
    "efficiency": "excellent"
  },
  "recommendations": [
    "Cache performance is excellent"
  ]
}
```

### Redis Server Info
```bash
GET /api/redis/info
```

### Health Check
```bash
POST /api/redis/health
```

### Cache Management
```bash
# Clear all cache
POST /api/redis/clear

# Clear specific cache types
POST /api/redis/clear/blogs
POST /api/redis/clear/users
POST /api/redis/clear/jobs

# View cache keys
GET /api/redis/keys/cache:*

# Delete specific keys
DELETE /api/redis/keys/cache:blogs:*
```

## 🎯 Performance Optimization

### Cache Key Patterns

Use consistent naming patterns for better management:

```python
# Blog cache keys
"cache:blogs:list"           # All blogs list
"cache:blogs:detail:{id}"    # Individual blog
"cache:blogs:category:{cat}" # Blogs by category

# User cache keys
"cache:users:profile:{id}"   # User profile
"cache:users:preferences:{id}" # User preferences

# Job cache keys
"cache:jobs:recent"          # Recent jobs
"cache:jobs:search:{query}"  # Search results
```

### TTL (Time To Live) Recommendations

```python
# Short-lived data (frequently changing)
await redis_manager.set("cache:jobs:recent", data, ttl=900)  # 15 minutes

# Medium-lived data (moderately changing)
await redis_manager.set("cache:blogs:list", data, ttl=1800)  # 30 minutes

# Long-lived data (rarely changing)
await redis_manager.set("cache:users:profile:123", data, ttl=3600)  # 1 hour

# Session data
await redis_manager.set_session("session_id", data, ttl=7200)  # 2 hours
```

### Cache Invalidation Strategies

```python
# Invalidate specific cache types
await redis_manager.invalidate_blogs_cache()
await redis_manager.invalidate_users_cache()
await redis_manager.invalidate_jobs_cache()

# Invalidate all cache
await redis_manager.invalidate_all_cache()

# Pattern-based invalidation
await redis_manager.delete_pattern("cache:blogs:*")
```

## 🔒 Security Best Practices

### 1. Authentication
- Always use Redis with authentication
- Use strong passwords
- Rotate credentials regularly

### 2. Network Security
- Use SSL/TLS for cloud Redis
- Restrict network access
- Use VPC/private networks when possible

### 3. Data Protection
- Don't store sensitive data in cache
- Use appropriate TTL values
- Implement proper cache invalidation

## 🚨 Troubleshooting

### Common Issues

#### 1. Connection Failed
```bash
# Check Redis server status
redis-cli ping

# Check environment variables
echo $REDIS_URL

# Test connection manually
redis-cli -h host -p port -a password ping
```

#### 2. Authentication Error
```bash
# Verify credentials
redis-cli -h host -p port -a password

# Check Redis configuration
redis-cli config get requirepass
```

#### 3. Memory Issues
```bash
# Check Redis memory usage
redis-cli info memory

# Monitor memory usage
redis-cli --latency
```

#### 4. Performance Issues
```bash
# Check Redis performance
redis-cli info stats

# Monitor slow queries
redis-cli slowlog get 10
```

### Debug Mode

Enable debug logging:

```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

## 📈 Performance Metrics

### Target Metrics

| Metric | Target | Excellent |
|--------|--------|-----------|
| Hit Rate | >60% | >80% |
| Response Time | <10ms | <5ms |
| Memory Usage | <80% | <60% |
| Connection Count | <100 | <50 |

### Monitoring Dashboard

Create a simple monitoring dashboard:

```python
# Get comprehensive stats
stats = redis_manager.get_cache_stats()
redis_info = await redis_manager.get_redis_info()

# Calculate efficiency score
efficiency_score = (
    stats['hit_rate_percent'] * 0.4 +
    (100 - stats.get('response_time_ms', 0)) * 0.3 +
    (100 - redis_info.get('used_memory_percent', 0)) * 0.3
)
```

## 🔄 Migration Guide

### From No Cache to Redis

1. **Install Redis dependencies**
2. **Configure environment variables**
3. **Update database queries to use cache**
4. **Test performance improvements**
5. **Monitor and optimize**

### From Other Cache Systems

1. **Export existing cache data**
2. **Import to Redis using migration script**
3. **Update cache keys to match new patterns**
4. **Test all cache operations**
5. **Switch over gradually**

## 📚 Additional Resources

- [Redis Documentation](https://redis.io/documentation)
- [Redis Python Client](https://redis-py.readthedocs.io/)
- [Redis Best Practices](https://redis.io/topics/best-practices)
- [Redis Performance Tuning](https://redis.io/topics/optimization)

## 🆘 Support

For Redis-related issues:

1. Check this documentation
2. Review Redis server logs
3. Test with `setup_redis.py`
4. Check environment variables
5. Verify network connectivity

---

**Last Updated:** January 2024  
**Version:** 1.0.0  
**Maintained by:** DevOps Team 