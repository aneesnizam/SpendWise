import React from "react";
import "./home.css";
import Nav from "./Nav";
import DataBox from "./DataBox";
import DateFilter from "./DateFilter";
import FilterPanel from "./FilterPanel";
import userlogindata from "./Authstore";

export default function Home() {
  const { currentView } = userlogindata();

  const renderView = () => {
    switch (currentView) {
      case "filterByDate":
        return <DateFilter />;
      case "dateRange":
        return <FilterPanel />;
      case "home":
      default:
        return <DataBox />;
    }
  };

  return (
    <main id="home-page">
      <Nav />
      <section className="content-area">
        {renderView()}
      </section>
    </main>
  );
}
