# PrepNexus Backend API

A production-ready FastAPI backend for the PrepNexus career preparation platform.

## 🏗️ Architecture

### **Production-Ready Design**
- **Single Database**: PostgreSQL with connection pooling
- **Health Monitoring**: Circuit breakers and comprehensive health checks
- **Performance**: Optimized queries with proper indexing
- **Security**: Environment-based configuration and proper error handling
- **Scalability**: Docker containerization and load balancer ready

### **Key Features**
- **Blog Management**: CRUD operations with SEO optimization
- **User Management**: Authentication and profile management
- **Job Listings**: Career opportunities and applications
- **Assessment Tools**: DSA practice, aptitude tests, interview prep
- **Resume Analysis**: AI-powered feedback and optimization
- **Health Monitoring**: Production-ready health endpoints

## 🚀 Quick Start

### **1. Setup Development Environment**
```bash
# Run the automated setup script
./setup_dev.sh

# This will:
# - Start PostgreSQL and Redis in Docker
# - Create proper database schema
# - Install Python dependencies
# - Test database connection
```

### **2. Start Application**
```bash
source venv/bin/activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### **3. Access Application**
- **Application**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

## 📊 Health Monitoring

### **Health Endpoints**
```bash
# Basic health check (for load balancers)
GET /health

# Detailed health with metrics
GET /health/detailed

# Kubernetes readiness probe
GET /health/ready

# Kubernetes liveness probe
GET /health/live

# Application metrics
GET /health/metrics
```

### **Database Health**
The application includes comprehensive database health monitoring:
- **Connection pooling** with performance metrics
- **Circuit breaker pattern** for graceful failure handling
- **Response time tracking** and error monitoring
- **Automatic health checks** and recovery

## 🔧 Configuration

### **Environment Variables**
```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=prepnexus
DB_USER=postgres
DB_PASSWORD=postgres

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379

# Application Configuration
ENVIRONMENT=development
DEBUG=true
LOG_LEVEL=INFO
SECRET_KEY=your-secret-key
```

### **Database Schema**
The application uses a professional PostgreSQL schema with:
- **Proper indexing** for performance
- **ACID compliance** for data integrity
- **Audit trails** with created_at/updated_at
- **Soft deletes** and status tracking
- **SEO optimization** with slugs and meta descriptions

## 🐳 Docker Deployment

### **Development with Docker Compose**
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### **Production Docker**
```bash
# Build production image
docker build -t prepnexus-backend .

# Run with environment variables
docker run -p 8000:8000 \
  -e DB_HOST=your-db-host \
  -e DB_PASSWORD=your-password \
  prepnexus-backend
```

## 📈 Performance

### **Optimizations**
- **Connection pooling** for efficient database connections
- **Query optimization** with proper indexes
- **Caching layer** with Redis
- **Async/await** for non-blocking operations
- **Health monitoring** for proactive issue detection

### **Monitoring**
- **Response time tracking** for all endpoints
- **Database performance** metrics
- **System resource** monitoring
- **Error rate** tracking and alerting
- **Circuit breaker** status monitoring

## 🔒 Security

### **Best Practices**
- **Environment-based** configuration
- **No hardcoded** secrets
- **Input validation** and sanitization
- **Error handling** without information leakage
- **Health checks** for security monitoring

### **Production Considerations**
- **HTTPS/TLS** encryption
- **Rate limiting** and DDoS protection
- **Authentication** and authorization
- **Audit logging** for compliance
- **Regular security** updates

## 🧪 Testing

### **Health Checks**
```bash
# Test basic health
curl http://localhost:8000/health

# Test detailed health
curl http://localhost:8000/health/detailed

# Test database connection
curl http://localhost:8000/health/ready
```

### **API Testing**
```bash
# Test blog endpoints
curl http://localhost:8000/api/blogs

# Test user endpoints
curl http://localhost:8000/api/users

# View API documentation
open http://localhost:8000/docs
```

## 📚 API Documentation

### **Available Endpoints**
- **Blogs**: `/api/blogs` - Blog management and content
- **Users**: `/api/users` - User profiles and authentication
- **Jobs**: `/api/jobs` - Job listings and applications
- **DSA**: `/api/dsa` - Data structures and algorithms practice
- **Resume**: `/api/resume` - Resume analysis and feedback
- **Interview**: `/api/interview` - Interview practice sessions
- **Aptitude**: `/api/aptitude` - Aptitude tests and assessments
- **Health**: `/health/*` - Health monitoring endpoints

### **Response Format**
All API responses follow a consistent format:
```json
{
  "status": "success",
  "data": {...},
  "message": "Operation completed successfully",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## 🚨 Troubleshooting

### **Common Issues**

#### **Database Connection Failed**
```bash
# Check if PostgreSQL is running
docker-compose ps

# Check database logs
docker-compose logs postgres

# Test connection manually
psql -h localhost -U postgres -d prepnexus
```

#### **Application Won't Start**
```bash
# Check environment variables
echo $DB_HOST

# Check Python dependencies
pip list

# Check application logs
uvicorn main:app --log-level debug
```

#### **Health Check Failing**
```bash
# Check detailed health
curl http://localhost:8000/health/detailed

# Check database health
curl http://localhost:8000/health/ready

# Check system resources
top
```

## 📞 Support

### **Development Team**
- **Backend Team**: Database and API development
- **DevOps Team**: Deployment and monitoring
- **Security Team**: Security and compliance

### **Documentation**
- **API Docs**: http://localhost:8000/docs
- **Health Monitoring**: http://localhost:8000/health
- **Production Guide**: See `PRODUCTION_APPROACH.md`

## 🎯 Production Checklist

Before deploying to production:

- [ ] **Environment variables** configured
- [ ] **Database schema** deployed
- [ ] **Health checks** passing
- [ ] **Security settings** applied
- [ ] **Monitoring** configured
- [ ] **Backup strategy** implemented
- [ ] **SSL/TLS** certificates installed
- [ ] **Load balancer** configured
- [ ] **Logging** and alerting setup
- [ ] **Performance testing** completed

---

**PrepNexus Backend** - Production-ready, scalable, and maintainable API for career preparation. 🚀 