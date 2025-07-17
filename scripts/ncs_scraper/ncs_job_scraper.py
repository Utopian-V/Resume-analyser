#!/usr/bin/env python3
"""
NCS Job Scraper for Resume Review AI Platform
Scrapes jobs from National Career Service (NCS) website by Government of India
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

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class NCSJobScraper:
    def __init__(self):
        self.base_url = "https://www.ncs.gov.in"
        self.search_url = "https://www.ncs.gov.in/job-search"
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
        })
        
        # Job categories to search for
        self.job_categories = [
            "Software Engineer",
            "Software Developer", 
            "Frontend Developer",
            "Backend Developer",
            "Full Stack Developer",
            "Data Scientist",
            "Data Analyst",
            "DevOps Engineer",
            "Product Manager",
            "UI/UX Designer",
            "Quality Assurance",
            "System Administrator",
            "Network Engineer",
            "Database Administrator",
            "Mobile Developer",
            "React Developer",
            "Python Developer",
            "Java Developer",
            "Node.js Developer",
            "Machine Learning Engineer",
            "Cloud Engineer",
            "Security Engineer",
            "Test Engineer",
            "Business Analyst",
            "Project Manager",
            "Technical Lead",
            "Solution Architect",
            "Data Engineer",
            "AI Engineer",
            "Blockchain Developer",
            "Game Developer",
            "Embedded Systems Engineer",
            "IT Support Specialist",
            "Network Security Engineer",
            "Database Developer",
            "API Developer",
            "DevSecOps Engineer",
            "Site Reliability Engineer",
            "Platform Engineer",
            "Infrastructure Engineer",
            "Automation Engineer",
            "Performance Engineer",
            "Integration Engineer",
            "Middleware Developer",
            "ETL Developer",
            "BI Developer",
            "Analytics Engineer",
            "Research Engineer",
            "Computer Vision Engineer",
            "NLP Engineer"
        ]

    def search_jobs(self, category: str, location: str = "All India", page: int = 1) -> List[Dict]:
        """
        Search for jobs on NCS website
        """
        try:
            # For now, return mock data since NCS website structure needs to be analyzed
            # In production, this would make actual HTTP requests to NCS
            logger.info(f"Searching for {category} jobs in {location}, page {page}")
            
            # Mock job data for testing
            mock_jobs = self._get_mock_jobs(category)
            
            logger.info(f"Found {len(mock_jobs)} jobs for {category}")
            return mock_jobs
            
        except requests.RequestException as e:
            logger.error(f"Error searching jobs for {category}: {e}")
            return []
        except Exception as e:
            logger.error(f"Unexpected error searching jobs for {category}: {e}")
            return []

    def _get_mock_jobs(self, category: str) -> List[Dict]:
        """
        Generate mock job data for testing
        """
        mock_jobs = []
        
        # Generate different jobs based on category
        if "Software" in category or "Developer" in category:
            mock_jobs = [
                {
                    "id": f"ncs_sw_{hash(category)}_1",
                    "title": "Software Engineer",
                    "company": "Ministry of Electronics and Information Technology",
                    "location": "New Delhi, Delhi",
                    "description": "We are looking for a skilled Software Engineer to join our development team. The ideal candidate will have experience in Java, Spring Boot, and microservices architecture.",
                    "requirements": ["Java", "Spring Boot", "Microservices", "REST APIs", "Database Design"],
                    "salary_range": "₹45,000 - ₹75,000 per month",
                    "posted_date": "2024-01-15",
                    "application_deadline": "2024-02-15",
                    "source": "National Career Service (NCS)",
                    "source_url": "https://www.ncs.gov.in",
                    "category": "Backend Development",
                    "employment_type": "Full-time",
                    "experience_level": "Mid-level",
                    "remote_friendly": False,
                    "government_job": True
                },
                {
                    "id": f"ncs_sw_{hash(category)}_2",
                    "title": "Frontend Developer",
                    "company": "Digital India Corporation",
                    "location": "Bangalore, Karnataka",
                    "description": "Join our team to build user-friendly web applications using modern frontend technologies. Experience with React and TypeScript required.",
                    "requirements": ["React", "TypeScript", "JavaScript", "CSS", "HTML"],
                    "salary_range": "₹50,000 - ₹80,000 per month",
                    "posted_date": "2024-01-10",
                    "application_deadline": "2024-02-10",
                    "source": "National Career Service (NCS)",
                    "source_url": "https://www.ncs.gov.in",
                    "category": "Frontend Development",
                    "employment_type": "Full-time",
                    "experience_level": "Mid-level",
                    "remote_friendly": True,
                    "government_job": True
                }
            ]
        elif "Data" in category or "Scientist" in category:
            mock_jobs = [
                {
                    "id": f"ncs_ds_{hash(category)}_1",
                    "title": "Data Scientist",
                    "company": "National Informatics Centre",
                    "location": "Hyderabad, Telangana",
                    "description": "Work on cutting-edge data science projects for government initiatives. Experience with Python, machine learning, and big data technologies required.",
                    "requirements": ["Python", "Machine Learning", "SQL", "Statistics", "Data Analysis"],
                    "salary_range": "₹60,000 - ₹90,000 per month",
                    "posted_date": "2024-01-12",
                    "application_deadline": "2024-02-12",
                    "source": "National Career Service (NCS)",
                    "source_url": "https://www.ncs.gov.in",
                    "category": "Data Science & AI",
                    "employment_type": "Full-time",
                    "experience_level": "Senior",
                    "remote_friendly": False,
                    "government_job": True
                }
            ]
        elif "Cloud" in category or "DevOps" in category:
            mock_jobs = [
                {
                    "id": f"ncs_cloud_{hash(category)}_1",
                    "title": "Cloud Engineer",
                    "company": "National e-Governance Division",
                    "location": "Mumbai, Maharashtra",
                    "description": "Design and implement cloud infrastructure solutions for government digital initiatives. Experience with AWS, Azure, and Kubernetes required.",
                    "requirements": ["AWS", "Azure", "Kubernetes", "Docker", "Terraform"],
                    "salary_range": "₹55,000 - ₹85,000 per month",
                    "posted_date": "2024-01-14",
                    "application_deadline": "2024-02-14",
                    "source": "National Career Service (NCS)",
                    "source_url": "https://www.ncs.gov.in",
                    "category": "Cloud & DevOps",
                    "employment_type": "Full-time",
                    "experience_level": "Mid-level",
                    "remote_friendly": True,
                    "government_job": True
                }
            ]
        elif "Security" in category:
            mock_jobs = [
                {
                    "id": f"ncs_sec_{hash(category)}_1",
                    "title": "Security Engineer",
                    "company": "CERT-In (Computer Emergency Response Team)",
                    "location": "Chennai, Tamil Nadu",
                    "description": "Protect critical government infrastructure from cyber threats. Experience with security tools, penetration testing, and incident response required.",
                    "requirements": ["Cybersecurity", "Penetration Testing", "SIEM", "Network Security", "Incident Response"],
                    "salary_range": "₹65,000 - ₹95,000 per month",
                    "posted_date": "2024-01-16",
                    "application_deadline": "2024-02-16",
                    "source": "National Career Service (NCS)",
                    "source_url": "https://www.ncs.gov.in",
                    "category": "Cybersecurity",
                    "employment_type": "Full-time",
                    "experience_level": "Senior",
                    "remote_friendly": False,
                    "government_job": True
                }
            ]
        elif "AI" in category or "Machine Learning" in category:
            mock_jobs = [
                {
                    "id": f"ncs_ai_{hash(category)}_1",
                    "title": "AI Engineer",
                    "company": "Centre for Development of Advanced Computing",
                    "location": "Pune, Maharashtra",
                    "description": "Develop AI solutions for government applications. Experience with deep learning, NLP, and computer vision required.",
                    "requirements": ["Python", "TensorFlow", "PyTorch", "NLP", "Computer Vision"],
                    "salary_range": "₹70,000 - ₹100,000 per month",
                    "posted_date": "2024-01-18",
                    "application_deadline": "2024-02-18",
                    "source": "National Career Service (NCS)",
                    "source_url": "https://www.ncs.gov.in",
                    "category": "AI & Machine Learning",
                    "employment_type": "Full-time",
                    "experience_level": "Senior",
                    "remote_friendly": True,
                    "government_job": True
                }
            ]
        else:
            # Generic job for other categories
            mock_jobs = [
                {
                    "id": f"ncs_gen_{hash(category)}_1",
                    "title": f"{category}",
                    "company": "Government of India",
                    "location": "Multiple Locations",
                    "description": f"Exciting opportunity for {category} position in government sector. Competitive salary and benefits package.",
                    "requirements": ["Relevant Experience", "Technical Skills", "Communication", "Problem Solving"],
                    "salary_range": "₹40,000 - ₹70,000 per month",
                    "posted_date": "2024-01-08",
                    "application_deadline": "2024-02-08",
                    "source": "National Career Service (NCS)",
                    "source_url": "https://www.ncs.gov.in",
                    "category": "Software Development",
                    "employment_type": "Full-time",
                    "experience_level": "Mid-level",
                    "remote_friendly": False,
                    "government_job": True
                }
            ]
        
        return mock_jobs

    def _parse_job_listings(self, soup: BeautifulSoup) -> List[Dict]:
        """
        Parse job listings from the search results page
        """
        jobs = []
        
        try:
            # Look for job listing containers
            job_containers = soup.find_all('div', class_=re.compile(r'job|listing|card', re.I))
            
            if not job_containers:
                # Try alternative selectors
                job_containers = soup.find_all('div', class_=re.compile(r'result|item', re.I))
            
            for container in job_containers:
                job = self._extract_job_details(container)
                if job:
                    jobs.append(job)
                    
        except Exception as e:
            logger.error(f"Error parsing job listings: {e}")
            
        return jobs

    def _extract_job_details(self, container) -> Optional[Dict]:
        """
        Extract job details from a job listing container
        """
        try:
            # Extract job title
            title_elem = container.find(['h1', 'h2', 'h3', 'h4'], class_=re.compile(r'title|heading', re.I))
            title = title_elem.get_text(strip=True) if title_elem else "N/A"
            
            # Extract company name
            company_elem = container.find(['span', 'div'], class_=re.compile(r'company|organization', re.I))
            company = company_elem.get_text(strip=True) if company_elem else "N/A"
            
            # Extract location
            location_elem = container.find(['span', 'div'], class_=re.compile(r'location|place', re.I))
            location = location_elem.get_text(strip=True) if location_elem else "N/A"
            
            # Extract salary
            salary_elem = container.find(['span', 'div'], class_=re.compile(r'salary|compensation', re.I))
            salary = salary_elem.get_text(strip=True) if salary_elem else "Not specified"
            
            # Extract job description
            desc_elem = container.find(['p', 'div'], class_=re.compile(r'description|summary', re.I))
            description = desc_elem.get_text(strip=True) if desc_elem else "Job description not available"
            
            # Extract requirements
            req_elem = container.find(['div', 'ul'], class_=re.compile(r'requirement|skill', re.I))
            requirements = []
            if req_elem:
                req_items = req_elem.find_all(['li', 'span'])
                requirements = [item.get_text(strip=True) for item in req_items if item.get_text(strip=True)]
            
            # Extract posted date
            date_elem = container.find(['span', 'div'], class_=re.compile(r'date|posted', re.I))
            posted_date = date_elem.get_text(strip=True) if date_elem else "Recently posted"
            
            # Extract application deadline
            deadline_elem = container.find(['span', 'div'], class_=re.compile(r'deadline|last', re.I))
            deadline = deadline_elem.get_text(strip=True) if deadline_elem else "Not specified"
            
            # Generate unique job ID
            job_id = f"ncs_{hash(title + company + location) % 1000000}"
            
            return {
                "id": job_id,
                "title": title,
                "company": company,
                "location": location,
                "description": description,
                "requirements": requirements,
                "salary_range": salary,
                "posted_date": posted_date,
                "application_deadline": deadline,
                "source": "National Career Service (NCS)",
                "source_url": self.base_url,
                "category": self._categorize_job(title),
                "employment_type": self._determine_employment_type(description),
                "experience_level": self._determine_experience_level(description),
                "remote_friendly": self._check_remote_friendly(description),
                "government_job": self._is_government_job(company, description)
            }
            
        except Exception as e:
            logger.error(f"Error extracting job details: {e}")
            return None

    def _categorize_job(self, title: str) -> str:
        """
        Categorize job based on title
        """
        title_lower = title.lower()
        
        if any(word in title_lower for word in ['frontend', 'react', 'angular', 'vue', 'ui']):
            return "Frontend Development"
        elif any(word in title_lower for word in ['backend', 'api', 'server', 'database']):
            return "Backend Development"
        elif any(word in title_lower for word in ['full stack', 'fullstack', 'full-stack']):
            return "Full Stack Development"
        elif any(word in title_lower for word in ['data scientist', 'machine learning', 'ml', 'ai']):
            return "Data Science & AI"
        elif any(word in title_lower for word in ['devops', 'cloud', 'aws', 'azure']):
            return "DevOps & Cloud"
        elif any(word in title_lower for word in ['product manager', 'project manager']):
            return "Product Management"
        elif any(word in title_lower for word in ['ui/ux', 'designer', 'design']):
            return "UI/UX Design"
        elif any(word in title_lower for word in ['qa', 'testing', 'quality']):
            return "Quality Assurance"
        else:
            return "Software Development"

    def _determine_employment_type(self, description: str) -> str:
        """
        Determine employment type from job description
        """
        desc_lower = description.lower()
        
        if any(word in desc_lower for word in ['contract', 'temporary', 'temp']):
            return "Contract"
        elif any(word in desc_lower for word in ['part-time', 'part time']):
            return "Part-time"
        elif any(word in desc_lower for word in ['internship', 'intern']):
            return "Internship"
        else:
            return "Full-time"

    def _determine_experience_level(self, description: str) -> str:
        """
        Determine experience level from job description
        """
        desc_lower = description.lower()
        
        if any(word in desc_lower for word in ['senior', 'lead', 'principal', 'architect']):
            return "Senior"
        elif any(word in desc_lower for word in ['junior', 'entry', 'fresher', 'graduate']):
            return "Entry-level"
        elif any(word in desc_lower for word in ['mid', 'middle', 'intermediate']):
            return "Mid-level"
        else:
            return "Not specified"

    def _check_remote_friendly(self, description: str) -> bool:
        """
        Check if job is remote-friendly
        """
        desc_lower = description.lower()
        remote_keywords = ['remote', 'work from home', 'wfh', 'virtual', 'telecommute']
        return any(keyword in desc_lower for keyword in remote_keywords)

    def _is_government_job(self, company: str, description: str) -> bool:
        """
        Check if it's a government job
        """
        gov_keywords = ['government', 'ministry', 'department', 'public sector', 'psu']
        text = (company + " " + description).lower()
        return any(keyword in text for keyword in gov_keywords)

    def scrape_all_jobs(self, max_pages: int = 5) -> List[Dict]:
        """
        Scrape jobs from all categories
        """
        all_jobs = []
        
        for category in self.job_categories:
            logger.info(f"Scraping jobs for category: {category}")
            
            for page in range(1, max_pages + 1):
                jobs = self.search_jobs(category, page=page)
                all_jobs.extend(jobs)
                
                # Add delay to be respectful to the server
                time.sleep(random.uniform(1, 3))
                
                # If no jobs found, move to next category
                if not jobs:
                    break
            
            logger.info(f"Completed scraping for {category}")
        
        # Remove duplicates based on job ID
        unique_jobs = {job['id']: job for job in all_jobs}.values()
        
        logger.info(f"Total unique jobs scraped: {len(unique_jobs)}")
        return list(unique_jobs)

    def save_jobs_to_file(self, jobs: List[Dict], filename: str = "ncs_jobs.json"):
        """
        Save scraped jobs to JSON file
        """
        try:
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump({
                    "source": "National Career Service (NCS)",
                    "scraped_at": datetime.now().isoformat(),
                    "total_jobs": len(jobs),
                    "jobs": jobs
                }, f, indent=2, ensure_ascii=False)
            
            logger.info(f"Saved {len(jobs)} jobs to {filename}")
            
        except Exception as e:
            logger.error(f"Error saving jobs to file: {e}")

    def update_backend_jobs(self, jobs: List[Dict], api_url: str = "http://localhost:8000"):
        """
        Update backend with scraped jobs
        """
        try:
            # Convert jobs to backend format
            backend_jobs = []
            for job in jobs:
                backend_job = {
                    "id": job["id"],
                    "title": job["title"],
                    "company": job["company"],
                    "location": job["location"],
                    "description": job["description"],
                    "requirements": job["requirements"],
                    "salary_range": job["salary_range"],
                    "application_deadline": job["application_deadline"],
                    "posted_date": job["posted_date"],
                    "source": job["source"],
                    "source_url": job["source_url"],
                    "category": job["category"],
                    "employment_type": job["employment_type"],
                    "experience_level": job["experience_level"],
                    "remote_friendly": job["remote_friendly"],
                    "government_job": job["government_job"]
                }
                backend_jobs.append(backend_job)
            
            # Send to backend API
            response = requests.post(f"{api_url}/api/jobs/bulk-update", json={
                "jobs": backend_jobs,
                "source": "ncs"
            })
            
            if response.status_code == 200:
                logger.info(f"Successfully updated backend with {len(backend_jobs)} NCS jobs")
            else:
                logger.error(f"Failed to update backend: {response.status_code}")
                
        except Exception as e:
            logger.error(f"Error updating backend: {e}")

def main():
    """
    Main function to run the NCS job scraper
    """
    scraper = NCSJobScraper()
    
    logger.info("Starting NCS job scraping...")
    
    # Scrape jobs
    jobs = scraper.scrape_all_jobs(max_pages=3)
    
    if jobs:
        # Save to file
        scraper.save_jobs_to_file(jobs, "ncs_jobs.json")
        
        # Update backend (uncomment when backend endpoint is ready)
        # scraper.update_backend_jobs(jobs)
        
        logger.info("NCS job scraping completed successfully!")
    else:
        logger.warning("No jobs were scraped. Check the website structure or network connection.")

if __name__ == "__main__":
    main() 