import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../utilities/axios";
import "./Friends.css";
import userlogindata from "./Authstore";

const FriendRequest = () => {
  const [email, setEmail] = useState("");
  const { friends, fetchFriendsData, pendingRequests } = userlogindata();
  const [isLoading, setIsLoading] = useState(false);

  const sendRequest = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await api.post(`api/friend/${email}`);
      toast.success(res.data.message);
      setEmail("");
      fetchFriendsData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send request");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = async (id) => {
    try {
      setIsLoading(true);
      await api.post(`api/friend/accept/${id}`);
      toast.success("Request accepted");
      fetchFriendsData();
    } catch {
      toast.error("Failed to accept request");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async (id) => {
    try {
      setIsLoading(true);
      await api.post(`api/friend/reject/${id}`);
      toast.info("Request rejected");
      fetchFriendsData();
    } catch {
      toast.error("Failed to reject request");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFriend = async (id) => {
    try {
      setIsLoading(true);
      await api.delete(`api/friend/${id}`);
      toast.success("Friend removed");
      fetchFriendsData();
    } catch {
      toast.error("Failed to remove friend");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFriendsData();
  }, []);

  return (
    <>
      <div className="friend-request-page">

        <form onSubmit={sendRequest} className="request-form">
          <div className="form-group">
            <input
              type="email"
              placeholder="Enter friend's email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Request"}
            </button>
          </div>
        </form>

        <div className="requests-container">
          <div className="pending-section">
            <h3 className="section-title">
              <span>Pending Requests</span>
              {pendingRequests?.length > 0 && (
                <span className="badge">{pendingRequests?.length}</span>
              )}
            </h3>
            {pendingRequests?.length === 0 ? (
              <div className="empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <circle
                    cx="8.5"
                    cy="7"
                    r="4"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M18 8l5 5m0-5l-5 5"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
                <p>No incoming requests</p>
              </div>
            ) : (
              <div className="cards-grid">
                {pendingRequests?.map((user) => (
                  <div key={user._id} className="request-card">
                    <div className="user-info">
                      <div className="avatar-placeholder">
                        {user?.email?.charAt(0).toUpperCase()}
                      </div>
                      <span className="user-email">{user.email}</span>
                    </div>
                    <div className="actions">
                      <button
                        onClick={() => handleAccept(user._id)}
                        className="accept-btn"
                        disabled={isLoading}
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleReject(user._id)}
                        className="reject-btn"
                        disabled={isLoading}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="friend-list">
            <h3 className="section-title">
              <span>Your Friends</span>
              {friends?.length > 0 && (
                <span className="badge">{friends?.length}</span>
              )}
            </h3>
            {friends?.length === 0 ? (
              <div className="empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <circle
                    cx="8.5"
                    cy="7"
                    r="4"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M17 14l2 2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
                <p>No friends yet</p>
              </div>
            ) : (
              <div className="cards-grid">
                {friends?.map((friend) => (
                  <div key={friend._id} className="friend-card">
                    <div className="user-info">
                      <div className="avatar">
                        {friend?.email?.charAt(0).toUpperCase()}
                      </div>
                      <span className="user-email">{friend.email}</span>
                    </div>
                    <button
                      onClick={() => handleRemoveFriend(friend._id)}
                      className="remove-btn"
                      disabled={isLoading}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default FriendRequest;
