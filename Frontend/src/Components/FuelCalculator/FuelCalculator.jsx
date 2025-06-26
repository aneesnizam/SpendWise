import React, { useState, useEffect } from "react";
import "./FuelCalculator.css"
export default function FuelCalculator() {
  const [millage, setMillage] = useState("");
  const [distance, setDistance] = useState("");
  const [fuelPrice, setFuelPrice] = useState(107.33);
  const [result, setResult] = useState(null);

  const fuelRequired = (e) => {
    e.preventDefault();

    const mileageValue = parseFloat(millage);
    const distanceValue = parseFloat(distance);
    const fuelPriceValue = parseFloat(fuelPrice);

    if (isNaN(mileageValue) || isNaN(distanceValue) || isNaN(fuelPriceValue)) {
      setResult("Please enter valid numbers");
      return;
    }

    const fuelNeeded = distanceValue / mileageValue;
    setResult(fuelNeeded * fuelPriceValue);
  };

  return (
    <section id="fuelcost">
      <h1>Calculate Your Trip Fuel Cost</h1>
      <form onSubmit={fuelRequired}>
        <div className="formGroup">
          <label htmlFor="millage">Mileage:</label>
          <input
            type="number"
            placeholder="In km"
            id="millage"
            value={millage}
            onChange={(e) => setMillage(e.target.value)}
          />
        </div>

        <div className="formGroup">
          <label htmlFor="distance">Distance:</label>
          <input
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            type="number"
            placeholder="In km"
            id="distance"
          />
        </div>

        <div className="formRate">
          <label>Fuel Price/liter:</label>
          <input
            type="number"
            placeholder="Fuel cost per liter"
            value={fuelPrice}
            onChange={(e) => setFuelPrice(e.target.value)}
          />
        </div>

        <button type="submit">Calculate</button>
      </form>

      <div className="result">
        <h5>
          {result !== null && typeof result === "number"
            ? `Total Cost: ₹${result.toFixed(2)}`
            : result}
        </h5>
      </div>
    </section>
  );
}

