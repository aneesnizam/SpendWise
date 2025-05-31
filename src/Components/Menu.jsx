import React, { useEffect, useRef, useState } from "react";
import "./menu.css";
import userlogindata from "./Authstore";
import { useNavigate } from "react-router-dom";

export default function Menu() {
  const { setShowMenu, setCurrentView } = userlogindata();


  const handleHome = (path) => {
    setCurrentView(path);
    setShowMenu(false);
  };
  const [toggle, setToggle] = useState(false);

  const handletoggle = () => {
    if (toggle == true) {
      setToggle(false);
    } else {
      setToggle(true);
    }
  };
  const menuRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setShowMenu]);

  return (
    <section id="menu">
      <div className="menuContent" ref={menuRef}>
        <div className="top">
          <button onClick={() => setShowMenu(false)}>back</button>
        </div>
        <div className="bottom">
          <ul>
            <li onClick={() => handleHome("home")}>Home</li>
            <li onClick={handletoggle}>In Sight</li>
            {toggle && (
              <ul>
                <li onClick={() => handleHome("filterByDate")}>
                  filter using date
                </li>
                <li onClick={() => handleHome("dateRange")}>sort using date range </li>
                <li>using cost</li>
                <li>using category</li>
                <li>all</li>
              </ul>
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}
