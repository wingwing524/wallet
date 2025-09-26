import React, { useState, useEffect } from 'react';
import authService from '../services/authService';

const Friends = () => {
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFindModal, setShowFindModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('friends'); // 'friends' or 'requests'

  useEffect(() => {
    loadFriends();
    loadPendingRequests();
  }, []);

  const loadFriends = async () => {
    try {
      setLoading(true);
      const friendsResponse = await authService.getFriends();
      
      if (friendsResponse.success) {
        const friendsWithStats = await Promise.all(
          friendsResponse.friends.map(async (friend) => {
            try {
              const statsResponse = await authService.getFriendStats(friend.id);
              if (statsResponse.success) {
                const stats = statsResponse.stats;
                // Calculate current month spending from monthly data
                const currentMonthSpending = stats.monthlyData && stats.monthlyData.length > 0 
                  ? stats.monthlyData[0].total || 0 
                  : 0;
                
                return { 
                  ...friend, 
                  stats: { 
                    totalSpent: stats.totalAmount || 0,
                    monthlySpent: currentMonthSpending
                  }
                };
              } else {
                return { ...friend, stats: { totalSpent: 0, monthlySpent: 0 } };
              }
            } catch (err) {
              return { ...friend, stats: { totalSpent: 0, monthlySpent: 0 } };
            }
          })
        );
        setFriends(friendsWithStats);
      } else {
        setError(friendsResponse.error || 'Failed to load friends');
      }
    } catch (err) {
      setError('Failed to load friends');
    } finally {
      setLoading(false);
    }
  };

  const loadPendingRequests = async () => {
    try {
      const response = await authService.getPendingRequests();
      if (response.success) {
        setPendingRequests(response.requests || []);
      }
    } catch (err) {
      console.error('Failed to load pending requests:', err);
    }
  };

  const respondToRequest = async (requestId, action) => {
    try {
      const response = await authService.respondToFriendRequest(requestId, action);
      if (response.success) {
        // Refresh both lists
        loadPendingRequests();
        loadFriends();
        const { showSuccess } = require('./ToastProvider');
        if (action === 'accept') {
          showSuccess && showSuccess('Friend request accepted!');
        }
      }
    } catch (err) {
      console.error('Failed to respond to request:', err);
    }
  };

  const searchUsers = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setSearchLoading(true);
      const response = await authService.searchUsers(query);
      if (response.success) {
        setSearchResults(response.users || []);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const sendFriendRequest = async (userId) => {
    try {
      const response = await authService.sendFriendRequest(userId);
      if (response.success) {
        // Update search results to show request sent
        setSearchResults(prev => 
          prev.map(user => 
            user.id === userId 
              ? { ...user, requestSent: true }
              : user
          )
        );
      }
    } catch (err) {
      console.error('Failed to send friend request:', err);
    }
  };

  const openFindModal = () => {
    setShowFindModal(true);
    setSearchQuery('');
    setSearchResults([]);
  };

  const closeFindModal = () => {
    setShowFindModal(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  if (loading) {
    return (
      <div className="friends-container">
        <div className="loading-spinner"></div>
        <p>Loading friends...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="friends-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="friends-container">
      <div className="friends-header">
        <h2>Friends</h2>
        <button className="primary-button" onClick={openFindModal}>Find Friends</button>
      </div>

      <div className="friends-tabs">
        <button 
          className={`tab-button ${activeTab === 'friends' ? 'active' : ''}`}
          onClick={() => setActiveTab('friends')}
        >
          Friends ({friends.length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          Requests ({pendingRequests.length})
        </button>
      </div>

      {activeTab === 'friends' ? (
        friends.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h3>No Friends Yet</h3>
            <p>Add friends to compare spending and motivate each other!</p>
            <button className="primary-button" onClick={openFindModal}>Find Friends</button>
          </div>
        ) : (
          <div className="friends-list">
            {friends.map((friend) => (
              <div key={friend.id} className="friend-card">
                <div className="friend-info">
                  <div className="friend-avatar">
                    {(friend.display_name || friend.username || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div className="friend-details">
                    <h3>{friend.display_name || friend.username || 'Unknown User'}</h3>
                    <p>@{friend.username || 'unknown'}</p>
                  </div>
                </div>
                
                <div className="friend-stats">
                  <div className="stat-item">
                    <span className="stat-label">This Month</span>
                    <span className="stat-value">
                      ${friend.stats.monthlySpent?.toFixed(2) || '0.00'}
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Total</span>
                    <span className="stat-value">
                      ${friend.stats.totalSpent?.toFixed(2) || '0.00'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="requests-list">
          {pendingRequests.length > 0 ? (
            pendingRequests.map(request => (
              <div key={request.friendship_id} className="request-item">
                <div className="request-info">
                  <div className="request-avatar">
                    {(request.display_name || request.username || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div className="request-details">
                    <h3>{request.display_name || request.username || 'Unknown User'}</h3>
                    <span className="request-date">
                      {new Date(request.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="request-actions">
                  <button
                    className="primary-button btn-sm"
                    onClick={() => respondToRequest(request.friendship_id, 'accept')}
                  >
                    Accept
                  </button>
                  <button
                    className="secondary-button btn-sm"
                    onClick={() => respondToRequest(request.friendship_id, 'reject')}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📬</div>
              <h3>No Pending Requests</h3>
              <p>Friend requests will appear here</p>
            </div>
          )}
        </div>
      )}

      <div className="friends-actions">
        <button className="secondary-button" onClick={loadFriends}>
          🔄 Refresh
        </button>
      </div>

      {/* Find Friends Modal */}
      {showFindModal && (
        <div className="modal-overlay">
          <div className="modal-content find-friends-modal">
            <div className="modal-header">
              <h3>Find Friends</h3>
              <button className="modal-close" onClick={closeFindModal}>✕</button>
            </div>
            <div className="modal-body">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search by username or email..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    searchUsers(e.target.value);
                  }}
                  className="search-input"
                />
                {searchLoading && <div className="search-loading">Searching...</div>}
              </div>
              
              <div className="search-results">
                {searchResults.length > 0 ? (
                  searchResults.map(user => (
                    <div key={user.id} className="search-result-item">
                      <div className="user-info">
                        <div className="user-avatar">
                          {(user.display_name || user.username || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div className="user-details">
                          <div className="user-name">{user.display_name || user.username || 'Unknown User'}</div>
                          <div className="user-username">@{user.username || 'unknown'}</div>
                        </div>
                      </div>
                      <button
                        className={user.requestSent ? "secondary-button disabled" : "primary-button"}
                        onClick={() => !user.requestSent && sendFriendRequest(user.id)}
                        disabled={user.requestSent}
                      >
                        {user.requestSent ? '✓ Sent' : '+ Add'}
                      </button>
                    </div>
                  ))
                ) : searchQuery && !searchLoading ? (
                  <div className="no-results">No users found</div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Friends;
