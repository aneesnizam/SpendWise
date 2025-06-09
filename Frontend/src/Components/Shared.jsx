import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import userlogindata from "./Authstore";
import api from "../utilities/axios";
import "./Shared.css";

const Shared = () => {
  const [sharedExpenses, setSharedExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [load, setLoad] = useState(false);
  const {user} = userlogindata();

  const fetchSharedExpenses = async () => {
    try {
      const res = await api.get("api/expenses/shared");
      setSharedExpenses(res.data.shared);
    } catch (err) {
      toast.error("Failed to load shared expenses");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkPaid = async (expense) => {
    try {
      setLoad(true);
      await api.post(`api/friend/inbox/send/${expense.user}`,{
          name: user?.name,
          amount: expense.sharedWith[0].amount,
          title: expense.title,
          id: expense._id
      });
      toast.success("Mark as message sent");
      fetchSharedExpenses();
    } catch (err) {
      toast.error("Failed to mark as paid");
    } finally{
        setLoad(false);
    }
  };

  useEffect(() => {
    fetchSharedExpenses();
  }, []);

  return (
    <>
      <div className="shared-expense-container">
        {loading ? (
          <div className="loading-state-s">
            <div className="loading-spinner"></div>
            <p>Loading shared expenses...</p>
          </div>
        ) : sharedExpenses.length === 0 ? (
          <div className="empty-state">
            <p>No shared expenses found</p>
          </div>
        ) : (
          <div className="shared-expense-grid">
            {sharedExpenses.map((expense) => (
              <div key={expense._id} className="shared-expense-card">
                <div className="expense-header-s">
                  <h3 className="expense-title">{expense.title}</h3>
                  <span className={`expense-status ${expense.sharedWith[0].paid ? 'paid' : 'pending'}`}>
                    {expense.sharedWith[0].paid ? 'Paid' : 'Pending'}
                  </span>
                </div>
                
                <div className="expense-details">
                  <div className="detail-row">
                    <span className="detail-label">Amount:</span>
                    <span className="detail-value">₹{expense.sharedWith[0].amount}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Pay to:</span>
                    <span className="detail-value">
                      {expense.createdBy.name} ({expense.createdBy.email})
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">UPI ID:</span>
                    <span className="detail-value upi-id">
                      {expense.createdBy.upiId || 'Not provided'}
                    </span>
                  </div>
                </div>

                {!expense.sharedWith[0].paid && (
                  <div className="expense-actions">
                    {expense.createdBy.upiId && (
                      <a
                        href={`upi://pay?pa=${expense.createdBy.upiId}&am=${expense.sharedWith[0].amount}&tn=${encodeURIComponent(expense.title)}`}
                        className="payment-button upi-pay-button"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Pay via UPI
                      </a>
                    )}
                    <button
                      className="payment-button mark-paid-button"
                      onClick={() => handleMarkPaid(expense)}
                      disabled={load}
                    >
                      Mark as Paid
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Shared;