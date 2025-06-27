import { useState } from "react";
import "./aboutUs.css";
import { toast } from "react-toastify";
import api from "../utilities/axios";
import userlogindata from "../utilities/Authstore";

export default function AboutUs() {
  const [feedbackText, setFeedbackText] = useState("");
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = userlogindata();

  const handleFeedbackSubmit = async (event) => {
    event.preventDefault();

    if (!feedbackText.trim()) {
      setSubmissionStatus("Please enter your feedback.");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("api/feedback", {
        name: user?.name,
        email: user?.email,
        message: feedbackText,
      });
      setSubmissionStatus("Thank you for your feedback!");
      setFeedbackText("");
      toast.success("FeedBack Send");
    } catch {
      toast.error("Failed to send feedback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="about">
      <header>
        <h1>About SpendWise</h1>
        <p>
          SpendWise is a smart, intuitive, and collaborative expense tracker
          built to simplify personal finance management. Whether you're tracking
          daily expenditures like food, travel, fuel, or managing shared
          expenses with friends, SpendWise provides a powerful, centralized
          platform to keep everything organized and accessible. With real-time
          insights, visual reports, and advanced filtering options, users gain a
          clear picture of their spending habits and can make smarter financial
          decisions.
        </p>
        <p>
          Designed with a clean interface and seamless user experience,
          SpendWise offers features such as friend-based expense sharing, UPI
          integration, lending and borrowing management, customizable limits,
          fuel cost calculators, and weekly email summaries—all tailored to meet
          your financial goals.
        </p>
      </header>

      <section>
        <h2>Our Mission</h2>
        <p>
          At SpendWise, our mission is to empower individuals to take control of
          their finances with confidence and clarity. We understand that
          managing money can be overwhelming, especially when dealing with
          shared expenses or tracking small, frequent transactions. That’s why
          we’ve created a platform that goes beyond basic tracking—bringing
          together collaboration, automation, and insights into one cohesive
          ecosystem.
        </p>
        <p>
          Our goal is to eliminate the stress of expense tracking by offering a
          tool that is both powerful and easy to use. From students managing a
          monthly allowance to working professionals splitting bills with
          friends or roommates, SpendWise adapts to every lifestyle and budget.
          Backed by modern web technologies, our solution ensures security,
          reliability, and a responsive experience across devices.
        </p>
      </section>

      <section className="feedback-section">
        <h2>Feedback</h2>
        <form onSubmit={handleFeedbackSubmit} className="feedback-form">
          <textarea
            placeholder="We'd love to hear your thoughts..."
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            rows={5}
            required
            aria-label="Feedback text area"
          />
          <button type="submit" disabled={loading} className="submit-button">
            {loading ? "Sending..." : "Submit Feedback"}
          </button>
        </form>

        {submissionStatus && (
          <p className="status-message">{submissionStatus}</p>
        )}
      </section>
    </section>
  );
}
