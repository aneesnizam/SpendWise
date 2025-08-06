import React, { useEffect, lazy, Suspense } from "react";
import "./home.css";
import Nav from "./Nav";
import DataBox from "./DataBox";
const DateFilter = lazy(() => import("./DateFilter"));
import FilterPanel from "./FilterPanel";
import userlogindata from "../utilities/Authstore";
const InSight = lazy(() => import("./InSight"));
const LendBorrow = lazy(() => import("./LendBorrow"));
const AboutUs = lazy(() => import("./AboutUs"));
const Friends = lazy(() => import("./Friends"));
const Shared = lazy(() => import("./Shared"));
import Loading from "./Loading/Loading";
const FuelCalculator = lazy(() => import("./FuelCalculator/FuelCalculator"));
const Calculator = lazy(() => import("./Calculator/Calculator"));
const Help = lazy(() => import("./Help/Help"));
import Footer from "../utilities/Footer"

export default function Home() {
  const { currentView, fetchFriendsData } = userlogindata();

  const renderView = () => {
    switch (currentView) {
      case "filterByDate":
        return (
          <Suspense fallback={<Loading />}>
            <DateFilter />
          </Suspense>
        );
      case "dateRange":
        return <FilterPanel />;
      case "insight":
        return (
          <Suspense fallback={<Loading />}>
            <InSight />
          </Suspense>
        );
      case "lend/borrow":
        return (
          <Suspense fallback={<Loading />}>
            <LendBorrow />
          </Suspense>
        );
      case "aboutUs":
        return (
          <Suspense fallback={<Loading />}>
            <AboutUs />
          </Suspense>
        );
      case "friends":
        return (
          <Suspense fallback={<Loading />}>
            <Friends />
          </Suspense>
        );
      case "shared":
        return (
          <Suspense fallback={<Loading />}>
            <Shared />
          </Suspense>
        );
      case "calculator":
        return (
          <Suspense fallback={<Loading />}>
            <Calculator />
          </Suspense>
        );
      case "fuelCalculator":
        return (
          <Suspense fallback={<Loading />}>
            <FuelCalculator />
          </Suspense>
        );
      case "help":
        return (
          <Suspense fallback={<Loading />}>
            <Help />
          </Suspense>
        );
      case "home":
        return <DataBox />;
      default:
        return <DataBox />;
    }
  };

  useEffect(() => {
    fetchFriendsData();
  }, []);

  return (
    <main id="home-page">
      <Nav />
      <section className="content-area">{renderView()}</section>
      <Footer/>
    </main>
  );
}
