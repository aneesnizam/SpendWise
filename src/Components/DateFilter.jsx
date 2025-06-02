import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./DateFilter.css";
import api from "../utilities/axios";
import userlogindata from "./Authstore";

export default function DateFilter() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [fetchedData, setFetchedData] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [highlightDates, setHighlightDates] = useState([]);
  const [dateString, setDateString] = useState('');
  const { setCurrentView } = userlogindata();

  // Fetch highlight dates
  useEffect(() => {
    api.get("api/expenses")
      .then((res) => {
        const uniqueDates = [
          ...new Set(
            res.data.expenses.map((item) => {
              const d = new Date(item.date);
              return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
            })
          ),
        ].map((time) => new Date(time));
        setHighlightDates(uniqueDates);
      })
      .catch(console.error);
  }, []);

  // Handle manual date input
  // const handleManualDateChange = (e) => {
  //   const value = e.target.value;
  //   setDateString(value);
    
  //   // Parse DD/MM/YYYY format
  //   if (value.length === 10) {
  //     const parts = value.split('/');
  //     if (parts.length === 3) {
  //       const day = parseInt(parts[0], 10);
  //       const month = parseInt(parts[1], 10) - 1;
  //       const year = parseInt(parts[2], 10);
        
  //       if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
  //         const parsedDate = new Date(year, month, day);
  //         if (!isNaN(parsedDate.getTime())) {
  //           handleDateSelection(parsedDate);
  //         }
  //       }
  //     }
  //   }
  // };



  // Handle date selection (from calendar or manual input)
  const handleDateSelection = (date) => {
    if (!date || isNaN(date.getTime())) return;
    
    const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    setSelectedDate(normalizedDate);
    setDateString(formatToDDMMYYYY(normalizedDate));

    const formatDate = (d) => {
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    };

    api.get(`api/expenses/filter?date=${formatDate(normalizedDate)}`)
      .then((res) => {
        setFetchedData(res.data.expenses);
        setTotalCost(res.data.total);
      })
      .catch(console.error);
  };

  // Format date to DD/MM/YYYY string
  const formatToDDMMYYYY = (date) => {
    if (!date) return '';
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  // Date display formatting
  const DateDisplay = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <section id="date-filter">
         <form className="selector">
          <select onChange={(e) => setCurrentView(e.target.value)}>
            <option value="filterByDate">Date Only Filter</option>
            <option value="dateRange">Advanced Filter </option>
          </select>
        </form>
      <div className="form-section">
     
        <div className="form-left">
          <div className="date-input-container">
            <DatePicker
              selected={selectedDate}
              onChange={handleDateSelection}
              dateFormat="dd/MM/yyyy"
              placeholderText="Select date"
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              highlightDates={[
                {
                  className: "custom-highlight",
                  dates: highlightDates,
                },
              ]}
              dayClassName={(date) => {
                const isHighlighted = highlightDates.some(
                  (highlightDate) =>
                    highlightDate.getDate() === date.getDate() &&
                    highlightDate.getMonth() === date.getMonth() &&
                    highlightDate.getFullYear() === date.getFullYear()
                );
                return isHighlighted ? "custom-highlight" : undefined;
              }}
            />
          </div>
        </div>

        <div className="form-right">
          <div className="info-block">
            <h4>Total cost: <span>₹ {totalCost}</span> </h4>
          </div>
        </div>
      </div>

      <div className="history-section">
        <ul>
          {[...fetchedData]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map((data) => (
              <li key={data._id} className={`history-item ${data.category.toLowerCase()}`}>
                <div className="entry-card">
                  <div className="entry-header">
                    <div className="entry-details">
                      <p className={`category-tag ${data.category.toLowerCase()}`}>{data.category}:</p>
                      <span>₹{data.amount}</span>
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
      </div>
    </section>
  );
}
