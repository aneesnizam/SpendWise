import React, { useEffect, useState } from "react";
import "./InSight.css";
import { Chart as ChartJS } from "chart.js/auto";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import api from "../utilities/axios";
import userlogindata from "./Authstore";
import Target from "../utilities/Target";

export default function InSight() {
  const weekdayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const [chartData, setChartData] = useState(null);
  const [categoryInsight, setCategoryInsight] = useState([]);
  const [limit, setLimit] = useState(0);
  const { user } = userlogindata();
  const [total, setTotal] = useState(0);
  const [count, setCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const[daysCount,setDaysCount] = useState(0)
  const[data,setData] = useState()



  const fetchDataa = async () => {

    try {
      const res = await api.get("api/borrowlend");
      setData(res.data.transactions || []);
      console.log(res.data.transactions)
    } catch (err) {
      toast.error("Failed to fetch entries");
      console.error(err);
    } 
  };

  useEffect(() => {
    fetchDataa();
  }, []);

 const totals = {
    lend: { pending: 0, settled: 0 },
    borrow: { pending: 0, settled: 0 },
  };
 (data || []).forEach((entry) => {
  const type = entry.type?.toLowerCase(); // "lend" or "borrow"
    const status = entry.status?.toLowerCase(); // "pending" or "settled"
    const amount = Number(entry.amount) || 0;

    if(totals[type] && totals[type][status] !== undefined){
      totals[type][status] += amount
    }

    
 })
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

  // Set limit when user data changes
  useEffect(() => {
    if (user?.dailyLimit) {
      setLimit(user.dailyLimit);
    }
  }, [user]);

  useEffect(() => {
    const fetchCategoryInsight = async () => {
      try {
        const res = await api.get("api/expenses/filter?groupByCategory=true");


        const grouped = res.data.expenses.reduce((acc, item) => {
          const { category, amount } = item;
          if (!acc[category]) {
            acc[category] = { category, amount: 0, count: 0 };
          }
          acc[category].amount += amount;
          acc[category].count += 1;
          return acc;
        }, {});
        setCategoryInsight(Object.values(grouped));
      } catch (err) {
        console.error("Error fetching category insight:", err);
      }
    };

    fetchCategoryInsight();
  }, []);

  useEffect(() => {
    const fetchWeekChartData = async () => {
      try {
        const res = await api.get("api/expenses/");
      
        const rawExpenses = res.data.expenses;
        let amount = 0;
        let count = 0;
        let dates = []
        res.data.expenses.forEach((item) => {
          amount += item.amount;
          count += 1;
          dates.push(item.date.split("T")[0])
      })


      const spendDays = new Set(dates)
setDaysCount(spendDays.size)


        setTotal(Math.round(amount));
        setCount(count);
        const { monday, sunday } = getWeekRange();
        const totalsByDay = Array(7).fill(0);

        rawExpenses.forEach((item) => {
          const date = new Date(item.date); //console here
          // Normalize date to ignore time zone issues
          const utcDate = new Date(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCDate()
          );

          if (utcDate >= monday && utcDate <= sunday) {
            let jsDay = utcDate.getDay(); // Sunday = 0
            let index = jsDay === 0 ? 6 : jsDay - 1; // Monday = 0
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
              // dashed line for limit
            },
          ],
        });
      } catch (err) {
        console.error("Error fetching chart data:", err);
      }
    };

    fetchWeekChartData();
  }, [limit]);
  useEffect(() => {
    let catTotal = categoryInsight.length;
    setCategoryCount(catTotal);
  }, [categoryInsight]);
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
  return (
    <section id="insight">
      <h1>Dashboard Insights</h1>
      <div className="insight__top">
        <div className="insight__box">
          <h3><Target target={total} /></h3>
          <p>Total Spend</p>
        </div>
        <div className="insight__box">
          <h3> <Target target={count} /></h3>
          <p>Transactions</p>
        </div>
        <div className="insight__box">
          <h3> <Target target={categoryCount} /></h3>
          <p>Categories</p>
        </div>
        <div className="insight__box">
          <h3> <Target target={daysCount} /> </h3>
          <p>Days Tracked</p>
        </div>
      </div>

      <div className="insight__middle" style={{height:"auto",padding:"5px"}}>
        <div className="linechart"  >
          {" "}
          {chartData && (
         <Line
  data={chartData}
  options={{
    responsive: true,
    animation: {
      duration: 2000,
      easing: 'easeInOutQuad',
      // Optional: animate on update
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

          )}
        </div>
      </div>

      <div className="insight__bottom">
        <div className="insight__chart " style={{height:"auto",padding:"20px"}}>
          <div className="chartbar" style={{ position: 'relative', height: '300px' }}>
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
      maintainAspectRatio: false, // Add this line
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

          </div>
        </div>

        <div className="insight__chart" style={{height:"auto"}}>
          <div className="chartround" style={{ position: 'relative', height: '300px' }}>
            {" "}
            
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
                
              }
            
            }
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
          </div>
        </div>
      </div>
    </section>
  );
}
