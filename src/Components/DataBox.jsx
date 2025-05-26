import React, { useState } from "react";
import "./insert.css";

export default function DataBox() {
  const [foodcost, setFoodcost] = useState("");
  const [vehicle, setVehicle] = useState("Bus");
  const [vehiclecost, setVehiclecost] = useState("");
  const [customcategory, setCustomCategory] = useState("");
  const [categorycost, setCategorycost] = useState("");
  const [history, setHistory] = useState([]);
  const [currency, setCurrency] = useState("₹");
  const [discription, setDiscription] = useState(" ");
  const [error, setError] = useState(" ");
  const [totalcost,setTotalcost] = useState(0)
  const [userlimit,setUserlimit] = useState(100)
  const [dollar,setDollar] = useState()
const rate = 1 / 85.1; // or any latest rate, e.g., 1 / 83.33


  const handleSubmit = (e) => {
    e.preventDefault();

    const newEntries = [];
    const time = new Date().toLocaleTimeString();
    const date = new Date().toLocaleDateString();
    const toINR = (value) => {
      const num = parseFloat(value)
      return currency === "$" ? ( num / rate) : num


    }

    if (foodcost.trim()) {
      newEntries.push({
        category: "Food",
        cost: toINR(foodcost),
        time,
        date,
        discription,
      });
      setError(" ");
    }
    if (vehiclecost.trim()) {
      newEntries.push({
        category: vehicle,
        cost: toINR(vehiclecost),
        time,
        date,
        discription,
      });
      setError(" ");
    }
    if (categorycost.trim()) {
      newEntries.push({
        category: customcategory ? customcategory : "Other",
        cost: toINR(categorycost),
        time,
        date,
        discription,
      });
      setError(" ");
    }
    if (newEntries.length == 0) {
      setError("Fill atleast one input");
      return;
    }
 
    const total = parseFloat(totalcost) + toINR(foodcost || 0) + toINR(categorycost || 0) + toINR(vehiclecost || 0)
       const limit = parseFloat(userlimit) - total
    setHistory([...newEntries, ...history]);
    setCategorycost("");
    setFoodcost("");
    setDiscription("");
    setCustomCategory("");
    setVehiclecost("");
    setVehicle("Bus");
    setTotalcost(total);
    setUserlimit(limit);
  };
  const handleDelete = (index) => {
    const updatedentries = [...history];
    const newtotalcost = totalcost - updatedentries[index]["cost"]
    const newlimit =  userlimit + updatedentries[index]["cost"]
    updatedentries.splice(index, 1);
    setHistory(updatedentries);
    setTotalcost(newtotalcost)
    setUserlimit(newlimit)
  };

  return (
    <section id="data-box">
      <div className="info-block1">
        <form>
          <select
            name="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            <option value="₹">INR</option>
            <option value="$">USD</option>
          </select>
        </form>
      </div>
      <div className="form-section">
        <div className="form-left">
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="">Food</label>
              <input
                type="text"
                value={foodcost}
                onChange={(e) => setFoodcost(e.target.value)}
              />
            </div>

            <div className="input-group">
              <select
                value={vehicle}
                onChange={(e) => setVehicle(e.target.value)}
              >
                <option value="car">Bus</option>
                <option value="bus">Car</option>
                <option value="bike">Bike</option>
              </select>
              <input
                type="text"
                placeholder="Cost"
                value={vehiclecost}
                onChange={(e) => setVehiclecost(e.target.value)}
              />
            </div>

            <h6>Add Custom</h6>

            <div className="input-group">
              <label htmlFor="">Category</label>
              <input 
                type="text"
                value={customcategory}
                onChange={(e) => setCustomCategory(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label htmlFor="">Cost</label>
              <input
                type="text"
                value={categorycost}
                onChange={(e) => setCategorycost(e.target.value)}
              />
            </div>

            <div className="input-group">
              <input
                type="text"
                id="description"
                placeholder="Description (optional)"
                value={discription}
                onChange={(e) => setDiscription(e.target.value)}
              />
            </div>
            <button type="submit">Submit</button>
          </form>
          {error && (
            <h2
              style={{
                color: "red",
                textAlign: "center",
                fontSize: "10px",
                marginTop: "15px",
              }}
            >
              {error}
            </h2>
          )}
        </div>

        <div className="form-right">
          <div className="info-block">
            <h5> <p style={{color: Number(userlimit) > 0 ? "green" : "red"}}>{currency}{ currency == "$" ? (userlimit * rate) .toFixed(2) : userlimit .toFixed(2)}</p><p>remaining</p></h5>
          </div>

          <div className="info-block">
            <h4>Total cost: {currency}{ currency == "$" ? (totalcost * rate) .toFixed(2) : totalcost.toFixed(2)} </h4>
          </div>
        </div>
      </div>

      <div className="history-section">
        <ul>
          {history.map((data, index) => (
            <li key={index}>
              <div className="entry-card">
                <div className="entry-header">
                  <div className="entry-row">
                    <p>{data.category} : </p>
                    <span>
                      {currency}{ currency == "$" ? (data.cost * rate) .toFixed(2) : data.cost.toFixed(2)}
                      
                    </span>
                  </div>
                  <p>{data.time}</p>
                  <p>{data.date}</p>
                  <button onClick={() => handleDelete(index)}>Delete</button>
                </div>
                <div className="entry-footer">
                  <p>{data.discription}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
