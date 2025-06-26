import React, { useState } from "react";
import "./Help.css";

export default function Help() {
  const helpData = [
    {
      question: "How do I change my daily spending limit?",
      answer: "Click on your profile icon in the top-right corner of the navigation bar, then choose 'Edit'. Update your daily limit and click 'Save Changes'."
    },
    {
      question: "How can I add or update my UPI ID?",
      answer: "Navigate to your profile from the top-right corner of the navigation bar. Click 'Edit', update your UPI ID, and save the changes."
    },
    {
      question: "How do I enable weekly expense summaries?",
      answer: "Go to your profile settings and enable the 'Weekly Summary' option. A summary will be sent to your registered email every week."
    },
    {
      question: "How can I add friends on SpendWise?",
      answer: "Open the menu from the top-left corner and select 'Friends'. Enter the email address of your friend (they must have a SpendWise account) and send a request."
    },
    {
      question: "Where can I view insights and visual reports of my expenses?",
      answer: "Go to the menu and select 'Insight'. There, you can view graphical reports, total counts, and categorized spending breakdowns."
    },
    {
      question: "How do I filter my expenses by date, cost, or category?",
      answer: "Open the menu and select 'Filter'. For detailed options, use the dropdown to access 'Advanced Filter' to specify date range, cost range, and category."
    },
    {
      question: "How do I add or manage lend/borrow transactions?",
      answer: "From the menu, choose 'Lend/Borrow'. You can record and track money lent to or borrowed from others there."
    },
    {
      question: "Is there a built-in calculator I can use?",
      answer: "Yes. Go to the menu and select 'Calculator' for quick calculations without leaving the app."
    },
    {
      question: "How can I calculate my fuel expenses?",
      answer: "Open the menu and choose 'Fuel Calculator'. Enter distance and mileage details to estimate your fuel costs."
    },
    {
      question: "How do I split an expense with friends?",
      answer: "After entering an amount on the home page, select 'Split'. Then, choose the friends to split with. Shared expenses will appear in the 'Shared' section under the menu."
    },
    {
      question: "How do I respond to a friend’s split request?",
      answer: "Go to the 'Shared' section from the menu. You can either 'Mark as Paid' or select 'Pay'. If you choose 'Pay', a QR code will appear for payment. If you 'Mark as Paid', your friend will be notified and must confirm it from their inbox."
    },
    {
      question: "Where can I view incoming or pending split requests?",
      answer: "Go to the 'Shared' section in the menu to see any incoming or pending split requests from your friends."
    },
    {
      question: "Where can I see payment confirmations and notifications?",
      answer: "Click the inbox icon next to your profile in the top navigation bar to view all confirmations and system notifications."
    },
    {
      question: "How do I log out of my account?",
      answer: "Click on your profile icon in the top-right corner and select 'Logout' from the profile panel."
    }
  ];

  const [visibleIndex, setVisibleIndex] = useState(null);

   return (
    <section id="help">
      <div className="help-wrapper">
        <h1>Help Desk</h1>
        <ul>
          {helpData.map((item, index) => (
            <li key={index} className={visibleIndex === index ? "active" : ""}>
              <div
                className="top"
                onClick={() =>
                  setVisibleIndex(visibleIndex === index ? null : index)
                }
              >
                {item.question}
              </div>
              {visibleIndex === index && (
                <div className="bottom">
                  <p>{item.answer}</p>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
