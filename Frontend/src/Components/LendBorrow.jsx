import React from "react";
import "./lendBorrow.css";

export default function LendBorrow() {
  return (
    <section id="lend-borrow-section">
      <div className="form-summary-wrapper">
        <div className="form-container">
          <form>
            <label>
              Type:
              <select>
                <option value="lend">Lend</option>
                <option value="borrow">Borrow</option>
              </select>
            </label>

            <label>
              Person:
              <input type="text" placeholder="Enter name" />
            </label>

            <label>
              Amount:
              <input type="number" placeholder="Enter amount" />
            </label>

            <label>
              Note:
              <input type="text" placeholder="Enter note" />
            </label>

            <button type="submit">Submit</button>
          </form>
        </div>

        <div className="summary-container">
          <div className="summary-box lend-summary">
            <h4>Lend</h4>
            <h5>Total Amount</h5>
            <h5>Entries Count</h5>
          </div>
          <div className="summary-box borrow-summary">
            <h4>Borrow</h4>
            <h5>Total Amount</h5>
            <h5>Entries Count</h5>
          </div>
        </div>
      </div>

      <div className="entry-list-section">
        <div className="filters-container">
          <select>
            <option value="all">All Types</option>
            <option value="lend">Lend</option>
            <option value="borrow">Borrow</option>
          </select>
          <select>
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <ul className="entry-list">
          <li className="entry-item">
            <div className="entry-header">
              <h3 className="entry-person">John Doe</h3>
              <h4 className="entry-amount">₹500</h4>
              <p className="entry-type">Lend</p>
              <button className="edit-btn">Edit</button>
              <button className="delete-btn">Delete</button>
            </div>
            <div className="entry-note">
              <p>For dinner outing</p>
            </div>
          </li>
        </ul>
      </div>
    </section>
  );
}
