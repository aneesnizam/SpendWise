import React, { useEffect, useState } from "react";
import "./lendBorrow.css";
import api from "../utilities/axios";
import { toast } from "react-toastify";
import { FiSearch } from "react-icons/fi";

export default function LendBorrow() {
  const [type, setType] = useState("lend");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [allType, setAllType] = useState("all");
  const [allStatus, setAllStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("api/borrowlend", {
        type,
        person: name.trim(),
        amount: Number(amount),
        note: note.trim(),
        status: "pending",
      });
      toast.success(res.data.message);
      setName("");
      setAmount("");
      setNote("");
      fetchData();
    } catch (error) {
      console.error("Submission error:", error.response?.data || error.message);
      toast.error("Error submitting data");
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get("api/borrowlend");
      setData(res.data.transactions || []);
    } catch (err) {
      toast.error("Failed to fetch entries");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/api/borrowlend/${id}`, { status: newStatus });
      toast.success("Status updated");
      setData((prevData) =>
        prevData.map((item) =>
          item._id === id ? { ...item, status: newStatus } : item
        )
      );
      setEditId(null);
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/borrowlend/${id}`);
      toast.success("Entry deleted");
      setData((prevData) => prevData.filter((item) => item._id !== id));
    } catch (err) {
      toast.error("Failed to delete entry");
    }
  };

  const filteredData = data
    .filter((item) => {
      const typeMatch = allType === "all" || item.type === allType;
      const statusMatch = allStatus === "all" || item.status === allStatus;
      const nameMatch = item.person
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return typeMatch && statusMatch && nameMatch;
    });

  const calculateTotal = (type) => {
    return data
      .filter((d) => d.type === type)
      .reduce((acc, curr) => acc + curr.amount, 0);
  };

  const countEntries = (type) => {
    return data.filter((d) => d.type === type).length;
  };

  const shouldShowLendSummary = allType === "all" || allType === "lend";
  const shouldShowBorrowSummary = allType === "all" || allType === "borrow";

  return (
    <section id="lend-borrow-section">
      <div className="form-summary-wrapper">
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <label>
              Type:
              <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="lend">Lend</option>
                <option value="borrow">Borrow</option>
              </select>
            </label>

            <label>
              Person:
              <input
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>

            <label>
              Amount:
              <input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </label>

            <label>
              Note:
              <input
                type="text"
                placeholder="Enter note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </label>

            <button type="submit">Submit</button>
          </form>
        </div>

        <div className="summary-container">
          {shouldShowLendSummary && (
            <div className="summary-box lend-summary">
              <h4>Lend</h4>
              <h5>Total: ₹{calculateTotal("lend")}</h5>
              <h5>Entries: {countEntries("lend")}</h5>
            </div>
          )}
          {shouldShowBorrowSummary && (
            <div className="summary-box borrow-summary">
              <h4>Borrow</h4>
              <h5>Total: ₹{calculateTotal("borrow")}</h5>
              <h5>Entries: {countEntries("borrow")}</h5>
            </div>
          )}
        </div>
      </div>

      <div className="entry-list-section">
        <div className="filters-container">
          <div className="search-wrapper">
      <FiSearch className="search-icon" />
      <input
        type="text"
        className="search-input"
        placeholder="Search by name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>

          <select value={allType} onChange={(e) => setAllType(e.target.value)}>
            <option value="all">All Types</option>
            <option value="lend">Lend</option>
            <option value="borrow">Borrow</option>
          </select>

          <select
            value={allStatus}
            onChange={(e) => setAllStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="settled">Settled</option>
          </select>
        </div>

        {loading ? (
          <div className="loading-message">Loading entries...</div>
        ) : filteredData.length === 0 ? (
          <div className="no-entries-message">No entries found</div>
        ) : (
          <ul className="entry-list">
            {filteredData.map((item) => (
              <li
                className={`entry-item ${
                  item.type === "borrow" ? "borrow-item" : "lend-item"
                } ${item.status === "settled" ? "settled" : ""}`}
                key={item._id}
              >
                <div className="entry-row">
                  <div className="entry-cell entry-person">
                    {item.type === "borrow" ? "Borrowed from" : "Lent to"}{" "}
                    {item.person}
                  </div>
                  <div className="entry-cell entry-date">
                    {new Date(item.date).toLocaleString()}
                  </div>
                  <div className="entry-cell entry-amount">₹{item.amount}</div>
                  <div className="entry-cell entry-type">
                    <span className={`entry-type-badge ${item.type}`}>
                      {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                    </span>
                  </div>
                  <div className="entry-cell entry-status">
                    {editId === item._id ? (
                      <select
                        value={item.status}
                        onChange={(e) =>
                          handleStatusChange(item._id, e.target.value)
                        }
                      >
                        <option value="pending">Pending</option>
                        <option value="settled">Settled</option>
                      </select>
                    ) : (
                      <span
                        className={
                          item.status === "settled" ? "itemGreen" : "itemRed"
                        }
                      >
                        {item.status}
                      </span>
                    )}
                  </div>
                  <div className="entry-cell entry-actions">
                    <button
                      type="button"
                      className="edit-btn"
                      onClick={() => setEditId(item._id)}
                    >
                      {editId === item._id ? "Editing" : "Edit"}
                    </button>
                    <button
                      type="button"
                      className="deletee-btn"
                      onClick={() => handleDelete(item._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="entry-note">
                  <p>{item.note}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
