import React, { useState } from "react";
import "./Nav.css";
import { GiHamburgerMenu } from "react-icons/gi";
import { FiDownload } from "react-icons/fi";
import dp from "../assets/dp.jpg";
import userlogindata from "./Authstore";
import Menu from "./Menu";
import Profile from "./Profile";
import Logo from "../assets/sw5.png"
export default function Nav() {
  const { showMenu, setShowMenu, setViewProfile, viewProfile } =
    userlogindata();

  const [toggle, setToggle] = useState(true);

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
          <button >
         < FiDownload  />
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
