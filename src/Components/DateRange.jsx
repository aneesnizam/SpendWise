import React, { useEffect, useState } from "react";
import "./daterange.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from "../utilities/axios";

export default function DateRange() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startCost, setStartCost] = useState();
  const [endCost, setEndCost] = useState();
  const [sortingOne, setSortingOne] = useState("cost");
  const [sortingtwo, setSortingTwo] = useState("asc");
  const [total, setTotal] = useState("");
  const [count, setCount] = useState();
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [groupByCategory,setGroupByCategory] = useState(false)
  const[categoryExpense,setCategoryExpenses] = useState([])

  const DateDisplay = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const handleStartDate = (date) => {
    if (!date || isNaN(date.getTime())) return;
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    setStartDate(`${yyyy}-${mm}-${dd}`);
  };

  const handleEndDate = (date) => {
    if (!date || isNaN(date.getTime())) return;
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    setEndDate(`${yyyy}-${mm}-${dd}`);
  };

  useEffect(() => {
    api.get(`api/expenses`)
      .then((res) => {
        setCategories(res.data.expenses);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleSubmit = () => {
    setLoading(true);
    const params = new URLSearchParams();
    
    if (startDate && endDate) {
      params.append('startDate', startDate);
      params.append('endDate', endDate);
    }
    if (startCost && endCost) {
      params.append('minAmount', startCost);
      params.append('maxAmount', endCost);
    }
    if (selectedCategory) {
      params.append('category', selectedCategory);
    }

    api.get(`api/expenses/filter?${params.toString()}`)
      .then((res) => {
        setTotal(res.data.total);
        setCount(res.data.cost);
        setFilteredItems(res.data.expenses);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });

      if(groupByCategory){
 
        api.get("api/expenses/filter?groupByCategory=true")
        .then((res) => {
          setCategoryExpenses(res.data.expenses)
        })
}
  };

  // Apply sorting
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortingOne === 'cost') {
      return sortingtwo === 'asc' ? a.amount - b.amount : b.amount - a.amount;
    } else if (sortingOne === 'date') {
      return sortingtwo === 'asc' 
        ? new Date(a.date) - new Date(b.date) 
        : new Date(b.date) - new Date(a.date);
    }
    return 0;
  });

  return (
    <section id="data-box">
      <div className="form-section">
        <div className="form-left">
          <div className="top-container">
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All categories</option>
              {[...new Set(categories.map(item => item.category))].map((category) => (
                <option value={category} key={category}>{category}</option>
              ))}
            </select>

            <DatePicker
              selected={startDate ? new Date(startDate) : null}
              onChange={handleStartDate}
              dateFormat="dd/MM/yyyy"
              placeholderText="Start date"
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
            />
            
            <DatePicker
              selected={endDate ? new Date(endDate) : null}
              onChange={handleEndDate}
              dateFormat="dd/MM/yyyy"
              placeholderText="End date"
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
            />
            
            <input 
              type="number" 
              style={{width:"100px",marginLeft:"20px"}} 
              placeholder="Min cost"
              onChange={(e) => setStartCost(e.target.value)}
            />
            
            <input 
              type="number" 
              style={{width:"100px",marginLeft:"10px"}} 
              placeholder="Max cost"
              onChange={(e) => setEndCost(e.target.value)}
            />

            <select 
              value={sortingOne}
              onChange={(e) => setSortingOne(e.target.value)}
            >
              <option value="cost">Cost</option>
              <option value="date">Date</option>
            </select>
            
            <select 
              value={sortingtwo}
              onChange={(e) => setSortingTwo(e.target.value)}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
        <div className="history-section">
          <div className="top">
<input type="checkbox" checked={groupByCategory} onChange={(e) => setGroupByCategory(e.target.checked)} /><label htmlFor="">group by categories</label>

            <button onClick={handleSubmit} disabled={loading}>
              {loading ? 'Loading...' : 'Submit'}
            </button>   
          </div>
        </div>
      </div>
      
      <div className="history-section">
        {loading ? (
          <p style={{ margin: "20px", textAlign: "center" }}>Loading...</p>
        ) : sortedItems.length > 0 ? (
          <ul>
            {sortedItems.map(data => (
              <li key={data._id}>
                <div className="entry-card">
                  <div className="entry-header">
                    <div className="entry-row">
                      <p>{data.category}:</p>
                      <span>{data.amount}</span>
                    </div>
                    <p>{DateDisplay(data.date)}</p>
                  </div>
                  <div className="entry-footer">
                    <p>{data.title}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ margin: "20px", textAlign: "center" }}>
            No results yet. Apply any filter and click submit.
          </p>
        )}
      </div>
    </section>
  );
}