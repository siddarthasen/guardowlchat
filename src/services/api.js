import { getApiUrl, CHAT_ENDPOINT } from '../utils/constants.js';

/**
 * Sends a chat message to the backend API with conversation context
 * @param {string} query - The user's message
 * @param {string} conversationId - Unique conversation identifier
 * @returns {Promise<object>} - The API response
 */
export async function sendChatMessage(query, conversationId) {
  const apiUrl = getApiUrl();
  const url = `${apiUrl}${CHAT_ENDPOINT}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30-second timeout

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        conversationId  // Include conversationId in request
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
}
