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

  const [edit, setEdit] = useState(false);

  const [limit, setLimit] = useState(user.dailyLimit || 0);
  const [newName, setNewName] = useState(user.name || "user");
  const [entries, setEntries] = useState(null);
  const [isSlider, setIsSlider] = useState(false);

  // Fetch expense entries once when component mounts
  useEffect(() => {
    api
      .get("api/expenses")
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

      setUser(res.data.user);
    } catch (err) {
      console.error("Error updating name:", err);
    }
  };

  // Update user's daily limit
  const handleLimit = async () => {
    try {
      const res = await api.post("api/user", {
        dailyLimit: limit,
        name: newName,
      });

      setUser(res.data.user);
      setLimit(res.data.user.dailyLimit);
      return res.data.message;
    } catch (err) {
      console.error("Error updating limit:", err);
    }
  };
  const handleSlider = () => {
    setIsSlider((prev) => !prev);
  };
  const handleSave = async () => {
    setEdit(false);

    handleName();
    const msg = await handleLimit();
    toast.success(msg);
  };
  return (
    <section id="profileContainer">
      <div className="profilebox" ref={profileRef}>
        <div className="top">
          <button onClick={() => setViewProfile(false)}   >Back</button>
          {!edit ? (
            <button className="editButton" style={{background:"#ff7e5f",color:"white"}} onClick={() => setEdit(true)}>
              <MdEdit />
            </button>
          ) : (
            <button className="editButton" style={{background:"rgb(25, 192, 25)",color:"white"}} onClick={handleSave}>
              Save
            </button>
          )}
        </div>
        <div className="middle" style={  edit ? {marginTop:"10px"}: {}} >
          <ul>
            <li>
              {edit && <p>Change name :</p>}
              {edit ? (
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              ) : (
                <><strong style={{fontSize:"28px"}}>{newName}</strong> </>
              )}
            </li>
            { !edit && (
              <>
                <li>{user.email}</li>

                <li>
                  Total entries: {entries !== null ? entries : "Counting..."}
                </li>
              </>
            )}

            {/* Editable Daily Limit */}
            <li>
              <p> {!edit ? "Daily Spending Limit :" : "Set Daily Limit :"}</p>
              {edit ? (
                <input
                  ref={inputRef}
                  type="number"
                  value={limit}
                  onChange={(e) => setLimit(e.target.value)}
                />
              ) : (
                <>₹{limit} </>
              )}
            </li>
            <li>
              <p>
                Weekly Summary:{" "}
                {edit && (
                  <p style={{ fontSize: "12px", marginBottom: "0px" }}>
                    Receive a weekly email with your expense summary
                  </p>
                )}
              </p>
              <label className="sliderlabel">
                <input
                  disabled={!edit}
                  type="checkbox"
                  checked={isSlider}
                  onChange={handleSlider}
                />
                <span className="slider"></span>
              </label>
            </li>
          </ul>
        </div>

        {/* Logout */}
        <div className="bottom">
          {!edit && <button onClick={logoutUser}>Logout</button>}
          
        </div>
      </div>
    </section>
  );
}
