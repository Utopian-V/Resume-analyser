// Set REACT_APP_API_URL in your .env file to your backend's public URL (e.g., from Render) for deployment.
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await axios.post(`${API_URL}/analyze-resume/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}; 