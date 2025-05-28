import React from "react";
import "./home.css";
import Nav from "./Nav";
import DataBox from "./DataBox";
import userlogindata from "./Authstore";

export default function Home() {
  const { user } = userlogindata();
  return (
    <section id="home">
      <Nav />
      <section className="header">
        <div className="left">
          <h4>{user.name}</h4>
        </div>
        <div className="right">
          <a href="https://letsgoforatrip.netlify.app/">calculate fuel cost</a>
        </div>
      </section>
      <DataBox />
    </section>
  );
}
