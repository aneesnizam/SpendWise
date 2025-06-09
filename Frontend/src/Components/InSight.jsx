import React, { useEffect, useState } from "react";
import "./InSight.css";
import { Chart as ChartJS } from "chart.js/auto";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import api from "../utilities/axios";
import userlogindata from "./Authstore";
import Target from "../utilities/Target";
import { toast } from "react-toastify";

export default function InSight() {
  const weekdayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const [chartData, setChartData] = useState(null);
  const [categoryInsight, setCategoryInsight] = useState([]);
  const [limit, setLimit] = useState(0);
  const { user } = userlogindata();
  const [total, setTotal] = useState(0);
  const [count, setCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [daysCount, setDaysCount] = useState(0);
  const [borrowLendData, setBorrowLendData] = useState([]);
  const [loading, setLoading] = useState({
    expenses: true,
    categories: true,
    borrowLend: true
  });

  // Calculate totals for borrow/lend data
  const totals = borrowLendData.reduce((acc, entry) => {
    const type = entry.type?.toLowerCase();
    const status = entry.status?.toLowerCase();
    const amount = Number(entry.amount) || 0;

    if (acc[type] && acc[type][status] !== undefined) {
      acc[type][status] += amount;
    }
    return acc;
  }, {
    lend: { pending: 0, settled: 0 },
    borrow: { pending: 0, settled: 0 }
  });

  const chartColors = [
    "rgba(22, 163, 74, 0.8)",
    "rgba(37, 99, 235, 0.8)",
    "rgba(220, 38, 38, 0.8)",
    "rgba(217, 119, 6, 0.8)",
    "rgba(124, 58, 237, 0.8)",
    "rgba(5, 150, 105, 0.8)",
    "rgba(2, 132, 199, 0.8)",
    "rgba(202, 138, 4, 0.8)",
    "rgba(185, 28, 28, 0.8)",
    "rgba(14, 165, 233, 0.8)",
    "rgba(192, 38, 211, 0.8)",
    "rgba(16, 185, 129, 0.8)",
    "rgba(234, 179, 8, 0.8)",
    "rgba(51, 65, 85, 0.8)",
    "rgba(234, 88, 12, 0.8)",
    "rgba(127, 29, 29, 0.8)",
    "rgba(75, 85, 99, 0.8)",
  ];

  const getWeekRange = () => {
    const now = new Date();
    const day = now.getDay(); // Sunday = 0
    const diffToMonday = (day === 0 ? -6 : 1) - day;

    const monday = new Date(now);
    monday.setDate(now.getDate() + diffToMonday);
    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    return {
      monday: new Date(
        monday.getFullYear(),
        monday.getMonth(),
        monday.getDate()
      ),
      sunday: new Date(
        sunday.getFullYear(),
        sunday.getMonth(),
        sunday.getDate()
      ),
    };
  };

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch expenses data
        const expensesRes = await api.get("api/expenses/");
        const rawExpenses = expensesRes.data.expenses || [];
        
        // Calculate totals
        let amount = 0;
        let count = 0;
        const dates = [];
        
        rawExpenses.forEach((item) => {
          amount += item.amount;
          count += 1;
          dates.push(item.date.split("T")[0]);
        });

        const spendDays = new Set(dates);
        setDaysCount(spendDays.size);
        setTotal(Math.round(amount));
        setCount(count);

        // Prepare weekly chart data
        const { monday, sunday } = getWeekRange();
        const totalsByDay = Array(7).fill(0);

        rawExpenses.forEach((item) => {
          const date = new Date(item.date);
          const utcDate = new Date(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCDate()
          );

          if (utcDate >= monday && utcDate <= sunday) {
            let jsDay = utcDate.getDay();
            let index = jsDay === 0 ? 6 : jsDay - 1;
            totalsByDay[index] += item.amount;
          }
        });

        setChartData({
          labels: weekdayNames,
          datasets: [
            {
              label: "Weekly Expense",
              data: totalsByDay,
              borderColor: "rgba(255, 99, 132, 1)",
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              tension: 0.3,
            },
            {
              label: "Limit",
              data: Array(7).fill(limit),
              borderColor: "rgb(99, 255, 125)",
              backgroundColor: "rgba(220, 235, 157, 0.2)",
            },
          ],
        });

        setLoading(prev => ({ ...prev, expenses: false }));
      } catch (err) {
        console.error("Error fetching expenses data:", err);
        toast.error("Failed to load expenses data");
        setLoading(prev => ({ ...prev, expenses: false }));
      }
    };

    fetchData();
  }, [limit]);

  // Fetch category data
  useEffect(() => {
    const fetchCategoryInsight = async () => {
      try {
        const res = await api.get("api/expenses/filter?groupByCategory=true");
        const grouped = (res.data.expenses || []).reduce((acc, item) => {
          const { category, amount } = item;
          if (!acc[category]) {
            acc[category] = { category, amount: 0, count: 0 };
          }
          acc[category].amount += amount;
          acc[category].count += 1;
          return acc;
        }, {});

        const categoryData = Object.values(grouped);
        setCategoryInsight(categoryData);
        setCategoryCount(categoryData.length);
        setLoading(prev => ({ ...prev, categories: false }));
      } catch (err) {
        console.error("Error fetching category insight:", err);
        toast.error("Failed to load category data");
        setLoading(prev => ({ ...prev, categories: false }));
      }
    };

    fetchCategoryInsight();
  }, []);

  // Fetch borrow/lend data
  useEffect(() => {
    const fetchBorrowLendData = async () => {
      try {
        const res = await api.get("api/borrowlend");
        setBorrowLendData(res.data.transactions || []);
        setLoading(prev => ({ ...prev, borrowLend: false }));
      } catch (err) {
        console.error("Failed to fetch borrow/lend entries", err);
        toast.error("Failed to load borrow/lend data");
        setLoading(prev => ({ ...prev, borrowLend: false }));
      }
    };

    fetchBorrowLendData();
  }, []);

  // Set limit when user data changes
  useEffect(() => {
    if (user?.dailyLimit) {
      setLimit(user.dailyLimit);
    }
  }, [user]);

  return (
    <section id="insight">
      <h1>Dashboard Insights</h1>
      
      <div className="insight__top">
        <div className="insight__box">
          <h3><Target target={total} /></h3>
          <p>Total Spend</p>
        </div>
        <div className="insight__box">
          <h3><Target target={count} /></h3>
          <p>Transactions</p>
        </div>
        <div className="insight__box">
          <h3><Target target={categoryCount} /></h3>
          <p>Categories</p>
        </div>
        <div className="insight__box">
          <h3><Target target={daysCount} /></h3>
          <p>Days Tracked</p>
        </div>
      </div>

      <div className="insight__middle" style={{ height: "auto", padding: "5px" }}>
        <div className="linechart">
          {loading.expenses ? (
            <div className="loading-message">Loading expense data...</div>
          ) : (
            <Line
              data={chartData}
              options={{
                responsive: true,
                animation: {
                  duration: 2000,
                  easing: 'easeInOutQuad',
                  animateRotate: true,
                  animateScale: true,
                },
                plugins: {
                  legend: { position: "top" },
                  title: { display: true, text: "Expenses by Weekdays" },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          ) }
        </div>
      </div>

      <div className="insight__bottom">
        <div className="insight__chart" style={{ height: "auto", padding: "20px" }}>
          <div className="chartbar" style={{ position: 'relative', height: '300px' }}>
            {loading.borrowLend ? (
              <div className="loading-message">Loading borrow/lend data...</div>
            ) : borrowLendData.length > 0 ? (
              <Bar
                data={{
                  labels: ["Lend", "Borrow"],
                  datasets: [
                    {
                      label: "Pending Amount",
                      data: [totals.lend.pending, totals.borrow.pending],
                      backgroundColor: "#e57373",
                    },
                    {
                      label: "Settled Amount",
                      data: [totals.lend.settled, totals.borrow.settled],
                      backgroundColor: "#81c784",
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "top",
                    },
                    tooltip: {
                      callbacks: {
                        label: function (context) {
                          return `₹ ${context.parsed.y.toLocaleString("en-IN")}`;
                        },
                      },
                    },
                    title: {
                      display: true,
                      text: "Lend vs Borrow Summary",
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: function (value) {
                          return `₹${value}`;
                        },
                      },
                    },
                  },
                }}
              />
            ) : (
              <div className="no-data-message">
                <p>No lend/borrow data available</p>
              </div>
            )}
          </div>
        </div>

        <div className="insight__chart" style={{ height: "auto" }}>
          <div className="chartround" style={{ position: 'relative', height: '300px' }}>
            {loading.categories ? (
              <div className="loading-message">Loading category data...</div>
            ) : categoryInsight.length > 0 ? (
              <Doughnut
                data={{
                  labels: categoryInsight.map((item) => item.category),
                  datasets: [
                    {
                      label: "Category Distribution",
                      data: categoryInsight.map((item) => item.amount),
                      backgroundColor: chartColors,
                      borderColor: chartColors,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: "bottom",
                    },
                    title: {
                      display: true,
                      text: "Spending by Category",
                    },
                  },
                }}
              />
            ) : (
              <div className="no-data-message">
                <p>No category data available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}