import React, { useEffect, useRef, useState } from "react";
import "./profile.css";
import userlogindata from "./Authstore";
import { toast } from "react-toastify";
import api from "../utilities/axios";
import { MdEdit } from "react-icons/md";

export default function Profile() {
  const profileRef = useRef(null);
  const inputRef = useRef(null);
  const { setViewProfile, user, logoutUser, setUser } = userlogindata();

  const [editLimit, setEditLimit] = useState(false);
  const [editName, setEditName] = useState(false);

  const [limit, setLimit] = useState(user.dailyLimit || 0);
  const [newName, setNewName] = useState(user.name || "user");
  const [entries, setEntries] = useState(null);

  // Fetch expense entries once when component mounts
  useEffect(() => {
    api.get("api/expenses")
      .then((res) => {
        const expenses = res.data.expenses.length;
        setEntries(expenses);
      })
      .catch((err) => {
        console.error("Error fetching expenses:", err);
      });
  }, []);

  // Close profile modal if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setViewProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setViewProfile]);

  // Update user's name
  const handleName = async () => {
    try {
      const res = await api.post("api/user", { name: newName });
      toast.success(res.data.message);
      setUser(res.data.user);
    } catch (err) {
      console.error("Error updating name:", err);
    }
  };

  // Update user's daily limit
  const handleLimit = async () => {
    try {
      const res = await api.post("api/user", { dailyLimit: limit, name: newName });
      toast.success(res.data.message);
      setUser(res.data.user);
      setLimit(res.data.user.dailyLimit);
    } catch (err) {
      console.error("Error updating limit:", err);
    }
  };

  return (
    <section id="profileContainer">
      <div className="profilebox" ref={profileRef}>
        <div className="top">
          <button onClick={() => setViewProfile(false)}>Back</button>
        </div>
        <div className="middle">
          <ul>
            {/* Editable Name */}
            <li>
              {editName ? (
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onBlur={() => {
                    handleName();
                    setEditName(false);
                  }}
                  autoFocus
                />
              ) : (
                <>
                  {newName}{" "}
                  <button className="editButton" onClick={() => setEditName(true)}>
                    <MdEdit />
                  </button>
                </>
              )}
            </li>

            {/* Email */}
            <li>{user.email}</li>

            {/* Total Entries */}
            <li>Total entries: {entries !== null ? entries : "Loading..."}</li>

            {/* Editable Daily Limit */}
            <li>
              {editLimit ? (
                <input
                  ref={inputRef}
                  type="number"
                  value={limit}
                  onChange={(e) => setLimit(e.target.value)}
                  onBlur={() => {
                    handleLimit();
                    setEditLimit(false);
                  }}
                  autoFocus
                />
              ) : (
                <>
                  {limit}{" "}
                  <button className="editButton" onClick={() => setEditLimit(true)}>
                    <MdEdit />
                  </button>
                </>
              )}
            </li>
          </ul>
        </div>

        {/* Logout */}
        <div className="bottom">
       <span>woww</span>
        </div>
      </div>
    </section>
  );
}
