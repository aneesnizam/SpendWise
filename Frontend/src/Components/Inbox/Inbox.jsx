import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import './inbox.css'
import userlogindata from "../Authstore";
import api from "../../utilities/axios";

const Inbox = () => {
  const [showInbox, setShowInbox] = useState(false);
  const [load, setLoad] = useState(false);
  const inboxRef = useRef();
  const { inbox, setInbox } = userlogindata();

  const acceptRequest = async (expense) => {
    try {
      setLoad(true);
      const response = await api.post(`api/expenses/accept/${expense.id}`, {
        friend: expense.friend,
        amount: expense.amount,
      });
      if (response.data.success) {
        toast.success("Payment accepted successfully!");
        setInbox();
      } else {
        toast.error(response.data.message || "Failed to accept payment");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
      return false;
    } finally {
      setLoad(false);
    }
  };
  const rejectRequest = async (expenseId) => {
    try {
      setLoad(true);
      const res = await api.post(`api/expenses/reject/${expenseId}`);
      if (res.data.success) {
        toast.success(res.data.message);
        setInbox();
      } else {
        toast.error(res.data.message || "Failed to accept payment");
      }
    } catch (err) {
      toast.error(res?.data?.message || `Something went wrong`);
      return false;
    } finally {
      setLoad(false);
    }
  };

  const clickEvent = (e) => {
    if (inboxRef?.current && !inboxRef.current.contains(e.target)) {
      setShowInbox(false);
    }
  };

  useEffect(() => {
    setInbox();
  }, []);

  useEffect(() => {
    document.addEventListener("click", clickEvent);
    return () => document.removeEventListener("click", clickEvent);
  }, []);
  return (
    <div className="inbox-icon" ref={inboxRef}>
      <span
        onClick={() => setShowInbox(prev => !prev)}
        className="material-symbols-outlined mail"
      >
        mail
      </span>
      {inbox?.length !== 0 && <span className="dot"></span>}
      {showInbox && (
        <div className="payment-requests">
          {inbox?.length !== 0 ? (
            inbox?.map((item) => (
              <div className="payment-list" key={item._id}>
                <p>{`Did ${item.name} paid you ${item.amount}`}</p>
                <div className="btns">
                  <button
                    onClick={() => acceptRequest(item)}
                    disabled={load}
                    className="yes"
                  >
                    <span className="material-symbols-outlined">
                      check_circle
                    </span>
                  </button>
                  <button
                    onClick={() => rejectRequest(item.id)}
                    disabled={load}
                    className="no"
                  >
                    <span className="material-symbols-outlined">cancel</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No Requests</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Inbox;
