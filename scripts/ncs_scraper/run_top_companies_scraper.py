#!/usr/bin/env python3
"""
Runner script for Top Companies Job Scraper
"""

import sys
import os
import json
from datetime import datetime
from top_companies_scraper import TopCompaniesJobScraper

def run_top_companies_scrape():
    """Run the top companies scraping process"""
    print("🚀 Starting Top Companies Job Scraper")
    print("=" * 50)
    
    try:
        scraper = TopCompaniesJobScraper()
        
        # Scrape all companies
        print("📊 Scraping jobs from company career pages...")
        company_stats = scraper.scrape_all_companies()
        
        if not company_stats:
            print("❌ No companies were successfully scraped")
            return False
        
        # Get top 20 companies
        print("🏆 Identifying top 20 companies...")
        top_20 = scraper.get_top_20_companies(company_stats)
        
        # Save results
        print("💾 Saving results...")
        scraper.save_results(company_stats, top_20)
        
        # Update backend with top 20 jobs
        print("🔄 Updating backend with top 20 company jobs...")
        success = update_backend_with_top_20_jobs(top_20)
        
        if success:
            print("✅ Top companies scraping completed successfully!")
            print(f"📊 Total companies processed: {len(company_stats)}")
            print(f"📊 Total jobs found: {len(scraper.all_jobs)}")
            print(f"🏆 Top 20 companies identified with {sum(company['job_count'] for company in top_20)} jobs")
            return True
        else:
            print("⚠️ Scraping completed but backend update failed")
            return False
            
    except Exception as e:
        print(f"❌ Error during scraping: {e}")
        return False

def update_backend_with_top_20_jobs(top_20_companies):
    """Update backend with jobs from top 20 companies"""
    try:
        import requests
        
        # Collect all jobs from top 20 companies
        all_jobs = []
        for company in top_20_companies:
            all_jobs.extend(company['jobs'])
        
        # Prepare data for backend
        backend_data = {
            "jobs": all_jobs,
            "source": "Top 20 Companies Career Pages"
        }
        
        # Send to backend
        response = requests.post(
            "http://localhost:8000/api/jobs/bulk-update",
            json=backend_data,
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Backend updated: {result.get('message', 'Success')}")
            return True
        else:
            print(f"❌ Backend update failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error updating backend: {e}")
        return False

def main():
    """Main function"""
    print("🎯 Top Companies Job Scraper for Resume Review AI Platform")
    print("=" * 60)
    
    success = run_top_companies_scrape()
    
    if success:
        print("\n🎉 All done! Check the generated JSON files for results.")
        print("📁 Files created:")
        print("   - company_jobs_[timestamp].json (all companies)")
        print("   - top_20_companies_jobs_[timestamp].json (top 20)")
    else:
        print("\n❌ Scraping failed. Check logs for details.")
    
    return success

if __name__ == "__main__":
    main() 