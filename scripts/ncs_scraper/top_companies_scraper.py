#!/usr/bin/env python3
"""
Top Companies Job Scraper
Scrapes career pages from multiple companies and identifies top 20 with most job postings
"""

import requests
import json
import time
import random
from datetime import datetime, timedelta
from bs4 import BeautifulSoup
import re
from typing import List, Dict, Optional
import logging
from urllib.parse import urljoin, urlparse
from collections import defaultdict
import aiosqlite
import asyncio
import os

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

DB_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../backend/jobs.db'))

async def upsert_job(job):
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute('''
            INSERT OR REPLACE INTO jobs (
                id, title, company, company_domain, company_logo, company_credit, location, description, requirements, salary_range, posted_date, application_deadline, source, source_url, category, employment_type, experience_level, remote_friendly, government_job, tags, scraped_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            job.get('id'), job.get('title'), job.get('company'), job.get('company_domain'), job.get('company_logo'), job.get('company_credit'), job.get('location'), job.get('description'), json.dumps(job.get('requirements', [])), job.get('salary_range'), job.get('posted_date'), job.get('application_deadline'), job.get('source'), job.get('source_url'), job.get('category'), job.get('employment_type'), job.get('experience_level'), int(bool(job.get('remote_friendly'))), int(bool(job.get('government_job'))), json.dumps(job.get('tags', [])), job.get('scraped_at', None)
        ))
        await db.commit()

class TopCompaniesJobScraper:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
        })
        
        # Common career page patterns
        self.career_patterns = [
            '/careers',
            '/jobs',
            '/work-with-us',
            '/join-us',
            '/opportunities',
            '/careers/jobs',
            '/careers/opportunities',
            '/jobs/careers',
            '/careers/current-openings',
            '/careers/open-positions',
            '/careers/join-our-team',
            '/careers/we-are-hiring',
            '/careers/apply-now',
            '/careers/current-vacancies',
            '/careers/available-positions'
        ]
        
        # Known company domains to start with
        self.known_companies = [
            'google.com',
            'microsoft.com',
            'amazon.com',
            'apple.com',
            'meta.com',
            'netflix.com',
            'uber.com',
            'airbnb.com',
            'spotify.com',
            'linkedin.com',
            'twitter.com',
            'salesforce.com',
            'adobe.com',
            'oracle.com',
            'intel.com',
            'cisco.com',
            'ibm.com',
            'dell.com',
            'hp.com',
            'vmware.com',
            'nvidia.com',
            'amd.com',
            'qualcomm.com',
            'broadcom.com',
            'juniper.net',
            'paloaltonetworks.com',
            'crowdstrike.com',
            'splunk.com',
            'datadog.com',
            'mongodb.com',
            'elastic.co',
            'hashicorp.com',
            'atlassian.com',
            'slack.com',
            'zoom.us',
            'dropbox.com',
            'box.com',
            'twilio.com',
            'stripe.com',
            'square.com',
            'paypal.com',
            'visa.com',
            'mastercard.com',
            'americanexpress.com',
            'goldmansachs.com',
            'jpmorgan.com',
            'morganstanley.com',
            'blackrock.com',
            'fidelity.com',
            'vanguard.com'
        ]
        
        self.scraped_companies = {}
        self.all_jobs = []

    def find_career_pages(self, domain: str) -> List[str]:
        """Find career pages for a given domain"""
        career_urls = []
        
        try:
            # Try common career page patterns
            for pattern in self.career_patterns:
                url = f"https://{domain}{pattern}"
                try:
                    response = self.session.get(url, timeout=10)
                    if response.status_code == 200:
                        career_urls.append(url)
                        logger.info(f"Found career page: {url}")
                except:
                    continue
            
            # If no patterns work, try to find career links on homepage
            try:
                response = self.session.get(f"https://{domain}", timeout=10)
                if response.status_code == 200:
                    soup = BeautifulSoup(response.content, 'html.parser')
                    
                    # Look for career-related links
                    career_keywords = ['career', 'job', 'work', 'join', 'opportunity', 'hiring']
                    for link in soup.find_all('a', href=True):
                        href = link.get('href', '').lower()
                        text = link.get_text().lower()
                        
                        for keyword in career_keywords:
                            if keyword in href or keyword in text:
                                full_url = urljoin(f"https://{domain}", link['href'])
                                if full_url not in career_urls:
                                    career_urls.append(full_url)
                                    logger.info(f"Found career link: {full_url}")
                                    break
            except:
                pass
                
        except Exception as e:
            logger.error(f"Error finding career pages for {domain}: {e}")
            
        return career_urls

    def scrape_company_jobs(self, company_domain: str, career_urls: List[str]) -> List[Dict]:
        """Scrape jobs from a company's career pages"""
        company_jobs = []
        
        for career_url in career_urls:
            try:
                logger.info(f"Scraping jobs from: {career_url}")
                response = self.session.get(career_url, timeout=15)
                
                if response.status_code == 200:
                    soup = BeautifulSoup(response.content, 'html.parser')
                    jobs = self._extract_jobs_from_page(soup, company_domain, career_url)
                    company_jobs.extend(jobs)
                    
                    # Add delay to be respectful
                    time.sleep(random.uniform(1, 3))
                    
            except Exception as e:
                logger.error(f"Error scraping {career_url}: {e}")
                continue
        
        return company_jobs

    def _extract_jobs_from_page(self, soup: BeautifulSoup, company_domain: str, page_url: str) -> List[Dict]:
        """Extract job listings from a career page"""
        jobs = []
        
        # Common job listing selectors
        job_selectors = [
            'div[class*="job"]',
            'div[class*="position"]',
            'div[class*="opening"]',
            'div[class*="listing"]',
            'div[class*="vacancy"]',
            'article[class*="job"]',
            'li[class*="job"]',
            'div[class*="career"]',
            'div[class*="opportunity"]'
        ]
        
        for selector in job_selectors:
            job_containers = soup.select(selector)
            if job_containers:
                logger.info(f"Found {len(job_containers)} job containers with selector: {selector}")
                break
        
        if not job_containers:
            # Try alternative approach - look for job-like content
            job_containers = self._find_job_like_content(soup)
        
        for container in job_containers:
            job = self._extract_job_details(container, company_domain, page_url)
            if job:
                jobs.append(job)
        
        return jobs

    def _find_job_like_content(self, soup: BeautifulSoup) -> List:
        """Find content that looks like job listings"""
        containers = []
        
        # Look for elements with job-related text
        job_keywords = ['software engineer', 'developer', 'manager', 'analyst', 'specialist', 'coordinator']
        
        for element in soup.find_all(['div', 'article', 'li']):
            text = element.get_text().lower()
            if any(keyword in text for keyword in job_keywords):
                containers.append(element)
        
        return containers

    def _extract_job_details(self, container, company_domain: str, page_url: str) -> Optional[Dict]:
        """Extract job details from a container"""
        try:
            # Extract job title
            title_selectors = ['h1', 'h2', 'h3', 'h4', '[class*="title"]', '[class*="position"]']
            title = None
            for selector in title_selectors:
                title_elem = container.select_one(selector)
                if title_elem:
                    title = title_elem.get_text(strip=True)
                    break
            
            if not title:
                return None
            
            # Extract company name from domain
            company_name = company_domain.replace('.com', '').replace('.co', '').title()
            
            # Extract location
            location_selectors = ['[class*="location"]', '[class*="place"]', '[class*="city"]']
            location = "Remote/Not specified"
            for selector in location_selectors:
                location_elem = container.select_one(selector)
                if location_elem:
                    location = location_elem.get_text(strip=True)
                    break
            
            # Extract description
            desc_selectors = ['[class*="description"]', '[class*="summary"]', 'p']
            description = "Job description not available"
            for selector in desc_selectors:
                desc_elem = container.select_one(selector)
                if desc_elem:
                    description = desc_elem.get_text(strip=True)
                    break
            
            # Extract requirements
            requirements = []
            req_selectors = ['[class*="requirement"]', '[class*="skill"]', 'ul', 'ol']
            for selector in req_selectors:
                req_elem = container.select_one(selector)
                if req_elem:
                    req_items = req_elem.find_all(['li', 'span'])
                    requirements = [item.get_text(strip=True) for item in req_items if item.get_text(strip=True)]
                    if requirements:
                        break
            
            # Generate unique job ID
            job_id = f"{company_domain}_{hash(title + company_name) % 1000000}"
            
            # Determine job category
            category = self._categorize_job(title)
            
            # Determine experience level
            experience_level = self._determine_experience_level(title, description)
            
            # Check if remote friendly
            remote_friendly = self._check_remote_friendly(title, description)
            
            job = {
                "id": job_id,
                "title": title,
                "company": company_name,
                "location": location,
                "description": description,
                "requirements": requirements[:5] if requirements else ["Relevant experience", "Technical skills"],
                "salary_range": "Competitive salary",
                "posted_date": datetime.now().strftime("%Y-%m-%d"),
                "application_deadline": "Not specified",
                "source": f"Career Page - {company_name}",
                "source_url": page_url,
                "category": category,
                "employment_type": "Full-time",
                "experience_level": experience_level,
                "remote_friendly": remote_friendly,
                "government_job": False
            }
            
            return job
            
        except Exception as e:
            logger.error(f"Error extracting job details: {e}")
            return None

    def _categorize_job(self, title: str) -> str:
        """Categorize job based on title"""
        title_lower = title.lower()
        
        if any(word in title_lower for word in ['frontend', 'react', 'vue', 'angular', 'ui']):
            return "Frontend Development"
        elif any(word in title_lower for word in ['backend', 'api', 'server', 'database']):
            return "Backend Development"
        elif any(word in title_lower for word in ['full stack', 'fullstack', 'full-stack']):
            return "Full Stack Development"
        elif any(word in title_lower for word in ['data scientist', 'data science', 'ml', 'machine learning']):
            return "Data Science & AI"
        elif any(word in title_lower for word in ['devops', 'cloud', 'infrastructure', 'aws', 'azure']):
            return "DevOps & Cloud"
        elif any(word in title_lower for word in ['product manager', 'product management']):
            return "Product Management"
        elif any(word in title_lower for word in ['designer', 'ux', 'ui/ux']):
            return "UI/UX Design"
        elif any(word in title_lower for word in ['qa', 'test', 'quality assurance']):
            return "Quality Assurance"
        else:
            return "Software Development"

    def _determine_experience_level(self, title: str, description: str) -> str:
        """Determine experience level based on title and description"""
        text = (title + " " + description).lower()
        
        if any(word in text for word in ['senior', 'lead', 'principal', 'architect', 'manager']):
            return "Senior"
        elif any(word in text for word in ['junior', 'entry', 'graduate', 'intern']):
            return "Entry-level"
        else:
            return "Mid-level"

    def _check_remote_friendly(self, title: str, description: str) -> bool:
        """Check if job is remote friendly"""
        text = (title + " " + description).lower()
        remote_keywords = ['remote', 'work from home', 'wfh', 'virtual', 'distributed']
        return any(keyword in text for keyword in remote_keywords)

    def save_company_jobs(self, domain: str, jobs: list):
        """Save jobs for a single company to a JSON file immediately."""
        if not jobs:
            return
        filename = f"jobs_{domain}.json"
        with open(filename, "w") as f:
            json.dump({
                "source": f"Career Page - {domain}",
                "scraped_at": datetime.now().isoformat(),
                "total_jobs": len(jobs),
                "jobs": jobs
            }, f, indent=2)
        logger.info(f"Saved {len(jobs)} jobs to {filename}")

    async def scrape_all_companies(self) -> Dict:
        """Scrape jobs from all known companies"""
        logger.info("Starting to scrape jobs from top companies...")
        company_stats = {}
        for domain in self.known_companies:
            try:
                logger.info(f"Processing company: {domain}")
                # Find career pages
                career_urls = self.find_career_pages(domain)
                if career_urls:
                    # Scrape jobs
                    jobs = self.scrape_company_jobs(domain, career_urls)
                    if jobs:
                        company_stats[domain] = {
                            'name': domain.replace('.com', '').title(),
                            'job_count': len(jobs),
                            'jobs': jobs,
                            'career_urls': career_urls
                        }
                        self.all_jobs.extend(jobs)
                        logger.info(f"Scraped {len(jobs)} jobs from {domain}")
                        for job in jobs:
                            job['company_domain'] = domain
                            job['company_logo'] = f"https://logo.clearbit.com/{domain}"
                            job['company_credit'] = f"Jobs scraped from {domain} career page"
                            job['scraped_at'] = datetime.now().isoformat()
                            await upsert_job(job)
                        print(f"Saved {len(jobs)} jobs for {domain} to DB.")
                    else:
                        logger.info(f"No jobs found for {domain}")
                else:
                    logger.info(f"No career pages found for {domain}")
                # Add delay between companies
                time.sleep(random.uniform(2, 5))
            except Exception as e:
                logger.error(f"Error processing {domain}: {e}")
                continue
        return company_stats

    def get_top_20_companies(self, company_stats: Dict) -> List[Dict]:
        """Get top 20 companies with most job postings"""
        # Sort companies by job count
        sorted_companies = sorted(
            company_stats.items(), 
            key=lambda x: x[1]['job_count'], 
            reverse=True
        )
        
        top_20 = sorted_companies[:20]
        
        logger.info("Top 20 companies by job count:")
        for i, (domain, stats) in enumerate(top_20, 1):
            logger.info(f"{i}. {stats['name']}: {stats['job_count']} jobs")
        
        return [{'domain': domain, **stats} for domain, stats in top_20]

    def save_results(self, company_stats: Dict, top_20: List[Dict]):
        """Save scraping results"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        # Save all company stats
        with open(f"company_jobs_{timestamp}.json", "w") as f:
            json.dump({
                "scraped_at": datetime.now().isoformat(),
                "total_companies": len(company_stats),
                "total_jobs": len(self.all_jobs),
                "company_stats": company_stats,
                "top_20_companies": top_20
            }, f, indent=2)
        
        # Save top 20 jobs
        top_20_jobs = []
        for company in top_20:
            top_20_jobs.extend(company['jobs'])
        
        with open(f"top_20_companies_jobs_{timestamp}.json", "w") as f:
            json.dump({
                "source": "Top 20 Companies Career Pages",
                "scraped_at": datetime.now().isoformat(),
                "total_jobs": len(top_20_jobs),
                "companies": [company['name'] for company in top_20],
                "jobs": top_20_jobs
            }, f, indent=2)
        
        logger.info(f"Results saved to company_jobs_{timestamp}.json and top_20_companies_jobs_{timestamp}.json")

def main():
    print("🎯 Top Companies Job Scraper")
    print("=" * 50)
    
    scraper = TopCompaniesJobScraper()
    
    # Scrape all companies
    company_stats = scraper.scrape_all_companies()
    
    if company_stats:
        # Get top 20 companies
        top_20 = scraper.get_top_20_companies(company_stats)
        
        # Save results
        scraper.save_results(company_stats, top_20)
        
        print(f"\n✅ Scraping completed!")
        print(f"📊 Total companies processed: {len(company_stats)}")
        print(f"📊 Total jobs found: {len(scraper.all_jobs)}")
        print(f"🏆 Top 20 companies identified with {sum(company['job_count'] for company in top_20)} jobs")
        
        return True
    else:
        print("❌ No companies were successfully scraped")
        return False

if __name__ == "__main__":
    import sys
    async def async_main():
        print("🎯 Top Companies Job Scraper (DB-integrated)")
        print("=" * 50)
        scraper = TopCompaniesJobScraper()
        company_stats = await scraper.scrape_all_companies()
        total_jobs = 0
        for domain, stats in company_stats.items():
            jobs = stats['jobs']
            for job in jobs:
                job['company_domain'] = domain
                job['company_logo'] = f"https://logo.clearbit.com/{domain}"
                job['company_credit'] = f"Jobs scraped from {domain} career page"
                job['scraped_at'] = stats.get('scraped_at', None)
                await upsert_job(job)
            total_jobs += len(jobs)
            print(f"Saved {len(jobs)} jobs for {domain} to DB.")
        print(f"\n✅ Scraping completed! Total jobs saved: {total_jobs}")
    asyncio.run(async_main()) 