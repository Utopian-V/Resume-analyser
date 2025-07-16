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

// User management
export const registerUser = async (userData) => {
  const response = await axios.post(`${API_URL}/register/`, userData);
  return response.data;
};

export const loginUser = async (email) => {
  const response = await axios.post(`${API_URL}/login/`, { email });
  return response.data;
};

// Job listings
export const getJobs = async (userId = null) => {
  const params = userId ? { user_id: userId } : {};
  const response = await axios.get(`${API_URL}/jobs/`, { params });
  return response.data;
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