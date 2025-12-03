/**
 * API Configuration
 * Centralized API endpoint configuration for the entire application.
 * Update API_BASE_URL here to switch between local development and deployed backend.
 */

// Production: Deployed Render backend
// Local Development: http://localhost:5000
export const API_BASE_URL = "https://youtube-be-0qhc.onrender.com/api";

/**
 * Alternative configuration for local development
 * Uncomment the line below and comment the production URL to use local backend
 */
// export const API_BASE_URL = "http://localhost:5000/api";

export default API_BASE_URL;
