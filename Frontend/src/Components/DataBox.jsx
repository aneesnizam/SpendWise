import React, { useEffect, useState } from "react";
import "./dataBox.css";
import api from "../utilities/axios";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";
import userlogindata from "../utilities/Authstore";
import IntialLoader from "./Loading/IntialLoader";
import {
  SwipeableList,
  SwipeableListItem,
  SwipeAction,
  TrailingActions
} from 'react-swipeable-list';
import 'react-swipeable-list/dist/styles.css';


export default function DataBox() {
  const { user, friends, setUser } = userlogindata();
  const [customCategory, setCustomCategory] = useState("");
  const [categoryCost, setCategoryCost] = useState("");
  const [history, setHistory] = useState([]);
  const [currency, setCurrency] = useState("₹");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [totalCost, setTotalCost] = useState(0);
  const [userLimit, setUserLimit] = useState(user?.dailyLimit);
  const [sharedWith, setSharedWith] = useState([]);
  const [shared, setShared] = useState(false);
  const [loading, setLoading] = useState(true);
  const exchangeRate = 1 / 85.1;
const [inactiveDates,setInactiveDates] = useState()
const[deletePopup,setDeletePopup] = useState('')
const trailingActions = (id) => (

  <TrailingActions>

    <SwipeAction destructive={false} onClick={() => {setDeletePopup(id)}}>

    <div
             style={{
         background: "linear-gradient(135deg, #f5f7fa 0%,rgb(255, 76, 76) 100%)",
  color: "rgba(108, 117, 125, 0.8)",
          padding: "0 20px",
          fontWeight: "bold",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxSizing: "border-box",
          borderRadius: "0",
   
         
        }}
      >
        Delete
      </div>    
    </SwipeAction>
  </TrailingActions>
);


  const fetchHistory = async () => {
    try {
      const res = await api.get("api/expenses?today=true");
      setHistory(res.data.expenses);
      setTotalCost(res.data.totalAmount);
      if (user?.dailyLimit) {
        setUserLimit(user.dailyLimit - res.data.totalAmount);
      }
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
      //   setTimeout(() => {
      //   setLoading(false)
      // },3000)
    }
  };

const getLastExpenseDayDiff = async () => {
  try {
    const res = await api.get("api/expenses/");
    const rawExpenses = Array.isArray(res.data.expenses)
      ? res.data.expenses
      : [];

    const Datalists = [];

    rawExpenses.forEach((item) => {
      if (!item?.date) return;
      const date = new Date(item.date);
      const localDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );
      Datalists.push(localDate);
    });

    if (Datalists.length === 0) return null;

    const latestDate = new Date(Math.max(...Datalists));
    const currentDate = new Date();
    const diffInMs = Math.abs(latestDate - currentDate);
    const diffInDys = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

    setInactiveDates(diffInDys - 1);
  } catch (err) {
    console.error("Failed to get last expense date difference:", err);
    return null;
  }
};

  const handleCheckboxChange = (friendId) => {
    setSharedWith((prev) =>
      prev.includes(friendId)
        ? prev.filter((id) => id !== friendId)
        : [...prev, friendId]
    );
  };

  const getUser = async () => {
    try {
      const res = await api.get("api/user");
      setUser(res.data.user);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await getUser(); // first get the user
    };
    loadData();
    getLastExpenseDayDiff();
  }, []);

  useEffect(() => {
    if (user && user.dailyLimit !== undefined) {
      fetchHistory();
    }
  }, [user]);

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
    if (isNaN(cost) || cost <= 0) {
      setError("Enter a valid amount");
      return;
    }

    const totalAmount = parseFloat(categoryCost);
    const splitAmount =
      sharedWith.length > 0
        ? totalAmount / (sharedWith.length + 1)
        : totalAmount;

    const sharedWithData = sharedWith.map((friendId) => ({
      friend: friendId,
      amount: Math.ceil(splitAmount),
    }));

    try {
      const res = await api.post("api/expenses/", {
        title: description,
        amount: cost,
        category: customCategory || "other",
        sharedWith: shared ? sharedWithData : [],
      });
      toast.success(res.data.message);
      fetchHistory(); // Refresh history
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
    }

    setCustomCategory("");
    setCategoryCost("");
    setDescription("");
    setShared(false);
    setSharedWith([]);
    setError("");
  };

  const handleDeleteYes = async () => {
    try {
      const res = await api.delete(`api/expenses/${deletePopup}`);
      if (res.data.success) {
        toast.success(res.data.message);
        fetchHistory();
        setDeletePopup('')
      }
    } catch (err) {
      console.error(err.message);
    }
  };

const formatDateTime = (dateString) => {
  const date = new Date(dateString);

  const formattedDate = date.toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  let formattedTime = date.toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  // Add non-breaking space before am/pm
  formattedTime = formattedTime.replace(/(\d{1,2}:\d{2}) (\w{2})/, '$1\u00A0$2');

  return `${formattedDate}, ${formattedTime}`;
};


  useEffect(() => {
    if (userLimit <= 0) {
      toast.warn("Your daily limit exceeded", {
        autoClose: 2000,
      });
    }
  }, [userLimit]);
  if (loading) return <IntialLoader />;



  const handleDeleteNo = () => {

setDeletePopup('')
  }

  return (
    <section id="data-box">
      {deletePopup &&    <div className="deleteContainer">
        <div className="delBox">
          <h5>Delete?</h5>
          <div className="buttonContainers">
            <button onClick={handleDeleteNo}>No</button>
            <button onClick={handleDeleteYes}>yes</button>
          </div>
        </div>
      </div>}
   
      {inactiveDates >=2 && <div className="InactiveDays"><h5>You’ve been inactive for <strong>{inactiveDates} </strong>days!  Let’s get back on track!  </h5></div>  }
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
  <select className="CategorySelector"
    value={customCategory}
    onChange={(e) => setCustomCategory(e.target.value)}
  >
    <option value="">-- Select Category --</option>
    <option value="food">Food</option>
    <option value="transport">Transport</option>
    <option value="shopping">Shopping</option>
    <option value="entertainment">Entertainment</option>
    <option value="bills">Bills</option>
    <option value="healthcare">Healthcare</option>
    <option value="education">Education</option>
    <option value="groceries">Groceries</option>
    <option value="fuel">Fuel</option>
    <option value="public-transport">Public Transport</option>
    <option value="clothing">Clothing</option>
    <option value="electronics">Electronics</option>
    <option value="movies">Movies</option>
    <option value="subscriptions">Subscriptions</option>
    <option value="electricity">Electricity</option>
    <option value="water">Water</option>
    <option value="internet">Internet</option>
    <option value="rent">Rent</option>
    <option value="mortgage">Mortgage</option>
    <option value="medicines">Medicines</option>
    <option value="doctor">Doctor</option>
    <option value="insurance">Insurance</option>
    <option value="school-fees">School Fees</option>
    <option value="books">Books</option>
    <option value="personal-care">Personal Care</option>
    <option value="gym">Gym</option>
    <option value="salon">Salon</option>
    <option value="travel">Travel</option>
    <option value="flight">Flight</option>
    <option value="hotel">Hotel</option>
    <option value="gifts">Gifts</option>
    <option value="charity">Charity</option>
    <option value="savings">Savings</option>
    <option value="investments">Investments</option>
    <option value="pets">Pets</option>
    <option value="home-maintenance">Home Maintenance</option>
    <option value="childcare">Childcare</option>
    <option value="taxes">Taxes</option>
    <option value="other">Other</option>
  </select>
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

          <div className="share-toggle-containerr">
            <label htmlFor="sharetofriend" className="share-toggle-label">
              Share with friends
            </label>
            <input
              id="sharetofriend"
              type="checkbox"
              className="share-toggle-input"
              onChange={() => setShared((prev) => !prev)}
              checked={shared}
              hidden
            />
            <span
              onClick={() => setShared((prev) => !prev)}
              className="slide"
            ></span>
          </div>

          {shared && (
            <div className="friend-split-containerr">
              <label className="friend-split-title">Split with Friends</label>
              <div className="friend-split-list">
                {friends?.length > 0 ? (
                  friends.map((friend) => (
                    <label key={friend._id} className="friend-split-option">
                      <input
                        type="checkbox"
                        className="friend-split-checkbox"
                        checked={sharedWith.includes(friend._id)}
                        onChange={() => handleCheckboxChange(friend._id)}
                      />
                      <span className="friend-split-info">
                        {friend.name}{" "}
                        <span className="friend-split-email">
                          ({friend.email})
                        </span>
                      </span>
                    </label>
                  ))
                ) : (
                  <p className="friend-split-empty">
                    No friends available to split with.
                  </p>
                )}
              </div>
            </div>
          )}

          <button type="submit">Submit</button>
          {error && <p className="error-message">{error}</p>}
        </form>

        <aside className="summary-info">
          <div className="summary-box">
            <h5 style={{ marginBottom: "30px" }}>
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
            <h3>
              Total cost:{" "}
              <span className="totalcost">
                {currency}
                {currency === "$"
                  ? (totalCost * exchangeRate).toFixed(2)
                  : totalCost.toFixed(2)}
              </span>
            </h3>
          </div>
        </aside>
      </div>

      <section className="expense-history">
        <ul>
          <SwipeableList>
          {[...history]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map((entry) => (
              <SwipeableListItem className={`history-item ${entry.category.toLowerCase()}` } key={entry._id} trailingActions={trailingActions(entry._id)}  >
              
              <li
                 style={{ width: '100%' }}
              >
                <div className="entry-card">
                  <header className="entry-header">
                    <div className="entry-details" >
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
                    <p style={{textAlign:"center"}} className="date">{formatDateTime(entry.date)} </p>
                    <button
                      className="delete-btn"
                      style={{ textAlign: "center" }}
                      onClick={() => setDeletePopup(entry._id)}
                    >
                      <FaTrash />
                    </button>
                  </header>
                  <footer className="entry-footer">
                    <p>{entry.title}</p>
                  </footer>
                </div>
              </li>
             
              </SwipeableListItem>
            ))}
            </SwipeableList>
        </ul>
      </section>
    </section>
  );
}
