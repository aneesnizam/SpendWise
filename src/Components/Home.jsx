import React from 'react'
import "./home.css";
import Nav from "./Nav"
import DataBox from "./DataBox"
export default function Home() {
  return (
   
    <section id="home">
<Nav />
<section className="header">
  <div className="left">
    <h4>Search by date</h4>
  </div>
  <div className="right">
    <a href="https://letsgoforatrip.netlify.app/">calculate fuel cost</a>
  </div>
</section>
<DataBox />
    </section>
  )
}
