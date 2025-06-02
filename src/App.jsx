import React from "react";
import Login from "./Components/Login";
import { ToastContainer } from "react-toastify";
import Home from "./Components/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import GuestRoute from "./Components/GuestRoute";
import ProtectedRoute from "./Components/ProtectedRoute";
export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <GuestRoute>
                <Login />
              </GuestRoute>
            }
          />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
        </Routes>

        <ToastContainer autoClose={1400} />
      </BrowserRouter>
    </div>
  );
}
