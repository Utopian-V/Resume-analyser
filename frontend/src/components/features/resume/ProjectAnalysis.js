import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { FiFolder, FiTrendingUp, FiTarget, FiCheckCircle, FiAlertCircle } from "react-icons/fi";

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

const ProjectCard = styled(motion.div)`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 12px rgba(99,102,241,0.08);
  border-left: 4px solid #6366f1;
`;

const ProjectTitle = styled.h4`
  color: #3730a3;
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ProjectDescription = styled.p`
  color: #6366f1;
  line-height: 1.5;
  margin-bottom: 1rem;
`;

const ImpactScore = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(90deg, #e0e7ff 60%, #c7d2fe 100%);
  border-radius: 0.5rem;
  width: fit-content;
`;

const ScoreCircle = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => {
    if (props.score >= 8) return '#22c55e';
    if (props.score >= 6) return '#f59e0b';
    return '#ef4444';
  }};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1rem;
`;

const AnalysisSection = styled.div`
  margin-bottom: 1.5rem;
`;

const AnalysisTitle = styled.h5`
  color: #3730a3;
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.3rem;
`;

const List = styled.ul`
  margin: 0;
  padding-left: 1.2rem;
  color: #6366f1;
  line-height: 1.4;
`;

const ListItem = styled.li`
  margin-bottom: 0.3rem;
  font-size: 0.95rem;
`;

const StrengthsContainer = styled.div`
  background: linear-gradient(90deg, #f0fdf4 60%, #dcfce7 100%);
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const ImprovementsContainer = styled.div`
  background: linear-gradient(90deg, #fef2f2 60%, #fee2e2 100%);
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const SuggestionsContainer = styled.div`
  background: linear-gradient(90deg, #f0f9ff 60%, #e0f2fe 100%);
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const Tag = styled.span`
  display: inline-block;
  background: #e0e7ff;
  color: #6366f1;
  padding: 0.2rem 0.6rem;
  border-radius: 0.5rem;
  font-size: 0.8rem;
  font-weight: 600;
  margin: 0.2rem;
`;

const NoProjectsMessage = styled.div`
  text-align: center;
  color: #6366f1;
  font-size: 1.1rem;
  padding: 2rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 2px 12px rgba(99,102,241,0.08);
`;

const ProjectAnalysis = ({ projectAnalysis = [] }) => {
  if (!projectAnalysis || projectAnalysis.length === 0) {
    return (
      <Container>
        <SectionTitle>
          <FiFolder size={24} />
          Project Analysis
        </SectionTitle>
        <NoProjectsMessage>
          No projects found in your resume. Add detailed project descriptions to get personalized analysis and improvement suggestions.
        </NoProjectsMessage>
      </Container>
    );
  }

  return (
    <Container>
      <SectionTitle>
        <FiFolder size={24} />
        Project Analysis
      </SectionTitle>
      
      {projectAnalysis.map((project, index) => (
        <ProjectCard
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <ProjectTitle>
            <FiFolder size={20} />
            {project.project_name}
          </ProjectTitle>
          
          <ProjectDescription>{project.description}</ProjectDescription>
          
          <ImpactScore>
            <FiTrendingUp size={16} />
            <span>Impact Score:</span>
            <ScoreCircle score={project.impact_score}>
              {project.impact_score}/10
            </ScoreCircle>
          </ImpactScore>
          
          {project.strengths && project.strengths.length > 0 && (
            <StrengthsContainer>
              <AnalysisTitle>
                <FiCheckCircle size={16} color="#22c55e" />
                Strengths
              </AnalysisTitle>
              <List>
                {project.strengths.map((strength, idx) => (
                  <ListItem key={idx}>{strength}</ListItem>
                ))}
              </List>
            </StrengthsContainer>
          )}
          
          {project.improvements && project.improvements.length > 0 && (
            <ImprovementsContainer>
              <AnalysisTitle>
                <FiAlertCircle size={16} color="#ef4444" />
                Areas for Improvement
              </AnalysisTitle>
              <List>
                {project.improvements.map((improvement, idx) => (
                  <ListItem key={idx}>{improvement}</ListItem>
                ))}
              </List>
            </ImprovementsContainer>
          )}
          
          {project.suggestions && project.suggestions.length > 0 && (
            <SuggestionsContainer>
              <AnalysisTitle>
                <FiTarget size={16} color="#6366f1" />
                Recommendations
              </AnalysisTitle>
              <List>
                {project.suggestions.map((suggestion, idx) => (
                  <ListItem key={idx}>{suggestion}</ListItem>
                ))}
              </List>
            </SuggestionsContainer>
          )}
        </ProjectCard>
      ))}
    </Container>
  );
};

export default ProjectAnalysis; 