const API_BASE_URL = 'http://localhost:8000';

export const constants = {
  TOKEN: `${API_BASE_URL}/token`,
  ME: `${API_BASE_URL}/common/me`,

  STATS: `${API_BASE_URL}/stats`,
  USERS: `${API_BASE_URL}/users`,
  CARETAKERS: `${API_BASE_URL}/caretakers`,
  DOCTORS: `${API_BASE_URL}/doctors`,
  PATIENTS: `${API_BASE_URL}/patients`,

  ASSOCIATE: `${API_BASE_URL}/associations`,
  DISASSOCIATE: `${API_BASE_URL}/associations/disassociate`,

  RESULTS_PER_PAGE: 7,
};
