import React, { useState } from "react";
import "./home.css";
import Nav from "./Nav";
import DataBox from "./DataBox";
import userlogindata from "./Authstore";
import SearchByDate from "./SearchByDate";
import DateRange from "./DateRange"




export default function Home() {
  const { setSearchdate, searchdate,currentView } = userlogindata();
const render = () => {

  switch(currentView){
    case 'home':
      return <DataBox />;
      case 'filterByDate':
      return < SearchByDate  />;
      case 'dateRange':
        return <DateRange/>
      default:
        return <DataBox />;
  }
}
  return (
    <section id="home">
      <Nav />
      <section className="header">
        {/* <div className="left">
          {searchdate ?  <button onClick={() => setSearchdate(false)}>Back</button> :  <button onClick={() => setSearchdate(true)}>search by date</button>}
         
        </div>
        <div className="right">
          <a href="https://letsgoforatrip.netlify.app/">calculate fuel cost</a>
        </div> */}
      </section>
      {render()}
    </section>
  );
}
