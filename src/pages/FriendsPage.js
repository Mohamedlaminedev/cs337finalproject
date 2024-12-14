import React, { useState, useEffect } from 'react';
import '../styles/FriendsPage.css';

function FriendsPage({ 
  userData, 
  onSendRequest, 
  onAcceptRequest, 
  onRejectRequest,
  onRefreshFriends,
  onRefreshPending
}) {
  const [newFriendUsername, setNewFriendUsername] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [friendsList, setFriendsList] = useState([]);

  // Sync with userData changes
  useEffect(() => {
    if (userData) {
      setPendingRequests(userData.pendingFriendRequests || []);
      setFriendsList(userData.friends || []);
    }
  }, [userData]);

  // Initial data fetch - with proper dependencies
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    let mounted = true;

    const fetchInitialData = async () => {
      if (!userData._id) return;
      
      try {
        setIsLoading(true);
        await Promise.all([onRefreshFriends(), onRefreshPending()]);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };
    
    fetchInitialData();

    return () => {
      mounted = false;
    };
  }, [userData._id]);

  const handleSendRequest = async (e) => {
    e.preventDefault();
    if (!newFriendUsername.trim()) {
      setError('Please enter a username');
      return;
    }
    
    setIsLoading(true);
    try {
      await onSendRequest(newFriendUsername);
      setSuccess('Friend request sent successfully!');
      setNewFriendUsername('');
      setError('');
      await onRefreshPending();
    } catch (err) {
      setError(err.message);
      setSuccess('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = async (requestId) => {
    if (!requestId) return;
    
    setIsLoading(true);
    try {
      await onAcceptRequest(requestId);
      await Promise.all([onRefreshFriends(), onRefreshPending()]);
      setSuccess('Friend request accepted!');
      setError('');
    } catch (err) {
      setError(err.message);
      setSuccess('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async (requestId) => {
    if (!requestId) return;

    setIsLoading(true);
    try {
      await onRejectRequest(requestId);
      await onRefreshPending();
      setSuccess('Friend request rejected');
      setError('');
    } catch (err) {
      setError(err.message);
      setSuccess('');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container main-container">
        <div className="friends-box">
          <div className="loading-message">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container main-container">
      <div className="friends-box">
        <h2>Friends</h2>
        
        <div className="add-friend-section">
          <h3>Add Friend</h3>
          <form onSubmit={handleSendRequest} className="add-friend-form">
            <input
              type="text"
              value={newFriendUsername}
              onChange={(e) => setNewFriendUsername(e.target.value)}
              placeholder="Enter friend's username"
              className="friend-input"
              disabled={isLoading}
            />
            <button type="submit" className="submit-button" disabled={isLoading}>
              Send Request
            </button>
          </form>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="requests-section">
          <h3>Pending Friend Requests</h3>
          <div className="requests-list">
            {pendingRequests.length === 0 ? (
              <p className="no-data-message">No pending friend requests</p>
            ) : (
              pendingRequests.map((request) => (
                <div key={request._id} className="request-item">
                  <span className="username">{request.user.username}</span>
                  <div className="button-group">
                    <button 
                      onClick={() => handleAccept(request._id)} 
                      className="accept-button"
                      disabled={isLoading}
                    >
                      Accept
                    </button>
                    <button 
                      onClick={() => handleReject(request._id)} 
                      className="reject-button"
                      disabled={isLoading}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="friends-section">
          <h3>My Friends</h3>
          <div className="friends-list">
            {friendsList.length === 0 ? (
              <p className="no-data-message">No friends added yet</p>
            ) : (
              friendsList.map((friend) => (
                <div key={friend.friendshipId || friend._id} className="friend-item">
                  {friend.username}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FriendsPage;