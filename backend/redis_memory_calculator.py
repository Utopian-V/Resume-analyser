#!/usr/bin/env python3
"""
Redis Memory Usage Calculator
Handled by: DevOps Team
Purpose: Calculate Redis memory usage for different data types

This script helps estimate Redis memory requirements for:
- Blog cache data
- User session data
- Job listings cache
- DSA questions cache
- General application data
"""
import json
import sys

def calculate_string_memory(key, value):
    """Calculate memory for string values"""
    # Redis string overhead: ~50 bytes per key-value pair
    key_size = len(key.encode('utf-8'))
    value_size = len(json.dumps(value).encode('utf-8'))
    overhead = 50
    return key_size + value_size + overhead

def calculate_hash_memory(key, data):
    """Calculate memory for hash values"""
    # Redis hash overhead: ~50 bytes per hash + 20 bytes per field
    base_overhead = 50
    field_overhead = 20 * len(data)
    
    key_size = len(key.encode('utf-8'))
    total_value_size = 0
    
    for field, value in data.items():
        field_size = len(field.encode('utf-8'))
        value_size = len(json.dumps(value).encode('utf-8'))
        total_value_size += field_size + value_size
    
    return key_size + total_value_size + base_overhead + field_overhead

def calculate_list_memory(key, items):
    """Calculate memory for list values"""
    # Redis list overhead: ~50 bytes per list + 20 bytes per item
    base_overhead = 50
    item_overhead = 20 * len(items)
    
    key_size = len(key.encode('utf-8'))
    total_value_size = 0
    
    for item in items:
        item_size = len(json.dumps(item).encode('utf-8'))
        total_value_size += item_size
    
    return key_size + total_value_size + base_overhead + item_overhead

def estimate_application_memory():
    """Estimate memory usage for typical application data"""
    
    print("📊 Redis Memory Usage Calculator")
    print("=" * 50)
    
    # Sample data structures
    sample_blog = {
        "id": 1,
        "title": "Getting Started with Data Structures",
        "content": "This is a comprehensive guide to data structures...",
        "author": "John Doe",
        "published_date": "2024-01-15",
        "tags": ["dsa", "programming", "algorithms"],
        "views": 1250,
        "likes": 89
    }
    
    sample_user = {
        "id": 123,
        "name": "Alice Johnson",
        "email": "alice@example.com",
        "premium": True,
        "last_login": "2024-01-15T10:30:00Z",
        "preferences": {
            "theme": "dark",
            "notifications": True,
            "language": "en"
        }
    }
    
    sample_job = {
        "id": 456,
        "title": "Senior Software Engineer",
        "company": "Tech Corp",
        "location": "San Francisco, CA",
        "salary_range": "$120k - $180k",
        "requirements": ["Python", "JavaScript", "AWS"],
        "description": "We are looking for a senior engineer...",
        "posted_date": "2024-01-10"
    }
    
    sample_dsa_question = {
        "id": 789,
        "title": "Two Sum Problem",
        "difficulty": "Easy",
        "category": "Arrays",
        "description": "Given an array of integers...",
        "solution": "Use a hash map to store complements...",
        "time_complexity": "O(n)",
        "space_complexity": "O(n)"
    }
    
    # Calculate memory for different scenarios
    scenarios = [
        {
            "name": "Small Application (100 users)",
            "blogs": 50,
            "users": 100,
            "jobs": 200,
            "dsa_questions": 500,
            "sessions": 50
        },
        {
            "name": "Medium Application (1,000 users)",
            "blogs": 200,
            "users": 1000,
            "jobs": 1000,
            "dsa_questions": 2000,
            "sessions": 500
        },
        {
            "name": "Large Application (10,000 users)",
            "blogs": 500,
            "users": 10000,
            "jobs": 5000,
            "dsa_questions": 5000,
            "sessions": 2000
        }
    ]
    
    print("\n📋 Memory Usage Estimates:")
    print("-" * 50)
    
    for scenario in scenarios:
        print(f"\n🎯 {scenario['name']}:")
        
        # Blog cache
        blog_list_memory = calculate_list_memory(
            "cache:blogs:list", 
            [sample_blog] * scenario['blogs']
        )
        blog_detail_memory = sum([
            calculate_string_memory(f"cache:blogs:detail:{i}", sample_blog)
            for i in range(scenario['blogs'])
        ])
        total_blog_memory = blog_list_memory + blog_detail_memory
        
        # User cache
        user_profile_memory = sum([
            calculate_string_memory(f"cache:users:profile:{i}", sample_user)
            for i in range(scenario['users'])
        ])
        
        # Job cache
        job_list_memory = calculate_list_memory(
            "cache:jobs:recent",
            [sample_job] * min(scenario['jobs'], 100)  # Cache recent 100 jobs
        )
        job_detail_memory = sum([
            calculate_string_memory(f"cache:jobs:detail:{i}", sample_job)
            for i in range(min(scenario['jobs'], 500))  # Cache detail for 500 jobs
        ])
        total_job_memory = job_list_memory + job_detail_memory
        
        # DSA questions cache
        dsa_list_memory = calculate_list_memory(
            "cache:dsa:questions",
            [sample_dsa_question] * scenario['dsa_questions']
        )
        
        # Session cache
        session_memory = sum([
            calculate_string_memory(f"session:{i}", sample_user)
            for i in range(scenario['sessions'])
        ])
        
        # Total memory
        total_memory = (
            total_blog_memory +
            user_profile_memory +
            total_job_memory +
            dsa_list_memory +
            session_memory
        )
        
        # Convert to MB
        total_mb = total_memory / (1024 * 1024)
        
        print(f"  📝 Blogs: {total_blog_memory / 1024:.1f} KB")
        print(f"  👤 Users: {user_profile_memory / 1024:.1f} KB")
        print(f"  💼 Jobs: {total_job_memory / 1024:.1f} KB")
        print(f"  🧮 DSA Questions: {dsa_list_memory / 1024:.1f} KB")
        print(f"  🔐 Sessions: {session_memory / 1024:.1f} KB")
        print(f"  📊 Total: {total_mb:.2f} MB")
        
        # Check if fits in 30MB
        if total_mb <= 30:
            print(f"  ✅ Fits in 30MB Redis ({(30 - total_mb):.2f} MB remaining)")
        else:
            print(f"  ❌ Exceeds 30MB Redis ({(total_mb - 30):.2f} MB over)")
            print(f"  💡 Consider: Reduce cache TTL, optimize data structures, or upgrade plan")

def show_memory_optimization_tips():
    """Show tips for optimizing Redis memory usage"""
    
    print("\n💡 Memory Optimization Tips:")
    print("=" * 50)
    
    tips = [
        {
            "tip": "Use shorter key names",
            "example": "cache:blogs:list instead of cache:blog_posts:all_published_posts",
            "savings": "20-50% key memory"
        },
        {
            "tip": "Implement TTL (Time To Live)",
            "example": "Set expiration for cache entries",
            "savings": "Automatic cleanup"
        },
        {
            "tip": "Compress large values",
            "example": "Use gzip for blog content",
            "savings": "60-80% for text data"
        },
        {
            "tip": "Use appropriate data types",
            "example": "Hashes for user profiles, lists for collections",
            "savings": "10-30% memory"
        },
        {
            "tip": "Cache only essential data",
            "example": "Cache IDs and titles, not full content",
            "savings": "50-70% memory"
        },
        {
            "tip": "Implement cache eviction",
            "example": "LRU (Least Recently Used) policy",
            "savings": "Prevents memory overflow"
        }
    ]
    
    for i, tip in enumerate(tips, 1):
        print(f"{i}. {tip['tip']}")
        print(f"   Example: {tip['example']}")
        print(f"   Savings: {tip['savings']}")
        print()

def show_redis_plans_comparison():
    """Show Redis plan comparison"""
    
    print("\n💰 Redis Plan Comparison:")
    print("=" * 50)
    
    plans = [
        {
            "provider": "Render (Free)",
            "memory": "30 MB",
            "price": "Free",
            "suitable_for": "Small apps, testing, development"
        },
        {
            "provider": "Render (Starter)",
            "memory": "100 MB",
            "price": "$7/month",
            "suitable_for": "Medium apps, production"
        },
        {
            "provider": "Render (Standard)",
            "memory": "1 GB",
            "price": "$25/month",
            "suitable_for": "Large apps, high traffic"
        },
        {
            "provider": "Upstash (Free)",
            "memory": "256 MB",
            "price": "Free",
            "suitable_for": "Small to medium apps"
        },
        {
            "provider": "Upstash (Pay-as-you-go)",
            "memory": "Unlimited",
            "price": "$0.40/GB/month",
            "suitable_for": "Variable usage, cost-effective"
        },
        {
            "provider": "Redis Cloud (Free)",
            "memory": "30 MB",
            "price": "Free",
            "suitable_for": "Development, small apps"
        }
    ]
    
    for plan in plans:
        print(f"📦 {plan['provider']}")
        print(f"   Memory: {plan['memory']}")
        print(f"   Price: {plan['price']}")
        print(f"   Best for: {plan['suitable_for']}")
        print()

def main():
    """Main function"""
    if len(sys.argv) > 1 and sys.argv[1] == "--optimization":
        show_memory_optimization_tips()
        show_redis_plans_comparison()
    else:
        estimate_application_memory()
        print("\n💡 Run with --optimization flag for optimization tips:")
        print("   python redis_memory_calculator.py --optimization")

if __name__ == "__main__":
    main() 