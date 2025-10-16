// API Configuration Constants
export const API_BASE_URL = 'http://127.0.0.1:8000';
export const CHAT_ENDPOINT = '/chat';

// Get the appropriate API URL based on environment
export const getApiUrl = () => {
  return import.meta.env.DEV ? '/api' : API_BASE_URL;
};
