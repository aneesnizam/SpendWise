import React, { useEffect, useRef, useState } from "react";
import "./profile.css";
import userlogindata from "./Authstore";

export default function Profile() {
  const profileRef = useRef(null);
  const inputRef = useRef(null);
  const { setViewProfile, user, logoutUser } = userlogindata();

  const [editLimit, setEditLimit] = useState(false);
  const [limit, setLimit] = useState("");
// useEffect(() =>{
// api.post("api/auth/update",)

// },[])
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setViewProfile(false);
      }

      // If user clicks outside the input while editing, save and exit edit mode
      if (
        editLimit &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setEditLimit(false); // Exit edit mode
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editLimit, setViewProfile]);


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
            <li>Total entries</li>
            <li>
              {editLimit ? (
                <input
                  ref={inputRef}
                  type="text"
                  onChange={(e) => setLimit(e.target.value)}
                  onBlur={() => setEditLimit(false)} 
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
