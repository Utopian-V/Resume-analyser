#!/usr/bin/env python3
"""
Script to run the NCS job scraper and test functionality
"""

import sys
import os
import json
from datetime import datetime

# Add the scraper directory to the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from ncs_job_scraper import NCSJobScraper

def test_ncs_scraper():
    """Test the NCS scraper functionality"""
    print("🚀 Starting NCS Job Scraper Test")
    print("=" * 50)
    
    scraper = NCSJobScraper()
    
    # Test with a few categories first
    test_categories = [
        "Software Engineer",
        "Frontend Developer", 
        "Data Scientist"
    ]
    
    all_jobs = []
    
    for category in test_categories:
        print(f"\n🔍 Testing category: {category}")
        jobs = scraper.search_jobs(category)
        all_jobs.extend(jobs)
        print(f"✅ Found {len(jobs)} jobs for {category}")
        
        # Show sample job details
        if jobs:
            sample_job = jobs[0]
            print(f"   Sample job: {sample_job['title']} at {sample_job['company']}")
            print(f"   Location: {sample_job['location']}")
            print(f"   Source: {sample_job['source']}")
    
    print(f"\n📊 Total jobs found: {len(all_jobs)}")
    
    if all_jobs:
        # Save to file
        scraper.save_jobs_to_file(all_jobs, "test_ncs_jobs.json")
        print("💾 Saved test jobs to test_ncs_jobs.json")
        
        # Show job statistics
        ncs_jobs = [job for job in all_jobs if job['source'] == 'National Career Service (NCS)']
        gov_jobs = [job for job in all_jobs if job['government_job']]
        remote_jobs = [job for job in all_jobs if job['remote_friendly']]
        
        print(f"\n📈 Job Statistics:")
        print(f"   Total jobs: {len(all_jobs)}")
        print(f"   NCS jobs: {len(ncs_jobs)}")
        print(f"   Government jobs: {len(gov_jobs)}")
        print(f"   Remote jobs: {len(remote_jobs)}")
        
        # Show categories
        categories = {}
        for job in all_jobs:
            cat = job.get('category', 'Other')
            categories[cat] = categories.get(cat, 0) + 1
        
        print(f"\n📂 Job Categories:")
        for cat, count in categories.items():
            print(f"   {cat}: {count}")
        
        return True
    else:
        print("❌ No jobs found. Check the website structure or network connection.")
        return False

def run_full_scrape():
    """Run the full scraping process"""
    print("🚀 Starting Full NCS Job Scrape")
    print("=" * 50)
    
    scraper = NCSJobScraper()
    
    # Run full scrape
    jobs = scraper.scrape_all_jobs(max_pages=2)
    
    if jobs:
        # Save to file
        scraper.save_jobs_to_file(jobs, "ncs_jobs_full.json")
        print(f"💾 Saved {len(jobs)} jobs to ncs_jobs_full.json")
        
        # Try to update backend
        try:
            scraper.update_backend_jobs(jobs)
            print("✅ Successfully updated backend with NCS jobs")
        except Exception as e:
            print(f"⚠️  Could not update backend: {e}")
            print("   Make sure the backend server is running")
        
        return True
    else:
        print("❌ No jobs were scraped.")
        return False

def main():
    """Main function"""
    print("🎯 NCS Job Scraper for Resume Review AI Platform")
    print("=" * 60)
    
    # Check if we want to run test or full scrape
    if len(sys.argv) > 1 and sys.argv[1] == '--test':
        success = test_ncs_scraper()
    else:
        success = run_full_scrape()
    
    if success:
        print("\n✅ Scraping completed successfully!")
        print("\n📝 Next steps:")
        print("   1. Check the generated JSON files")
        print("   2. Start the backend server")
        print("   3. Run the scraper again to update the backend")
        print("   4. View jobs in the frontend")
    else:
        print("\n❌ Scraping failed. Check the logs above for errors.")
    
    print("\n" + "=" * 60)

if __name__ == "__main__":
    main() 