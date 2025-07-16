import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { FiBriefcase, FiMapPin, FiDollarSign, FiCalendar, FiCheckCircle, FiExternalLink } from "react-icons/fi";
import { getJobs, applyForJob } from "../api";

const Container = styled.div`
  background: linear-gradient(120deg, #f5f7ff 60%, #e0e7ff 100%);
  border-radius: 1.5rem;
  box-shadow: 0 4px 24px rgba(99,102,241,0.10);
  padding: 2rem;
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  color: #3730a3;
  font-size: 1.4rem;
  font-weight: 800;
  margin: 0 0 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const JobCard = styled(motion.div)`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 12px rgba(99,102,241,0.08);
  border-left: 4px solid #6366f1;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(99,102,241,0.15);
  }
  
  &.applied {
    border-left-color: #22c55e;
    background: linear-gradient(90deg, #f0fdf4 0%, #dcfce7 100%);
  }
`;

const JobTitle = styled.h4`
  color: #3730a3;
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const JobCompany = styled.div`
  color: #6366f1;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const JobMeta = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  color: #6366f1;
  font-size: 0.9rem;
  font-weight: 500;
`;

const JobDescription = styled.p`
  color: #4b5563;
  line-height: 1.5;
  margin-bottom: 1rem;
`;

const RequirementsList = styled.div`
  margin-bottom: 1rem;
`;

const RequirementsTitle = styled.div`
  color: #3730a3;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const RequirementTag = styled.span`
  display: inline-block;
  background: #e0e7ff;
  color: #6366f1;
  padding: 0.2rem 0.6rem;
  border-radius: 0.5rem;
  font-size: 0.8rem;
  font-weight: 600;
  margin: 0.2rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.7rem 1.2rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  &.primary {
    background: #6366f1;
    color: white;
    &:hover {
      background: #3730a3;
    }
  }
  
  &.success {
    background: #22c55e;
    color: white;
    &:hover {
      background: #16a34a;
    }
  }
  
  &.secondary {
    background: #e0e7ff;
    color: #6366f1;
    &:hover {
      background: #c7d2fe;
    }
  }
  
  &:disabled {
    background: #e5e7eb;
    color: #9ca3af;
    cursor: not-allowed;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const FilterButton = styled.button`
  padding: 0.5rem 1rem;
  border: 2px solid #6366f1;
  background: ${props => props.active ? '#6366f1' : 'transparent'};
  color: ${props => props.active ? 'white' : '#6366f1'};
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #6366f1;
    color: white;
  }
`;

const RecommendedSection = styled.div`
  margin-bottom: 2rem;
`;

const RecommendedBadge = styled.span`
  background: linear-gradient(90deg, #f59e0b 0%, #f97316 100%);
  color: white;
  padding: 0.2rem 0.6rem;
  border-radius: 0.5rem;
  font-size: 0.8rem;
  font-weight: 600;
  margin-left: 0.5rem;
`;

const JobListings = ({ userId, userSkills = [] }) => {
  const [jobs, setJobs] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadJobs();
  }, [userId]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const response = await getJobs(userId);
      setJobs(response.jobs);
      setRecommendedJobs(response.recommended || []);
      
      // Track applied jobs (in a real app, this would come from the backend)
      const applied = localStorage.getItem(`applied_jobs_${userId}`) || '[]';
      setAppliedJobs(JSON.parse(applied));
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId) => {
    try {
      await applyForJob(jobId, userId);
      
      // Update local state
      const newAppliedJobs = [...appliedJobs, jobId];
      setAppliedJobs(newAppliedJobs);
      localStorage.setItem(`applied_jobs_${userId}`, JSON.stringify(newAppliedJobs));
      
      // Show success message
      alert('Application submitted successfully!');
    } catch (error) {
      console.error('Error applying for job:', error);
      alert('Failed to submit application. Please try again.');
    }
  };

  const isJobApplied = (jobId) => {
    return appliedJobs.includes(jobId);
  };

  const isJobRecommended = (jobId) => {
    return recommendedJobs.some(job => job.id === jobId);
  };

  const filteredJobs = jobs.filter(job => {
    if (filter === 'applied' && !isJobApplied(job.id)) return false;
    if (filter === 'recommended' && !isJobRecommended(job.id)) return false;
    return true;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getDaysUntilDeadline = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return <Container>Loading job listings...</Container>;
  }

  return (
    <Container>
      <SectionTitle>
        <FiBriefcase size={24} />
        Job Opportunities
      </SectionTitle>

      {recommendedJobs.length > 0 && (
        <RecommendedSection>
          <SectionTitle>
            <FiCheckCircle size={20} />
            Recommended for You
          </SectionTitle>
          {recommendedJobs.map((job) => (
            <JobCard
              key={job.id}
              className={isJobApplied(job.id) ? 'applied' : ''}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <JobTitle>
                {job.title}
                <RecommendedBadge>Recommended</RecommendedBadge>
                {isJobApplied(job.id) && <FiCheckCircle color="#22c55e" />}
              </JobTitle>
              <JobCompany>{job.company}</JobCompany>
              <JobMeta>
                <MetaItem>
                  <FiMapPin size={14} />
                  {job.location}
                </MetaItem>
                <MetaItem>
                  <FiDollarSign size={14} />
                  {job.salary_range}
                </MetaItem>
                <MetaItem>
                  <FiCalendar size={14} />
                  Posted: {formatDate(job.posted_date)}
                </MetaItem>
              </JobMeta>
              <JobDescription>{job.description}</JobDescription>
              <RequirementsList>
                <RequirementsTitle>Requirements:</RequirementsTitle>
                {job.requirements.map((req, index) => (
                  <RequirementTag key={index}>{req}</RequirementTag>
                ))}
              </RequirementsList>
              <ActionButtons>
                {!isJobApplied(job.id) ? (
                  <>
                    <Button 
                      className="primary"
                      onClick={() => handleApply(job.id)}
                    >
                      Apply Now
                    </Button>
                    <Button 
                      className="secondary"
                      onClick={() => window.open(`mailto:?subject=Application for ${job.title} at ${job.company}&body=I'm interested in this position.`)}
                    >
                      <FiExternalLink size={14} />
                      Contact
                    </Button>
                  </>
                ) : (
                  <Button className="success" disabled>
                    <FiCheckCircle size={14} />
                    Applied
                  </Button>
                )}
              </ActionButtons>
            </JobCard>
          ))}
        </RecommendedSection>
      )}

      <FilterContainer>
        <FilterButton 
          active={filter === 'all'} 
          onClick={() => setFilter('all')}
        >
          All Jobs
        </FilterButton>
        <FilterButton 
          active={filter === 'recommended'} 
          onClick={() => setFilter('recommended')}
        >
          Recommended
        </FilterButton>
        <FilterButton 
          active={filter === 'applied'} 
          onClick={() => setFilter('applied')}
        >
          Applied
        </FilterButton>
      </FilterContainer>

      {filteredJobs.map((job) => (
        <JobCard
          key={job.id}
          className={isJobApplied(job.id) ? 'applied' : ''}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <JobTitle>
            {job.title}
            {isJobApplied(job.id) && <FiCheckCircle color="#22c55e" />}
          </JobTitle>
          <JobCompany>{job.company}</JobCompany>
          <JobMeta>
            <MetaItem>
              <FiMapPin size={14} />
              {job.location}
            </MetaItem>
            <MetaItem>
              <FiDollarSign size={14} />
              {job.salary_range}
            </MetaItem>
            <MetaItem>
              <FiCalendar size={14} />
              Posted: {formatDate(job.posted_date)}
            </MetaItem>
            <MetaItem>
              <FiCalendar size={14} />
              Deadline: {formatDate(job.application_deadline)} ({getDaysUntilDeadline(job.application_deadline)} days left)
            </MetaItem>
          </JobMeta>
          <JobDescription>{job.description}</JobDescription>
          <RequirementsList>
            <RequirementsTitle>Requirements:</RequirementsTitle>
            {job.requirements.map((req, index) => (
              <RequirementTag key={index}>{req}</RequirementTag>
            ))}
          </RequirementsList>
          <ActionButtons>
            {!isJobApplied(job.id) ? (
              <>
                <Button 
                  className="primary"
                  onClick={() => handleApply(job.id)}
                >
                  Apply Now
                </Button>
                <Button 
                  className="secondary"
                  onClick={() => window.open(`mailto:?subject=Application for ${job.title} at ${job.company}&body=I'm interested in this position.`)}
                >
                  <FiExternalLink size={14} />
                  Contact
                </Button>
              </>
            ) : (
              <Button className="success" disabled>
                <FiCheckCircle size={14} />
                Applied
              </Button>
            )}
          </ActionButtons>
        </JobCard>
      ))}
    </Container>
  );
};

export default JobListings; 