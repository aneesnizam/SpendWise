import { useEffect, useRef, useState } from "react";
import { toast, Bounce } from "react-toastify";
import "./inbox.css";
import userlogindata from "../../utilities/Authstore";
import api from "../../utilities/axios";
import notificationSound from "../../audio/notify.mp3";

const Inbox = () => {
  const [showInbox, setShowInbox] = useState(false);
  const [loading, setLoading] = useState(false);
  const [prevInboxCount, setPrevInboxCount] = useState(0);
  const [sharedExpenses, setSharedExpenses] = useState([]);
  const [audioReady, setAudioReady] = useState(false);

  const inboxRef = useRef();
  const audioRef = useRef(null);
  const { inbox, setInbox, pendingRequests, setCurrentView } = userlogindata();

  // Fetch shared expenses
  const fetchSharedExpenses = async () => {
    try {
      const res = await api.get("api/expenses/shared");
      const filtered = res.data.shared.filter((item) =>
        item.sharedWith.some((user) => user.paid === false)
      );
      setSharedExpenses(filtered);
    } catch {
      toast.error("Failed to load shared expenses");
    }
  };

  // Load audio
  useEffect(() => {
    fetchSharedExpenses();

    const audio = new Audio(notificationSound);
    audioRef.current = audio;

    const handleCanPlay = () => {
      setAudioReady(true);
      audio.removeEventListener("canplay", handleCanPlay);
    };

    audio.addEventListener("canplay", handleCanPlay);
    audio.load();

    return () => audio.removeEventListener("canplay", handleCanPlay);
  }, []);

  // Initial inbox load
  useEffect(() => {
    const checkInbox = async () => await setInbox();
    checkInbox();
  }, [setInbox]);

  // Poll inbox every 10s
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await api.get("/api/friend/inbox/get");
        const newInbox = res.data.inbox;

        if (newInbox.length > prevInboxCount) {
          setInbox({ inbox: newInbox });

          if (audioReady) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch((e) => console.log("Play prevented:", e));
            toast.info("You have a mail");
          }
        }

        setPrevInboxCount(newInbox.length);
      } catch (err) {
        console.error("Polling inbox failed:", err.message);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [audioReady, prevInboxCount, setInbox]);

  const acceptRequest = async (expense) => {
    try {
      setLoading(true);
      const res = await api.post(`api/expenses/accept/${expense.id}`, {
        friend: expense.friend,
        amount: expense.amount,
      });

      if (res.data.success) {
        toast.success("Payment accepted successfully!");
        setInbox();
      } else {
        toast.error(res.data.message || "Failed to accept payment");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const rejectRequest = async (expenseId) => {
    try {
      setLoading(true);
      const res = await api.post(`api/expenses/reject/${expenseId}`);
      if (res.data.success) {
        toast.success(res.data.message);
        setInbox();
      } else {
        toast.error(res.data.message || "Failed to reject payment");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleOutsideClick = (e) => {
    if (inboxRef.current && !inboxRef.current.contains(e.target)) {
      setShowInbox(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  const handlePendingRequestClick = (type) => {
    setCurrentView(type);
    setShowInbox(false);
  };

  return (
    <div className="inbox-icon" ref={inboxRef}>
      <span
        className="material-symbols-outlined mail"
        style={{ fontSize: "20px" }}
        onClick={() => setShowInbox((prev) => !prev)}
      >
        mail
      </span>

      {(inbox?.length > 0 || pendingRequests?.length > 0 || sharedExpenses?.length > 0) && (
        <span className="dot"></span>
      )}

      {showInbox && (
        <div className="payment-requests">
          {sharedExpenses.length > 0 && (
            <h6 className="pendingReq" onClick={() => handlePendingRequestClick("shared")}>
              You have {sharedExpenses.length} pending payment
            </h6>
          )}
          {pendingRequests?.length > 0 && (
            <h6 className="pendingReq" onClick={() => handlePendingRequestClick("friends")}>
              You have a pending friend request
            </h6>
          )}

          {inbox?.length > 0 ? (
            inbox.map((item) => (
              <div className="payment-list" key={item._id}>
                <p>{`Did ${item.name} pay you ₹${item.amount}?`}</p>
                <div className="btns">
                  <button onClick={() => acceptRequest(item)} disabled={loading} className="yes">
                    <span className="material-symbols-outlined">check_circle</span>
                  </button>
                  <button onClick={() => rejectRequest(item.id)} disabled={loading} className="no">
                    <span className="material-symbols-outlined">cancel</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            pendingRequests.length === 0 &&
            sharedExpenses.length === 0 && <p>No pending notifications</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Inbox;
