import React, { useState } from "react";
import "./Nav.css";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaSun, FaMoon } from "react-icons/fa";
import dp from "../assets/dp.jpg";
import userlogindata from "./Authstore";
import Menu from "./Menu";
import Profile from "./Profile";
import Logo from "../assets/sw4.png"
export default function Nav() {
  const { showMenu, setShowMenu, setViewProfile, viewProfile } =
    userlogindata();

  const [toggle, setToggle] = useState(true);
  const handleToggle = () => {
    if (toggle == true) {
      setToggle(false);
    }
    if (toggle == false) {
      setToggle(true);
    }
  };
  return (
    <>
      <section id="nav">
        <div className="left">
        
          <button onClick={() => setShowMenu(true)}>
            <GiHamburgerMenu />
          </button>
          {showMenu && <Menu />}
        </div>
        <div className="middle">
          {" "}
          <img src={Logo} alt="" />
        </div>
        <div className="right">
          <button onClick={() => handleToggle()}>
            {" "}
            {toggle ? (
              <FaMoon style={{ color: "grey" }} />
            ) : (
              <FaSun style={{ color: "gold" }} />
            )}
          </button>
          <span
            onClick={() => {
              setViewProfile(true);
            }}
          >
            <img src={dp} alt="" />
          </span>
       
        </div>
           {viewProfile && <Profile />}
      </section>
    </>
  );
}
