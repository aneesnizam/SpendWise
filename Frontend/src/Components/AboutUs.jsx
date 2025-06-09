import { useState } from "react";
import "./aboutUs.css";
import { toast } from "react-toastify";
import api from "../utilities/axios";
import userlogindata from "./Authstore";

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
          SpendWise is a simple yet powerful daily expense tracker designed to
          help you monitor, manage, and optimize your spending habits
          effortlessly. Whether it's travel, food, or miscellaneous expenses,
          SpendWise keeps everything organized with insightful graphs and
          easy-to-use filters.
        </p>
      </header>

      <section>
        <h2>Our Mission</h2>
        <p>
          We believe managing personal finance should be intuitive and
          stress-free. SpendWise empowers users to make smarter financial
          decisions by providing a seamless interface and reliable backend
          powered by modern web technologies.
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
