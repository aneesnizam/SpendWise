import React, { useState } from "react";
import "./Landing.css";
import { useNavigate } from "react-router-dom";
import Footer from "../../utilities/Footer"

export default function Landing() {
    const navigate = useNavigate()
  const [visibleIndex, setVisibleIndex] = useState(null);
  
  const features = [
    {
      title: "Smart Expense Tracking",
      description: "Easily record and categorize your daily expenses with intuitive controls.",
      icon: "📊"
    },
    {
      title: "Real-time Insights",
      description: "Visual reports and analytics to understand your spending patterns.",
      icon: "📈"
    },
    {
      title: "Shared Expenses",
      description: "Split bills with friends and track who owes what.",
      icon: "👥"
    },
    {
      title: "Personalized Budgets",
      description: "Set daily/weekly limits and get alerts when you're close to exceeding them.",
      icon: "💰"
    }
  ];

  const sampleExpenses = [
    { category: "Food", amount: "₹350", time: "12:30 PM", icon: "🍔" },
    { category: "Transport", amount: "₹120", time: "8:45 AM", icon: "🚕" },
    { category: "Shopping", amount: "₹2,500", time: "Yesterday", icon: "🛍️" },
    { category: "Entertainment", amount: "₹800", time: "Yesterday", icon: "🎬" }
  ];
const handlelick = () =>{
    navigate("/login")
}
  return (
    <div className="landing-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Take Control of Your Finances with <span>SpendWise</span></h1>
          <p>Smart expense tracking made simple. Know where your money goes and make better spending decisions.</p>
          <div className="cta-buttons">
            <button className="primary-btn" onClick={handlelick}>Get Started</button>
            {/* <button className="secondary-btn">Watch Demo</button> */}
          </div>
        </div>
        <div className="hero-image">
          <div className="phone-mockup">
            <div className="screen">
              <div className="app-header">
                <h3>SpendWise</h3>
                <span>Today</span>
              </div>
              <div className="expense-list">
                {sampleExpenses.map((expense, index) => (
                  <div key={index} className="expense-item">
                    <div className="expense-icon">{expense.icon}</div>
                    <div className="expense-details">
                      <div className="expense-category">{expense.category}</div>
                      <div className="expense-time">{expense.time}</div>
                    </div>
                    <div className="expense-amount">{expense.amount}</div>
                  </div>
                ))}
              </div>
              <div className="add-expense-btn">+</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>Why Choose SpendWise?</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stat-item">
          <h3>10,000+</h3>
          <p>Active Users</p>
        </div>
        <div className="stat-item">
          <h3>₹50M+</h3>
          <p>Tracked Monthly</p>
        </div>
        <div className="stat-item">
          <h3>4.8 ★</h3>
          <p>User Rating</p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <h2>What Our Users Say</h2>
        <div className="testimonial-cards">
          <div className="testimonial-card">
            <p>"SpendWise helped me save 30% on my monthly expenses in just two months!"</p>
            <div className="author">- Shalo Sajan</div>
          </div>
          <div className="testimonial-card">
            <p>"The split bill feature is a game-changer for group outings with friends."</p>
            <div className="author">- Sreerag A</div>
          </div>
        </div>
      </section>
      <Footer/>
    </div>
  );
}