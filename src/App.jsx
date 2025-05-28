import React from "react";
import Login from "./Components/Login";
import { ToastContainer } from "react-toastify";
import Home from "./Components/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path ="/home" element={<Home/>} />
        </Routes>

        <ToastContainer />
      </BrowserRouter>
    </div>
  );
}
