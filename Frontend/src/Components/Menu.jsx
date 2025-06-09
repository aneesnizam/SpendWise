import React, { useEffect, useRef } from "react";
import "./menu.css";
import userlogindata from "./Authstore";

export default function Menu() {
  const { setShowMenu, setCurrentView } = userlogindata();

  const handleNavigation = (view) => {
    setCurrentView(view);
    setShowMenu(false);
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
    <nav id="menu">
      <div className="menu-container" ref={menuRef}>
        <header className="menu-header">
          <button className="menu-close-btn" onClick={() => setShowMenu(false)}>
            Back
          </button>
        </header>
        <ul className="menu-list">
          <li className="menu-item" onClick={() => handleNavigation("home")}>Home</li>
          <li className="menu-item" onClick={() => handleNavigation("filterByDate")}>Filter</li>
            <li className="menu-item" onClick={() => handleNavigation("lend/borrow")}>Lend/Borrow</li>
              <li className="menu-item" onClick={() => handleNavigation("insight")}>In Sight</li>
                    <li className="menu-item" onClick={() => handleNavigation("friends")}>Friends</li>
                          <li className="menu-item" onClick={() => handleNavigation("shared")}>Shared</li>
                                <li className="menu-item" onClick={() => handleNavigation("aboutUs")}>About Us</li>
        </ul>
      </div>
    </nav>
  );
}
