import React, { useEffect, useRef, useState } from "react";
import "./profile.css";
import userlogindata from "./Authstore";
import { toast } from "react-toastify";
import api from "../utilities/axios";

export default function Profile() {
  const profileRef = useRef(null);
  const inputRef = useRef(null);
  const { setViewProfile, user, logoutUser, setUser } = userlogindata();

  const [editLimit, setEditLimit] = useState(false);
  const [limit, setLimit] = useState(user.dailyLimit);
  const[entries,setEntries] = useState()


  useEffect(() => {
    api.get("api/expenses")
    .then((res) => {
const expenses = (res.data.expenses).length
setEntries(expenses)
    })
  })

  const handleLimit = async () => {

    try {
      await api.post("api/user", { dailyLimit: limit }).then((res) => {
        toast.success(res.data.message);
        setUser(res.data.user);
        setLimit(res.data.user.dailyLimit);
     
      });
    } catch (err) {
      console.log(err);
    }
  };

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
  }, [ setViewProfile]);

  return (
    <section id="profileContainer">
      <div className="profilebox" ref={profileRef}>
        <div className="top">
          <button onClick={() => setViewProfile(false)}>Back</button>
        </div>
        <div className="middle">
          <ul>
            <li>{user.name}</li>
            <li>{user.email}</li>
            <li>Total entries{entries}</li>
            <li>
              {editLimit ? (
                <input
                  ref={inputRef}
                  type="text"
                  onChange={(e) => setLimit(e.target.value)}
                  onBlur={() => {
                    handleLimit()
                    setEditLimit(false)
                  }}
                  autoFocus
                  value={limit}
                />
              ) : (
                <>
                  {limit || "0"}{" "}
                  <button onClick={() => setEditLimit(true)}>edit</button>
                </>
              )}
            </li>
          </ul>
        </div>
        <div className="bottom">
          <button onClick={logoutUser}>Logout</button>
        </div>
      </div>
    </section>
  );
}
