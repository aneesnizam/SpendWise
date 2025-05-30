import React, { useEffect, useState } from "react";
import "./insert.css";
import api from "../utilities/axios";
import { toast } from "react-toastify";

export default function DataBox() {
  const [customcategory, setCustomCategory] = useState("");
  const [categorycost, setCategorycost] = useState("");
  const [history, setHistory] = useState([]);
  const [currency, setCurrency] = useState("₹");
  const [discription, setDiscription] = useState("");
  const [error, setError] = useState("");
  const [totalcost, setTotalcost] = useState(0);
  const [userlimit, setUserlimit] = useState(100);

  const rate = 1 / 85.1;

  const fetchhistory = async () => {
    try {
      const res = await api.get("api/expenses?today=true");
      setHistory(res.data.expenses);
      setTotalcost(res.data.totalAmount)
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    fetchhistory();
  }, [categorycost]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const time = new Date().toLocaleTimeString();
    const date = new Date().toLocaleDateString();
    const toINR = (value) => {
      const num = parseFloat(value);
      return currency === "$" ? num / rate : num;
    };

    if (!categorycost.trim()) {
      setError("Fill atleast one input");
      return;
    }

    const newcost = toINR(categorycost);

    try {
      const res = await api.post("api/expenses/", {
        title: discription,
        amount: newcost,
        category: customcategory || "other",
      });
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err.message);
    }

    setCategorycost("");
    setDiscription("");
    setCustomCategory("");

    const updatedTotal = totalcost + newcost;
    const updatedLimit = userlimit - newcost;
    // setTotalcost(updatedTotal);
    setUserlimit(updatedLimit);
    setError("");
  };

  const DateDisplay = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const handleDelete = async (id) => {
    try {
      const res = await api.delete(`api/expenses/${id}`);
      if (res.data.success) {
        toast.success(res.data.message);
        const newHistory = history.filter((data) => data._id !== id);
        setHistory(newHistory);
       
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <section id="data-box">
      <div className="info-block1">
        <form>
          <select
            name="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            <option value="₹">INR</option>
            <option value="$">USD</option>
          </select>
        </form>
      </div>

      <div className="form-section">
        <div className="form-left">
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="">Category</label>
              <input
                list="categories"
                type="text"
                value={customcategory}
                onChange={(e) => setCustomCategory(e.target.value)}
              />
              <datalist id="categories">
                <option value="Food" />
                <option value="Travel" />
                <option value="Clothing" />
                <option value="Education" />
                <option value="Entertainment" />
                <option value="Healthcare" />
                <option value="Utilities" />
                <option value="Rent" />
                <option value="Savings" />
                <option value="Gifts" />
                <option value="Groceries" />
                <option value="Subscriptions" />
                <option value="Maintenance" />
                <option value="Insurance" />
                <option value="Pet Care" />
                <option value="Electronics" />
                <option value="Personal Care" />
                <option value="Investment" />
                <option value="Stationery" />
                <option value="Charity" />
                <option value="Phone & Internet" />
                <option value="Loan Payments" />
              </datalist>
            </div>

            <div className="input-group">
              <label htmlFor="">Cost</label>
              <input
                type="text"
                value={categorycost}
                onChange={(e) => setCategorycost(e.target.value)}
              />
            </div>

            <div className="input-group">
              <input
                type="text"
                id="description"
                placeholder="Description (optional)"
                value={discription}
                onChange={(e) => setDiscription(e.target.value)}
              />
            </div>

            <button type="submit">Submit</button>
          </form>

          {error && (
            <h2
              style={{
                color: "red",
                textAlign: "center",
                fontSize: "10px",
                marginTop: "15px",
              }}
            >
              {error}
            </h2>
          )}
        </div>

        <div className="form-right">
          <div className="info-block">
            <h5>
              <p style={{ color: Number(userlimit) > 0 ? "green" : "red" }}>
                {currency}
                {currency === "$"
                  ? (userlimit * rate).toFixed(2)
                  : userlimit.toFixed(2)}
              </p>
              <p>remaining</p>
            </h5>
          </div>

          <div className="info-block">
            <h4>
              Total cost: {currency}
              {currency === "$"
                ? (totalcost * rate).toFixed(2)
                : totalcost.toFixed(2)}
            </h4>
          </div>
        </div>
      </div>

      <div className="history-section">
        <ul>
          {
          [...history]
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .map((data) => (
            <li key={data._id}>
              <div className="entry-card">
                <div className="entry-header">
                  <div className="entry-row">
                    <p>{data.category} : </p>
                    <span>
                      {currency}
                      {currency === "$"
                        ? (data.amount * rate).toFixed(2)
                        : data.amount.toFixed(2)}
                    </span>
                  </div>
                  <p>{DateDisplay(data.date)}</p>
                  <button onClick={() => handleDelete(data._id)}>Delete</button>
                </div>
                <div className="entry-footer">
                  <p>{data.title}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
