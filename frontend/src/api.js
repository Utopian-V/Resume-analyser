// Set REACT_APP_API_URL in your .env file to your backend's public URL (e.g., from Render) for deployment.
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  // Let axios set the headers automatically
  const response = await axios.post(`${API_URL}/analyze-resume/`, formData);
  return response.data;
};

// Firebase user management
export const registerFirebaseUser = async (userData) => {
  const response = await axios.post(`${API_URL}/user/register/`, userData);
  return response.data;
};

export const getUserProfile = async (userId) => {
  const response = await axios.get(`${API_URL}/user/${userId}/profile/`);
  return response.data;
};

// Job listings
export const getJobs = async (userId = null) => {
  // Remove or comment out this function if not needed
};

export const applyForJob = async (jobId, userId) => {
  const response = await axios.post(`${API_URL}/jobs/${jobId}/apply/`, { user_id: userId });
  return response.data;
};

// DSA questions
export const getDSAQuestions = async (userId = null, difficulty = null, category = null) => {
  const params = {};
  if (userId) params.user_id = userId;
  if (difficulty) params.difficulty = difficulty;
  if (category) params.category = category;
  
  const response = await axios.get(`${API_URL}/dsa/questions/`, { params });
  return response.data;
};

export const completeQuestion = async (questionId, userId) => {
  const response = await axios.post(`${API_URL}/dsa/questions/${questionId}/complete/`, { user_id: userId });
  return response.data;
};

export const getDSARecommendations = async (userId) => {
  const response = await axios.get(`${API_URL}/dsa/recommendations/`, { params: { user_id: userId } });
  return response.data;
};

// User progress
export const getUserProgress = async (userId) => {
  const response = await axios.get(`${API_URL}/user/progress/`, { params: { user_id: userId } });
  return response.data;
};

export const updateResumeScore = async (userId, score) => {
  const response = await axios.post(`${API_URL}/user/progress/resume-score/`, { user_id: userId, score });
  return response.data;
};

// Interview chat
export const sendInterviewMessage = async (userId, role, message, conversationId = null) => {
  const response = await axios.post(`${API_URL}/interview/chat/`, {
    user_id: userId,
    role: role,
    message: message,
    conversation_id: conversationId
  });
  return response.data;
};

// Aptitude test endpoints
// Simple cache for aptitude test data
let aptitudeTestCache = null;
let aptitudeTestCacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const getAptitudeTest = async (testId) => {
  try {
    // Check cache first
    const now = Date.now();
    if (aptitudeTestCache && (now - aptitudeTestCacheTime) < CACHE_DURATION) {
      return aptitudeTestCache;
    }
    
    const response = await axios.get(`${API_URL}/api/aptitude/test/${testId}`);
    
    // Update cache
    aptitudeTestCache = response.data;
    aptitudeTestCacheTime = now;
    
    return response.data;
  } catch (error) {
    console.error('Error fetching aptitude test:', error);
    throw error;
  }
};

export const submitAptitudeTest = async (testId, answers, userId) => {
  try {
    const response = await axios.post(`${API_URL}/api/aptitude/test/${testId}/submit`, {
      answers,
      user_id: userId
    });
    return response.data;
  } catch (error) {
    console.error('Error submitting aptitude test:', error);
    throw error;
  }
};

export const addAptitudeQuestion = async (question, testId = 'test1') => {
  try {
    const response = await axios.post(`${API_URL}/api/aptitude/questions/add?test_id=${testId}`, question);
    
    // Invalidate cache when new question is added
    aptitudeTestCache = null;
    aptitudeTestCacheTime = 0;
    
    return response.data;
  } catch (error) {
    console.error('Error adding aptitude question:', error);
    throw error;
  }
};

export const getAptitudeLeaderboard = async (testId = 'test1') => {
  try {
    const response = await axios.get(`${API_URL}/api/aptitude/leaderboard/${testId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching aptitude leaderboard:', error);
    throw error;
  }
};

export const getJobsCorpus = async () => {
  const response = await axios.get(`${API_URL}/test`);
  return response.data;
};