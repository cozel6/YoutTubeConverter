/**
 * Wrapper for YouTube conversion requests.
 */

import axios from 'axios';

// Get basic address
const API_BASE_URL = 'http://localhost:5213';
// Axios instance with baseURL set.
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

/**
 * Send a POST to /api/Conversion to convert a YouTube video.
 * @param {Object} params - { youTubeUrl, quality }
 * @returns {Promise<Object>} Obiect cu { success, message, downloadUrl, fileName }.
 */
export async function convertVideo({ youTubeUrl, quality }) {
  try {
    const response = await axiosInstance.post('/api/Conversion', { youTubeUrl, quality });
    return response.data;
  } catch (err) {
    throw err;
  }
}
