import React, { useState } from "react";
import "./home.css";
import Nav from "./Nav";
import DataBox from "./DataBox";
import userlogindata from "./Authstore";
import SearchByDate from "./SearchByDate";


export default function Home() {
  const { setSearchdate, searchdate } = userlogindata();

  return (
    <section id="home">
      <Nav />
      <section className="header">
        <div className="left">
          {searchdate ?  <button onClick={() => setSearchdate(false)}>Back</button> :  <button onClick={() => setSearchdate(true)}>search by date</button>}
         
        </div>
        <div className="right">
          <a href="https://letsgoforatrip.netlify.app/">calculate fuel cost</a>
        </div>
      </section>
      {searchdate ? < SearchByDate  /> : <DataBox />}
    </section>
  );
}
