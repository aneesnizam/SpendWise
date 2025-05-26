import React, {useState} from "react";
import "./Nav.css";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaSun, FaMoon } from "react-icons/fa";
import dp from "../assets/dp.jpg"

export default function Nav() {

    const [toggle,setToggle] = useState(true)
const handleToggle = () => {
if(toggle == true){
    setToggle(false)
}
if(toggle == false){
    setToggle(true)
}
}
  return (
    <section id="nav">
      <div className="left">
        <button>
          <GiHamburgerMenu />
        </button>
      </div>
      <div className="middle"> <h3>SpendWise</h3></div>
      <div className="right">
        <button onClick={() => handleToggle()}> { toggle ? (<FaMoon style={{color:"grey"}}/>) : (<FaSun style={{color:"gold"}} />)}</button>
        <span>
          <img src={dp} alt="" />
        </span>
      </div>
    </section>
  );
}


