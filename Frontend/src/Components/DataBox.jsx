import React, { useEffect, useState } from "react";
import "./dataBox.css";
import api from "../utilities/axios";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";
import userlogindata from "./Authstore";


export default function DataBox() {
  const { user, setUser } = userlogindata();
  const [customCategory, setCustomCategory] = useState("");
  const [categoryCost, setCategoryCost] = useState("");
  const [history, setHistory] = useState([]);
  const [currency, setCurrency] = useState("₹");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [totalCost, setTotalCost] = useState(0);
  const [userLimit, setUserLimit] = useState(user.dailyLimit);

  const exchangeRate = 1 / 85.1;


  const fetchHistory = async () => {
    try {
      const res = await api.get("api/expenses?today=true");
      setHistory(res.data.expenses);
      setTotalCost(res.data.totalAmount);
      setUserLimit(user.dailyLimit - res.data.totalAmount);
    } catch (err) {
      console.error(err.message);
    }
  };

  const getUser = async () => {
    await api.get("api/user").then((res)=>{
      setUser(res.data.user);
    })
  }

  useEffect(()=>{
    getUser();
  },[])

  useEffect(() => {
    fetchHistory();
  }, [categoryCost, user]);

  const toINR = (value) => {
    const num = parseFloat(value);
    return currency === "$" ? num / exchangeRate : num;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryCost.trim()) {
      setError("Fill at least one input");
      return;
    }

    const cost = toINR(categoryCost);

    try {
      const res = await api.post("api/expenses/", {
        title: description,
        amount: cost,
        category: customCategory || "other",
      });
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err.message);
    }

    setCustomCategory("");
    setCategoryCost("");
    setDescription("");
    // setUserLimit((prev) => prev - cost);
    setError("");
  };

  const handleDelete = async (id) => {
    try {
      const res = await api.delete(`api/expenses/${id}`);
      if (res.data.success) {
        toast.success(res.data.message);
        setHistory((prev) => prev.filter((entry) => entry._id !== id));
        fetchHistory();
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    });
  };
  // useEffect(() => {
  //   setUserLimit(user.dailyLimit)
  // })
  return (
    <section id="data-box">
      <form className="currency-selector">
        <select
          name="currency"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
        >
          <option value="₹">INR</option>
          <option value="$">USD</option>
        </select>
      </form>

      <div className="form-container">
        <form className="expense-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Category</label>
            <input
              list="categories"
              type="text"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
            />
            <datalist id="categories">
              {[
                "Food",
                "Travel",
                "Clothing",
                "Education",
                "Entertainment",
                "Healthcare",
                "Utilities",
                "Rent",
                "Savings",
                "Gifts",
                "Groceries",
                "Subscriptions",
                "Maintenance",
                "Insurance",
                "Pet Care",
                "Electronics",
                "Personal Care",
                "Investment",
                "Stationery",
                "Charity",
                "Phone & Internet",
                "Loan Payments",
              ].map((option) => (
                <option key={option} value={option} />
              ))}
            </datalist>
          </div>

          <div className="form-group">
            <label>Cost</label>
            <input
              type="number"
              value={categoryCost}
              onChange={(e) => setCategoryCost(e.target.value)}
            />
          </div>

          <div className="form-group">
            <input
              className="discription"
              type="text"
              id="description"
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <button type="submit">Submit</button>
          {error && <p className="error-message">{error}</p>}
        </form>

        <aside className="summary-info">
          <div className="summary-box">
            <h5>
              <span className="label">Remaining:</span>
              <span
                className={`limit-value ${
                  userLimit > 0 ? "positive" : "negative"
                }`}
              >
                {userLimit < 0 && "-"}
                {currency}
                {currency === "$"
                  ? Math.abs((userLimit * exchangeRate).toFixed(2))
                  : Math.abs(userLimit.toFixed(2))}
              </span>
            </h5>
          </div>

          <div className="summary-box">
            <h4>
              Total cost:{" "}
              <span className="totalcost">
                {currency}
                {currency === "$"
                  ? (totalCost * exchangeRate).toFixed(2)
                  : totalCost.toFixed(2)}
              </span>
            </h4>
          </div>
        </aside>
      </div>

      <section className="expense-history">
        <ul>
          {[...history]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map((entry) => (
              <li
                key={entry._id}
                className={`history-item ${entry.category.toLowerCase()}`}
              >
                <div className="entry-card">
                  <header className="entry-header">
                    <div className="entry-details">
                      <p
                        className={`category-tag ${entry.category.toLowerCase()}`}
                      >
                        {entry.category.charAt(0).toUpperCase() +
                          entry.category.slice(1)}
                        :
                      </p>
                      <span>
                        {currency}
                        {currency === "$"
                          ? (entry.amount * exchangeRate).toFixed(2)
                          : entry.amount.toFixed(2)}
                      </span>
                    </div>
                    <p className="date">{formatDateTime(entry.date)}</p>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(entry._id)}
                    >
                      <FaTrash />
                    </button>
                  </header>
                  <footer className="entry-footer">
                    <p>{entry.title}</p>
                  </footer>
                </div>
              </li>
            ))}
        </ul>
      </section>
    </section>
  );
}
