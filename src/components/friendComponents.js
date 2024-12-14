import React, { useState, useEffect } from 'react';
import { friendService } from '../services/friendService'; 
function FriendsComponent() {
  // State variables
  const [friendUsername, setFriendUsername] = useState('');
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

 
  const currentUserId = ''; 

  // Fetch friends and pending requests
  useEffect(() => {
    const fetchFriendsAndRequests = async () => {
      if (!currentUserId) return;

      setLoading(true);
      try {
        const friendList = await friendService.getFriendList(currentUserId);
        const pendingRequestsList = await friendService.getPendingRequests(currentUserId);

        setFriends(friendList);
        setPendingRequests(pendingRequestsList);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFriendsAndRequests();
  }, [currentUserId]);

  // Send friend request handler
  const handleSendFriendRequest = async (e) => {
    e.preventDefault();
    if (!currentUserId) {
      setError('Please log in to send a friend request');
      return;
    }

    setLoading(true);
    try {
      await friendService.sendFriendRequest(currentUserId, friendUsername);
      setFriendUsername('');
      setError(null);
   
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Accept friend request
  const handleAcceptRequest = async (requestId) => {
    if (!currentUserId) return;

    setLoading(true);
    try {
      await friendService.acceptFriendRequest(currentUserId, requestId);
      
      // Refresh friends and pending requests
      const updatedFriendList = await friendService.getFriendList(currentUserId);
      const updatedPendingRequests = await friendService.getPendingRequests(currentUserId);

      setFriends(updatedFriendList);
      setPendingRequests(updatedPendingRequests);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Reject friend request
  const handleRejectRequest = async (requestId) => {
    if (!currentUserId) return;

    setLoading(true);
    try {
      await friendService.rejectFriendRequest(currentUserId, requestId);
      
      // Remove the rejected request from pending requests
      const updatedPendingRequests = pendingRequests.filter(req => req._id !== requestId);
      setPendingRequests(updatedPendingRequests);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="friends-container">
      <h2>Friends</h2>

      {/* Send Friend Request Form */}
      <form onSubmit={handleSendFriendRequest}>
        <input
          type="text"
          value={friendUsername}
          onChange={(e) => setFriendUsername(e.target.value)}
          placeholder="Enter username to add friend"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send Friend Request'}
        </button>
      </form>

      {/* Error Display */}
      {error && <div className="error-message">{error}</div>}

      {/* Pending Friend Requests */}
      <div className="pending-requests">
        <h3>Pending Requests</h3>
        {pendingRequests.length === 0 ? (
          <p>No pending friend requests</p>
        ) : (
          <ul>
            {pendingRequests.map(request => (
              <li key={request._id}>
                {request.user.username}
                <button 
                  onClick={() => handleAcceptRequest(request._id)}
                  disabled={loading}
                >
                  Accept
                </button>
                <button 
                  onClick={() => handleRejectRequest(request._id)}
                  disabled={loading}
                >
                  Reject
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Friends List */}
      <div className="friends-list">
        <h3>Your Friends</h3>
        {friends.length === 0 ? (
          <p>No friends yet</p>
        ) : (
          <ul>
            {friends.map(friend => (
              <li key={friend.friendshipId}>
                {friend.username}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default FriendsComponent;