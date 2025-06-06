import React, { useEffect, useState } from "react";
import "./FilterPanel.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from "../utilities/axios";
import userlogindata from "./Authstore";
import Target from "../utilities/Target";

export default function FilterPanel() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startCost, setStartCost] = useState();
  const [endCost, setEndCost] = useState();
  const [sortField, setSortField] = useState("cost");
  const [sortOrder, setSortOrder] = useState("asc");
  const [total, setTotal] = useState(0);
  const [count, setCount] = useState(0);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [groupByCategory, setGroupByCategory] = useState(true);
  const [categoryExpenses, setCategoryExpenses] = useState([]);

const {
   setCurrentView,currentView
} = userlogindata()

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // Reset on group toggle
  useEffect(() => {
    setFilteredItems([]);
    setCategoryExpenses([]);
    setTotal(0);
    setCount(0);
  }, [groupByCategory]);

  const handleStartDate = (date) => {
    if (!date || isNaN(date.getTime())) return;
    setStartDate(date.toISOString().split("T")[0]);
  };

  const handleEndDate = (date) => {
    if (!date || isNaN(date.getTime())) return;
    setEndDate(date.toISOString().split("T")[0]);
  };

  // Fetch categories on mount
  useEffect(() => {
    api
      .get("api/expenses")
      .then((res) => setCategories(res.data.expenses))
      .catch(console.error);
  }, []);

  const handleSubmit = () => {
    setLoading(true);
    const params = new URLSearchParams();

    if (groupByCategory) params.append("groupByCategory", true);
    if (startDate && endDate) {
      params.append("startDate", startDate);
      params.append("endDate", endDate);
    }
    if (startCost && endCost) {
      params.append("minAmount", Number(startCost));
      params.append("maxAmount", Number(endCost));
    }
    if (selectedCategory) params.append("category", selectedCategory);

    api
      .get(`api/expenses/filter?${params.toString()}`)
      .then((res) => {
        if (groupByCategory) {
          const grouped = res.data.expenses.reduce((acc, item) => {
            const { category, amount } = item;
            if (!acc[category]) {
              acc[category] = { category, amount: 0, count: 0 };
            }
            acc[category].amount += amount;
            acc[category].count += 1;
            return acc;
          }, {});
          setCategoryExpenses(Object.values(grouped));
        } else {
          setFilteredItems(res.data.expenses);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  // Sort filtered items by selected field and order
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortField === "cost") {
      return sortOrder === "asc" ? a.amount - b.amount : b.amount - a.amount;
    } else if (sortField === "date") {
      return sortOrder === "asc"
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date);
    }
    return 0;
  });

  // Update total and count when data changes
  useEffect(() => {
    if (groupByCategory) {
      const totalAmount = categoryExpenses.reduce(
        (sum, item) => sum + item.amount,
        0
      );
      const totalCount = categoryExpenses.length;
      setTotal(totalAmount);
      setCount(totalCount);
    } else {
      const totalAmount = sortedItems.reduce(
        (sum, item) => sum + item.amount,
        0
      );
      const totalCount = sortedItems.length;
      setTotal(totalAmount);
      setCount(totalCount);
    }
  }, [categoryExpenses, sortedItems, groupByCategory]);


const sortedCtegory = [...categoryExpenses].sort((a,b) => {
  return sortOrder === "asc" ? a.amount - b.amount : b.amount - a.amount;
})

  return (
    <section id="filter-panel">
      <form className="filter-form" onSubmit={(e) => e.preventDefault()}>
        <div className="top">
           <div className="selector">
          <select value={ currentView } onChange={(e) => setCurrentView(e.target.value)}>
            <option value="filterByDate">Date Only Filter</option>
            <option value="dateRange">Advanced Filter </option>
          </select>
        </div>
          <h2 className="historyheading">Advanced Filter</h2>
          <header className="summary">
            <h3>
              Total: <span> <Target  target={total}/></span>
            </h3>
            <h3>
              Count: <span>{count}</span>
            </h3>
          </header>
        </div>

        <div className="filters">
          <select
            className="categoryselector"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            aria-label="Select Category"
          >
            <option value="">All categories</option>
            {[...new Set(categories.map((item) => item.category))].map(
              (category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              )
            )}
          </select>

          <DatePicker
            selected={startDate ? new Date(startDate) : null}
            onChange={handleStartDate}
            dateFormat="dd/MM/yyyy"
            placeholderText="Start date"
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            aria-label="Start Date"
          />

          <DatePicker
            selected={endDate ? new Date(endDate) : null}
            onChange={handleEndDate}
            dateFormat="dd/MM/yyyy"
            placeholderText="End date"
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            aria-label="End Date"
          />

          <input
            type="number"
            placeholder="Min cost"
            onChange={(e) => setStartCost(e.target.value)}
            aria-label="Minimum Cost"
          />

          <input
            type="number"
            placeholder="Max cost"
            onChange={(e) => setEndCost(e.target.value)}
            aria-label="Maximum Cost"
          />

          <select
          disabled={groupByCategory}
            className="categoryselector"
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
            aria-label="Sort Field"
          >
            <option value="cost">Cost</option>
            <option value="date">Date</option>
          </select>

          <select
            className="categoryselector"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            aria-label="Sort Order"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>

        <div className="actions">
          <label>
            <input
              type="checkbox"
              checked={groupByCategory}
              onChange={(e) => setGroupByCategory(e.target.checked)}
            />
            Group by categories
          </label>

          <button type="button" onClick={handleSubmit} disabled={loading}>
            {loading ? "Loading..." : "Submit"}
          </button>
        </div>
      </form>

      <main className="results">
        {loading ? (
          <p className="loading-text">Loading...</p>
        ) : groupByCategory ? (
          sortedCtegory.length ? (
            <ul className="category-list">
              {sortedCtegory.map(({ category, amount, count }, index) => (
                <li
                  key={index}
                  className={`category-item ${category.toLowerCase()}`}
                >
                  <header className="category-header">
                    <p className={`category-tag ${category.toLowerCase()}`}>
                      Category: {category}
                    </p>
                    <p className="categoryTotal">Total: ₹{amount}</p>
                  </header>
                  <footer className="category-footer">
                    <p>No. of entries: {count}</p>
                  </footer>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-results">
              No results yet. Apply any filter and click submit.
            </p>
          )
        ) : sortedItems.length ? (
          <ul className="expense-list">
            {sortedItems.map(({ _id, category, amount, date, title }) => (
              <li
                key={_id}
                className={`history-item ${category.toLowerCase()}`}
              >
                <div className="entry-cards">
                  <header className="entry-headers">
                    <div className="entry-details">
                      <p className={`category-tag ${category.toLowerCase()}`}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}:
                      </p>
                      <span>₹{amount}</span>
                    </div>
                    <p>{title}</p>
                    <p className="date">{formatDate(date)}</p>
                  </header>
                  
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-results">
            No results yet. Apply any filter and click submit.
          </p>
        )}
      </main>
    </section>
  );
}
