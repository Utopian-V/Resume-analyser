/**
 * API Integration Layer
 * 
 * This module provides a centralized interface for all backend API calls.
 * It handles authentication, error handling, caching, and data transformation
 * between the frontend and backend services.
 * 
 * Configuration:
 * - Set REACT_API_URL in your .env file to your backend's public URL
 * - Uses axios for HTTP requests with automatic error handling
 * - Implements caching for frequently accessed data
 * - Provides consistent error handling across all API calls
 */
import axios from "axios";

// API base URL from environment variables
// Falls back to localhost for development if not set
const API_URL = process.env.REACT_API_URL;

/**
 * Resume Analysis API
 * Handles resume upload and analysis functionality
 */

/**
 * Upload and analyze a resume file
 * 
 * @param {File} file - The resume file to upload (PDF, DOCX, TXT)
 * @returns {Promise<Object>} Analysis results with skills, recommendations, and score
 * @throws {Error} If upload or analysis fails
 */
export const uploadResume = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    
    // Let axios set the Content-Type header automatically for FormData
    const response = await axios.post(`${API_URL}/api/resume/analyze`, formData);
    return response.data;
  } catch (error) {
    console.error('Resume upload failed:', error);
    throw new Error('Failed to analyze resume. Please try again.');
  }
};

/**
 * User Management API
 * Handles user registration, profiles, and progress tracking
 */

/**
 * Register a new user in the system
 * 
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} Registration confirmation
 */
export const registerFirebaseUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/api/users/register`, userData);
    return response.data;
  } catch (error) {
    console.error('User registration failed:', error);
    throw new Error('Failed to register user. Please try again.');
  }
};

/**
 * Get user profile information
 * 
 * @param {string} userId - Unique user identifier
 * @returns {Promise<Object>} User profile data
 */
export const getUserProfile = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/api/users/${userId}/profile`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    throw new Error('Failed to load user profile.');
  }
};

/**
 * Get user progress and statistics
 * 
 * @param {string} userId - Unique user identifier
 * @returns {Promise<Object>} User progress data
 */
export const getUserProgress = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/api/users/progress`, { 
      params: { user_id: userId } 
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user progress:', error);
    throw new Error('Failed to load user progress.');
  }
};

/**
 * Update user's resume analysis score
 * 
 * @param {string} userId - Unique user identifier
 * @param {number} score - Resume analysis score (0-100)
 * @returns {Promise<Object>} Update confirmation
 */
export const updateResumeScore = async (userId, score) => {
  try {
    const response = await axios.post(`${API_URL}/api/users/progress/resume-score`, { 
      user_id: userId, 
      score 
    });
    return response.data;
  } catch (error) {
    console.error('Failed to update resume score:', error);
    throw new Error('Failed to update resume score.');
  }
};

/**
 * Job Management API
 * Handles job listings, applications, and recommendations
 */

/**
 * Get job corpus for search and recommendations
 * 
 * @returns {Promise<Object>} Complete job database
 */
export const getJobsCorpus = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/jobs/corpus`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch jobs corpus:', error);
    throw new Error('Failed to load job listings.');
  }
};

/**
 * Apply for a specific job
 * 
 * @param {string} jobId - Unique job identifier
 * @param {string} userId - Unique user identifier
 * @returns {Promise<Object>} Application confirmation
 */
export const applyForJob = async (jobId, userId) => {
  try {
    const response = await axios.post(`${API_URL}/api/jobs/${jobId}/apply`, { 
      user_id: userId 
    });
    return response.data;
  } catch (error) {
    console.error('Job application failed:', error);
    throw new Error('Failed to apply for job. Please try again.');
  }
};

/**
 * DSA Practice API
 * Handles DSA questions, progress tracking, and recommendations
 */

/**
 * Get DSA questions with optional filtering
 * 
 * @param {string} userId - Optional user ID for personalized questions
 * @param {string} difficulty - Optional difficulty filter (easy, medium, hard)
 * @param {string} category - Optional category filter (arrays, strings, etc.)
 * @returns {Promise<Object>} Filtered DSA questions
 */
export const getDSAQuestions = async (userId = null, difficulty = null, category = null) => {
  try {
    const params = {};
    if (userId) params.user_id = userId;
    if (difficulty) params.difficulty = difficulty;
    if (category) params.category = category;
    
    const response = await axios.get(`${API_URL}/api/dsa/questions`, { params });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch DSA questions:', error);
    throw new Error('Failed to load DSA questions.');
  }
};

/**
 * Mark a DSA question as completed
 * 
 * @param {string} questionId - Unique question identifier
 * @param {string} userId - Unique user identifier
 * @returns {Promise<Object>} Completion confirmation
 */
export const completeQuestion = async (questionId, userId) => {
  try {
    const response = await axios.post(`${API_URL}/api/dsa/questions/${questionId}/complete`, { 
      user_id: userId 
    });
    return response.data;
  } catch (error) {
    console.error('Failed to complete question:', error);
    throw new Error('Failed to mark question as completed.');
  }
};

/**
 * Get personalized DSA recommendations
 * 
 * @param {string} userId - Unique user identifier
 * @returns {Promise<Object>} Recommended DSA questions
 */
export const getDSARecommendations = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/api/dsa/recommendations`, { 
      params: { user_id: userId } 
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch DSA recommendations:', error);
    throw new Error('Failed to load recommendations.');
  }
};

/**
 * Interview Preparation API
 * Handles AI-powered interview practice sessions
 */

/**
 * Send a message in an interview practice session
 * 
 * @param {string} userId - Unique user identifier
 * @param {string} role - Interview role (technical, behavioral, hr)
 * @param {string} message - User's message
 * @param {string} conversationId - Optional conversation ID for continuity
 * @returns {Promise<Object>} AI response and conversation data
 */
export const sendInterviewMessage = async (userId, role, message, conversationId = null) => {
  try {
    const response = await axios.post(`${API_URL}/api/interview/chat`, {
      user_id: userId,
      role: role,
      message: message,
      conversation_id: conversationId
    });
    return response.data;
  } catch (error) {
    console.error('Interview message failed:', error);
    throw new Error('Failed to send message. Please try again.');
  }
};

/**
 * Aptitude Test API
 * Handles aptitude test management with caching for performance
 */

// Simple in-memory cache for aptitude test data
// In production, consider using Redis or similar for distributed caching
let aptitudeTestCache = null;
let aptitudeTestCacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache duration

/**
 * Get aptitude test questions with caching
 * 
 * @param {string} testId - Unique test identifier
 * @returns {Promise<Object>} Test questions and metadata
 */
export const getAptitudeTest = async (testId) => {
  try {
    // Check cache first for performance optimization
    const now = Date.now();
    if (aptitudeTestCache && (now - aptitudeTestCacheTime) < CACHE_DURATION) {
      return aptitudeTestCache;
    }
    
    const response = await axios.get(`${API_URL}/api/aptitude/test/${testId}`);
    
    // Update cache with new data
    aptitudeTestCache = response.data;
    aptitudeTestCacheTime = now;
    
    return response.data;
  } catch (error) {
    console.error('Error fetching aptitude test:', error);
    throw new Error('Failed to load aptitude test.');
  }
};

/**
 * Submit aptitude test answers and get results
 * 
 * @param {string} testId - Unique test identifier
 * @param {Object} answers - User's answers to test questions
 * @param {string} userId - Unique user identifier
 * @returns {Promise<Object>} Test results and score
 */
export const submitAptitudeTest = async (testId, answers, userId) => {
  try {
    const response = await axios.post(`${API_URL}/api/aptitude/test/${testId}/submit`, {
      answers,
      user_id: userId
    });
    return response.data;
  } catch (error) {
    console.error('Error submitting aptitude test:', error);
    throw new Error('Failed to submit test. Please try again.');
  }
};

/**
 * Add a new aptitude test question (admin function)
 * 
 * @param {Object} question - Question data
 * @param {string} testId - Target test identifier
 * @returns {Promise<Object>} Creation confirmation
 */
export const addAptitudeQuestion = async (question, testId = 'test1') => {
  try {
    const response = await axios.post(`${API_URL}/api/aptitude/questions/add?test_id=${testId}`, question);
    
    // Invalidate cache when new question is added to ensure fresh data
    aptitudeTestCache = null;
    aptitudeTestCacheTime = 0;
    
    return response.data;
  } catch (error) {
    console.error('Error adding aptitude question:', error);
    throw new Error('Failed to add question. Please try again.');
  }
};

/**
 * Get aptitude test leaderboard
 * 
 * @param {string} testId - Unique test identifier
 * @returns {Promise<Object>} Leaderboard data
 */
export const getAptitudeLeaderboard = async (testId = 'test1') => {
  try {
    const response = await axios.get(`${API_URL}/api/aptitude/leaderboard/${testId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching aptitude leaderboard:', error);
    throw new Error('Failed to load leaderboard.');
  }
};