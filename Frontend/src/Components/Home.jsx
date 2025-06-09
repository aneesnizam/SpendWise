import React from "react";
import "./home.css";
import Nav from "./Nav";
import DataBox from "./DataBox";
import DateFilter from "./DateFilter";
import FilterPanel from "./FilterPanel";
import userlogindata from "./Authstore";
import InSight from "./InSight";
import LendBorrow from "./LendBorrow";
import AboutUs from "./AboutUs";
import Friends from "./Friends"
import  Shared from "./Shared"
export default function Home() {
  const { currentView } = userlogindata();

  const renderView = () => {
    switch (currentView) {
      case "filterByDate":
        return <DateFilter />;
      case "dateRange":
        return <FilterPanel />;
      case "insight":
        return <InSight />
      case "lend/borrow":
        return <LendBorrow />
        case "aboutUs":
        return <AboutUs />
          case "friends":
        return <Friends />
          case "shared":
        return <Shared />
      case "home":
        return <DataBox />;
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
