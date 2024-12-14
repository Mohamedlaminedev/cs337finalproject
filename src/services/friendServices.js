import axios from 'axios';

// Replace with your actual backend URL
const BASE_URL = 'http://localhost:5000/api/friends';

export const friendService = {
  // Send a friend request
  sendFriendRequest: async (userId, friendUsername) => {
    try {
      const response = await axios.post(`${BASE_URL}/request`, { 
        userId, 
        friendUsername 
      });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Failed to send friend request');
    }
  },

  // Accept a friend request
  acceptFriendRequest: async (userId, requestId) => {
    try {
      const response = await axios.post(`${BASE_URL}/accept`, { 
        userId, 
        requestId 
      });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Failed to accept friend request');
    }
  },

  // Reject a friend request
  rejectFriendRequest: async (userId, requestId) => {
    try {
      const response = await axios.post(`${BASE_URL}/reject`, { 
        userId, 
        requestId 
      });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Failed to reject friend request');
    }
  },

  // Get friend list
  getFriendList: async (userId) => {
    try {
      const response = await axios.get(`${BASE_URL}/list/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Failed to fetch friend list');
    }
  },

  // Get pending friend requests
  getPendingRequests: async (userId) => {
    try {
      const response = await axios.get(`${BASE_URL}/pending/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Failed to fetch pending requests');
    }
  },

  // Check friendship status
  checkFriendship: async (userId, otherUserId) => {
    try {
      const response = await axios.get(`${BASE_URL}/check/${userId}/${otherUserId}`);
      return response.data.areFriends;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Failed to check friendship status');
    }
  }
};