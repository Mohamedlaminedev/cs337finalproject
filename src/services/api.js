const API_URL = 'http://localhost:5000/api'; // Your Express server's base URL

const api = {
  signup: async (username, initialBalance) => {
    const response = await fetch(`${API_URL}/users/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, initialBalance }),
    });
    return response.json(); // Convert response to JSON
  },

  login: async (username) => {
    const response = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username }),
    });
    return response.json();
  },

  addTransaction: async (userId, transaction) => {
    const response = await fetch(`${API_URL}/transactions/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, transaction }),
    });
    return response.json();
  },
};

export default api;
