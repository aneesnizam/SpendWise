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
    borrowLend: true,
  });

  // Defensive totals calculation to avoid crashes
  const totals = React.useMemo(() => {
    return borrowLendData.reduce(
      (acc, entry) => {
        if (!entry) return acc;
        const type = entry.type?.toLowerCase();
        const status = entry.status?.toLowerCase();
        const amount = Number(entry.amount) || 0;

        if (type && acc[type] && status && acc[type][status] !== undefined) {
          acc[type][status] += amount;
        }
        return acc;
      },
      {
        lend: { pending: 0, settled: 0 },
        borrow: { pending: 0, settled: 0 },
      }
    );
  }, [borrowLendData]);

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

  // Helper: Get start and end of the current week (Monday to Sunday)
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

    return { monday, sunday };
  };

  // Fetch expenses and prepare weekly chart
  useEffect(() => {
    let isMounted = true; // cleanup flag to avoid state updates on unmounted component
    async function fetchExpenses() {
      try {
        setLoading((prev) => ({ ...prev, expenses: true }));

        const expensesRes = await api.get("api/expenses/");
        const rawExpenses = Array.isArray(expensesRes.data.expenses)
          ? expensesRes.data.expenses
          : [];

        if (!isMounted) return;

        let amount = 0;
        let count = 0;
        const dates = [];

        rawExpenses.forEach((item) => {
          if (!item) return;
          amount += Number(item.amount) || 0;
          count += 1;
          if (item.date) {
            dates.push(item.date.split("T")[0]);
          }
        });

        setDaysCount(new Set(dates).size);
        setTotal(Math.round(amount));
        setCount(count);

        const { monday, sunday } = getWeekRange();
        const totalsByDay = new Array(7).fill(0);

        rawExpenses.forEach((item) => {
          if (!item?.date) return;
          const date = new Date(item.date);
          // Convert to local date ignoring time for safer comparison
          const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
          if (localDate >= monday && localDate <= sunday) {
            let jsDay = localDate.getDay();
            let index = jsDay === 0 ? 6 : jsDay - 1;
            totalsByDay[index] += Number(item.amount) || 0;
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
      } catch (error) {
        if (isMounted) {
          console.error("Error fetching expenses:", error);
          toast.error("Failed to load expenses data");
        }
      } finally {
        if (isMounted) {
          setLoading((prev) => ({ ...prev, expenses: false }));
        }
      }
    }
    fetchExpenses();

    return () => {
      isMounted = false;
    };
  }, [limit]);

  // Fetch category data
  useEffect(() => {
    let isMounted = true;
    async function fetchCategoryInsight() {
      try {
        setLoading((prev) => ({ ...prev, categories: true }));
        const res = await api.get("api/expenses/filter?groupByCategory=true");
        const expenses = Array.isArray(res.data.expenses) ? res.data.expenses : [];

        if (!isMounted) return;

        const grouped = expenses.reduce((acc, item) => {
          if (!item) return acc;
          const cat = item.category || "Uncategorized";
          if (!acc[cat]) acc[cat] = { category: cat, amount: 0, count: 0 };
          acc[cat].amount += Number(item.amount) || 0;
          acc[cat].count += 1;
          return acc;
        }, {});

        const categoryData = Object.values(grouped);
        setCategoryInsight(categoryData);
        setCategoryCount(categoryData.length);
      } catch (error) {
        if (isMounted) {
          console.error("Error fetching category insight:", error);
          toast.error("Failed to load category data");
        }
      } finally {
        if (isMounted) {
          setLoading((prev) => ({ ...prev, categories: false }));
        }
      }
    }

    fetchCategoryInsight();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch borrow/lend data
  useEffect(() => {
    let isMounted = true;
    async function fetchBorrowLendData() {
      try {
        setLoading((prev) => ({ ...prev, borrowLend: true }));
        const res = await api.get("api/borrowlend");
        if (!isMounted) return;
        setBorrowLendData(Array.isArray(res.data.transactions) ? res.data.transactions : []);
      } catch (error) {
        if (isMounted) {
          console.error("Failed to fetch borrow/lend entries:", error);
          toast.error("Failed to load borrow/lend data");
        }
      } finally {
        if (isMounted) {
          setLoading((prev) => ({ ...prev, borrowLend: false }));
        }
      }
    }

    fetchBorrowLendData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Update limit when user changes
  useEffect(() => {
    if (user?.dailyLimit && !isNaN(user.dailyLimit)) {
      setLimit(Number(user.dailyLimit));
    }
  }, [user]);

  return (
    <section id="insight" style={{ padding: "10px" }}>
      <h1>Dashboard Insights</h1>

      <div className="insight__top" style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        <div className="insight__box" style={{ flex: "1 1 120px", minWidth: "120px" }}>
          <h3><Target target={total} /></h3>
          <p>Total Spend</p>
        </div>
        <div className="insight__box" style={{ flex: "1 1 120px", minWidth: "120px" }}>
          <h3><Target target={count} /></h3>
          <p>Transactions</p>
        </div>
        <div className="insight__box" style={{ flex: "1 1 120px", minWidth: "120px" }}>
          <h3><Target target={categoryCount} /></h3>
          <p>Categories</p>
        </div>
        <div className="insight__box" style={{ flex: "1 1 120px", minWidth: "120px" }}>
          <h3><Target target={daysCount} /></h3>
          <p>Days Tracked</p>
        </div>
      </div>

      <div className="insight__middle" style={{ marginTop: "30px" }}>
        <div className="linechart" style={{ maxWidth: "100%", height: "300px" }}>
          {loading.expenses ? (
            <div className="loading-message">Loading expense data...</div>
          ) : chartData ? (
            <Line
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                  duration: 1000,
                  easing: "easeInOutQuad",
                  animateRotate: true,
                  animateScale: true,
                },
                plugins: {
                  legend: { position: "top" },
                  title: { display: true, text: "Expenses by Weekdays" },
                },
                scales: {
                  y: { beginAtZero: true },
                },
              }}
            />
          ) : (
            <div>No data available</div>
          )}
        </div>
      </div>

      <div className="insight__bottom" style={{ marginTop: "40px", display: "flex", flexWrap: "wrap" }}>
        <div className="insight__chart" >
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
                  legend: { position: "top" },
                  tooltip: {
                    callbacks: {
                      label: (context) =>
                        `₹ ${context.parsed.y.toLocaleString("en-IN")}`,
                    },
                  },
                  title: { display: true, text: "Lend vs Borrow Summary" },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: (value) => `₹${value}`,
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

        <div className="insight__chart" >
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
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: "bottom" },
                  title: { display: true, text: "Spending by Category" },
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
    </section>
  );
}
