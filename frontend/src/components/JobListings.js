import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiBriefcase, FiMapPin, FiDollarSign, FiCalendar, FiExternalLink, FiCheckCircle, FiHome, FiAward, FiSearch, FiFilter, FiGlobe, FiHeart, FiChevronLeft, FiChevronRight, FiTag, FiStar, FiZap } from 'react-icons/fi';
import { getAllCompanyJobs } from '../api';
import { useRef } from 'react';

const Container = styled.div`
  max-width: 1300px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
`;

const Title = styled.h1`
  color: #3730a3;
  font-size: 2.7rem;
  font-weight: 900;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #6366f1;
  font-size: 1.15rem;
  margin-bottom: 1.5rem;
`;

const MainGrid = styled.div`
  display: flex;
  gap: 2.5rem;
  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

const FilterSidebar = styled.div`
  min-width: 260px;
  background: #f8fafc;
  border-radius: 1.2rem;
  box-shadow: 0 2px 12px rgba(99,102,241,0.07);
  padding: 2rem 1.5rem 1.5rem 1.5rem;
  position: sticky;
  top: 2rem;
  height: fit-content;
  @media (max-width: 900px) {
    position: static;
    width: 100%;
    margin-bottom: 1.5rem;
  }
`;

const FilterTitle = styled.h4`
  color: #3730a3;
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

const FilterGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FilterLabel = styled.label`
  display: block;
  color: #6366f1;
  font-size: 0.98rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const FilterSelect = styled.select`
  width: 100%;
  padding: 0.7rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  background-color: white;
  margin-bottom: 0.5rem;
  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
  }
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background: #f3f4f6;
  border-radius: 0.7rem;
  padding: 0.7rem 1rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 4px rgba(99,102,241,0.04);
`;

const SearchInput = styled.input`
  border: none;
  background: transparent;
  font-size: 1.1rem;
  flex: 1;
  color: #3730a3;
  &:focus {
    outline: none;
  }
`;

const JobGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(370px, 1fr));
  gap: 2rem;
`;

const JobCard = styled(motion.div)`
  background: white;
  border-radius: 1.2rem;
  padding: 1.7rem 1.5rem 1.2rem 1.5rem;
  box-shadow: 0 4px 24px rgba(99,102,241,0.13);
  border-left: 5px solid #6366f1;
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 340px;
  &:hover {
    transform: translateY(-4px) scale(1.01);
    box-shadow: 0 8px 32px rgba(99,102,241,0.22);
  }
`;

const JobHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const CompanyLogo = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 0.7rem;
  background: #f3f4f6;
  object-fit: contain;
  border: 1px solid #e5e7eb;
`;

const JobTitle = styled.h3`
  color: #3730a3;
  font-size: 1.25rem;
  font-weight: 800;
  margin: 0;
  flex: 1;
`;

const CompanyCredit = styled.div`
  color: #6366f1;
  font-size: 0.9rem;
  font-weight: 600;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

const JobMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  color: #6366f1;
  font-size: 0.97rem;
`;

const JobDescription = styled.p`
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const RequirementsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1rem 0;
`;

const RequirementItem = styled.li`
  color: #6366f1;
  font-size: 0.95rem;
  margin-bottom: 0.3rem;
  padding-left: 1rem;
  position: relative;
  &:before {
    content: "•";
    color: #6366f1;
    position: absolute;
    left: 0;
  }
`;

const Button = styled.button`
  background: ${props => props.variant === 'secondary' ? '#f3f4f6' : '#6366f1'};
  color: ${props => props.variant === 'secondary' ? '#374151' : 'white'};
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  &:hover:not(:disabled) {
    background: ${props => props.variant === 'secondary' ? '#e5e7eb' : '#4f46e5'};
    transform: translateY(-1px);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const Badge = styled.span`
  background: ${props => props.bg || '#f0f9ff'};
  color: ${props => props.color || '#1e40af'};
  padding: 0.3rem 0.8rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  margin-right: 0.4rem;
`;

const LoadingSkeleton = styled.div`
  background: linear-gradient(90deg, #f3f4f6 25%, #e0e7ff 50%, #f3f4f6 75%);
  background-size: 200% 100%;
  animation: skeleton 1.2s infinite linear;
  border-radius: 1rem;
  height: 180px;
  margin-bottom: 1.5rem;
  @keyframes skeleton {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #6b7280;
`;

const LogoBarContainer = styled.div`
  display: flex;
  align-items: center;
  overflow-x: auto;
  gap: 1.2rem;
  background: #f3f4f6;
  border-radius: 1rem;
  padding: 1rem 0.5rem 1rem 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 12px rgba(99,102,241,0.06);
  scrollbar-width: thin;
`;
const LogoButton = styled.button`
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  min-width: 60px;
  opacity: ${props => props.active ? 1 : 0.6};
  transition: opacity 0.2s;
  &:hover, &:focus {
    opacity: 1;
  }
`;
const LogoImg = styled.img`
  width: 38px;
  height: 38px;
  border-radius: 0.7rem;
  background: #fff;
  object-fit: contain;
  border: 1px solid #e5e7eb;
`;
const LogoLabel = styled.span`
  font-size: 0.85rem;
  color: #3730a3;
  font-weight: 600;
  margin-top: 0.2rem;
`;

// Multi-select dropdown (simple custom)
const MultiSelect = ({ options, selected, onChange, placeholder }) => (
  <div style={{ position: 'relative', marginBottom: '0.5rem' }}>
    <select
      multiple
      value={selected}
      onChange={e => {
        const vals = Array.from(e.target.selectedOptions).map(o => o.value);
        onChange(vals);
      }}
      style={{ width: '100%', padding: '0.7rem', border: '2px solid #e5e7eb', borderRadius: '0.5rem', fontSize: '1rem', background: 'white', minHeight: 80 }}
      aria-label={placeholder}
    >
      {options.map(opt => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
    <div style={{ fontSize: '0.9rem', color: '#6366f1', marginTop: 2 }}>{placeholder}</div>
  </div>
);

const JobListings = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [search, setSearch] = useState('');
  const [companies, setCompanies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedExperiences, setSelectedExperiences] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [savedJobs, setSavedJobs] = useState(() => JSON.parse(localStorage.getItem('saved_jobs') || '[]'));
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const logoBarRef = useRef();

  useEffect(() => {
    loadJobs();
  }, [filters, search, selectedCompanies, selectedCategories, selectedExperiences, selectedTags, page]);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const params = { ...filters, page, page_size: 30 };
      if (search) params.search = search;
      if (selectedCompanies.length) params.company = selectedCompanies.join(',');
      if (selectedCategories.length) params.category = selectedCategories.join(',');
      if (selectedExperiences.length) params.experience = selectedExperiences.join(',');
      if (selectedTags.length) params.tags = selectedTags.join(',');
      const response = await getAllCompanyJobs(params);
      setJobs(page === 1 ? (response.jobs || []) : prev => [...prev, ...(response.jobs || [])]);
      setHasMore((response.jobs || []).length === 30);
      // Extract unique companies, categories, experiences, tags
      const all = response.jobs || [];
      setCompanies([...new Set(all.map(j => j.company))].filter(Boolean));
      setCategories([...new Set(all.map(j => j.category))].filter(Boolean));
      setExperiences([...new Set(all.map(j => j.experience_level))].filter(Boolean));
      setTags([...new Set(all.flatMap(j => j.requirements || []))].filter(Boolean));
    } catch (e) {
      setJobs([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  // Save/favorite job
  const toggleSaveJob = (jobId) => {
    setSavedJobs(prev => {
      const updated = prev.includes(jobId) ? prev.filter(id => id !== jobId) : [...prev, jobId];
      localStorage.setItem('saved_jobs', JSON.stringify(updated));
      return updated;
    });
  };

  // Clear all filters
  const clearAllFilters = () => {
    setFilters({});
    setSearch('');
    setSelectedCompanies([]);
    setSelectedCategories([]);
    setSelectedExperiences([]);
    setSelectedTags([]);
    setPage(1);
  };

  // Infinite scroll
  const handleScroll = (e) => {
    if (!hasMore || loading) return;
    const { scrollTop, scrollHeight, clientHeight } = e.target.scrollingElement || document.documentElement;
    if (scrollHeight - scrollTop - clientHeight < 200) {
      setPage(p => p + 1);
    }
  };
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, loading]);

  // Logo bar scroll
  const scrollLogoBar = (dir) => {
    if (logoBarRef.current) {
      logoBarRef.current.scrollBy({ left: dir * 120, behavior: 'smooth' });
    }
  };

  // UI
  return (
    <Container style={{ background: 'linear-gradient(120deg, #f8fafc 0%, #e0e7ff 100%)', fontFamily: 'Inter, Nunito, sans-serif' }}>
      <Header>
        <Title>Job Opportunities</Title>
        <Subtitle>Discover and apply to jobs from the world’s top companies. Powered by real-time scraping, with direct links and full company credit.</Subtitle>
      </Header>
      {/* Horizontal logo bar */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
        <button aria-label="Scroll left" onClick={() => scrollLogoBar(-1)} style={{ background: 'none', border: 'none', fontSize: 24, color: '#6366f1', cursor: 'pointer' }}><FiChevronLeft /></button>
        <LogoBarContainer ref={logoBarRef} tabIndex={0} aria-label="Company logo filter bar">
          {companies.map(c => (
            <LogoButton key={c} active={selectedCompanies.includes(c)} onClick={() => setSelectedCompanies(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])} aria-label={`Filter by ${c}`}>
              <LogoImg src={`https://logo.clearbit.com/${c.replace(/\s/g, '').toLowerCase()}.com`} alt={c} />
              <LogoLabel>{c}</LogoLabel>
            </LogoButton>
          ))}
        </LogoBarContainer>
        <button aria-label="Scroll right" onClick={() => scrollLogoBar(1)} style={{ background: 'none', border: 'none', fontSize: 24, color: '#6366f1', cursor: 'pointer' }}><FiChevronRight /></button>
      </div>
      <MainGrid>
        <FilterSidebar>
          <FilterTitle><FiFilter /> Filters</FilterTitle>
          <SearchBar>
            <FiSearch style={{ color: '#6366f1', marginRight: 8 }} />
            <SearchInput
              placeholder="Search job title, description..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label="Search jobs"
            />
          </SearchBar>
          <MultiSelect options={companies} selected={selectedCompanies} onChange={setSelectedCompanies} placeholder="Companies" />
          <MultiSelect options={categories} selected={selectedCategories} onChange={setSelectedCategories} placeholder="Categories" />
          <MultiSelect options={experiences} selected={selectedExperiences} onChange={setSelectedExperiences} placeholder="Experience Levels" />
          <MultiSelect options={tags} selected={selectedTags} onChange={setSelectedTags} placeholder="Skills/Tags" />
          <Button onClick={clearAllFilters} style={{ width: '100%', marginTop: 12, background: '#e0e7ff', color: '#3730a3', fontWeight: 700 }}>Clear All Filters</Button>
        </FilterSidebar>
        <div style={{ flex: 1 }}>
          {loading ? (
            <>
              {[...Array(6)].map((_, i) => <LoadingSkeleton key={i} />)}
            </>
          ) : jobs.length === 0 ? (
            <EmptyState>
              <FiBriefcase size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
              <h3>No jobs found</h3>
              <p>Try adjusting your filters or check back later for new opportunities.</p>
            </EmptyState>
          ) : (
            <JobGrid>
              {jobs.map((job, index) => {
                const isSaved = savedJobs.includes(job.id);
                const isNew = job.posted_date && (Date.now() - new Date(job.posted_date).getTime() < 1000*60*60*24*7);
                const isFeatured = job.salary_range && job.salary_range.toLowerCase().includes('top');
                const isHot = job.description && job.description.toLowerCase().includes('urgent');
                return (
                  <JobCard
                    key={job.id + index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    tabIndex={0}
                    aria-label={`Job: ${job.title} at ${job.company}`}
                  >
                    <JobHeader>
                      <CompanyLogo src={job.company_logo} alt={job.company} onError={e => e.target.style.display='none'} />
                      <div style={{ flex: 1 }}>
                        <JobTitle>{job.title}</JobTitle>
                        <CompanyCredit>
                          <FiGlobe /> {job.company_credit}
                        </CompanyCredit>
                      </div>
                      <Button variant="secondary" aria-label={isSaved ? 'Unsave job' : 'Save job'} onClick={() => toggleSaveJob(job.id)} style={{ background: 'none', color: isSaved ? '#f43f5e' : '#6366f1', fontSize: 22, boxShadow: 'none', border: 'none', marginLeft: 8 }}>
                        <FiHeart fill={isSaved ? '#f43f5e' : 'none'} />
                      </Button>
                    </JobHeader>
                    <JobMeta>
                      <MetaItem><FiHome /> {job.company}</MetaItem>
                      <MetaItem><FiMapPin /> {job.location}</MetaItem>
                      {job.salary_range && job.salary_range !== "Not specified" && (
                        <MetaItem><FiDollarSign /> {job.salary_range}</MetaItem>
                      )}
                      {job.posted_date && (
                        <MetaItem><FiCalendar /> {job.posted_date}</MetaItem>
                      )}
                    </JobMeta>
                    <JobDescription>{job.description}</JobDescription>
                    {job.requirements && job.requirements.length > 0 && (
                      <RequirementsList>
                        {job.requirements.slice(0, 3).map((req, idx) => (
                          <RequirementItem key={idx}><FiTag style={{ marginRight: 4 }} />{req}</RequirementItem>
                        ))}
                        {job.requirements.length > 3 && (
                          <RequirementItem>+{job.requirements.length - 3} more requirements</RequirementItem>
                        )}
                      </RequirementsList>
                    )}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                      {isFeatured && <Badge bg="#fef9c3" color="#eab308"><FiStar /> Featured</Badge>}
                      {isHot && <Badge bg="#fee2e2" color="#b91c1c"><FiZap /> Hot</Badge>}
                      {isNew && <Badge bg="#dbeafe" color="#2563eb">New</Badge>}
                      {job.government_job && (
                        <Badge bg="#fef3c7" color="#92400e"><FiAward /> Government</Badge>
                      )}
                      {job.remote_friendly && (
                        <Badge bg="#dcfce7" color="#166534"><FiCheckCircle /> Remote</Badge>
                      )}
                      {job.category && (
                        <Badge>{job.category}</Badge>
                      )}
                    </div>
                    <ButtonGroup>
                      <Button as="a" href={job.source_url || job.apply_url || '#'} target="_blank" rel="noopener noreferrer">
                        <FiBriefcase /> Apply Now
                      </Button>
                      {job.source_url && (
                        <Button variant="secondary" as="a" href={job.source_url} target="_blank" rel="noopener noreferrer">
                          <FiExternalLink /> View Source
                        </Button>
                      )}
                    </ButtonGroup>
                  </JobCard>
                );
              })}
            </JobGrid>
          )}
        </div>
      </MainGrid>
    </Container>
  );
};

export default JobListings; 