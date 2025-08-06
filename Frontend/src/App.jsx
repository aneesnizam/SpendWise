import React, { useEffect } from "react";
import Login from "./Components/Login";
import { toast, ToastContainer } from "react-toastify";
import Home from "./Components/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import GuestRoute from "./utilities/GuestRoute";
import ProtectedRoute from "./utilities/ProtectedRoute";
import userlogindata from "./utilities/Authstore";
import Landing from "./Components/LandingPage/Landing";

import PrivacyPolicy from "./Components/PrivacyPolicy/PrivacyPolicy"
export default function App() {



  const { user } = userlogindata();

  useEffect(() => {
    if (!user) return;

    const handleEnableNotifications = async () => {
      try {
        // Check if already subscribed to avoid re-prompting
        const isAlreadySubscribed = localStorage.getItem("pushSubscribed");
        if (isAlreadySubscribed === "true") return;

        // Check if supported
        if (
          !("Notification" in window) ||
          !("serviceWorker" in navigator) ||
          !("PushManager" in window)
        ) {
          console.warn("Push notifications not supported.");
          return;
        }

        // Check current permission
        let permission = Notification.permission;

        if (permission === "default") {
          permission = await Notification.requestPermission();
        }

        if (permission !== "granted") {
          alert(
            "Notifications not enabled. Please enable them in browser settings."
          );
          return;
        }

        const registration = await navigator.serviceWorker.ready;
        const existingSubscription =
          await registration.pushManager.getSubscription();

        if (existingSubscription) {
          console.log("Already subscribed to push.");
          localStorage.setItem("pushSubscribed", "true");
          return;
        }

        const userId = user._id || user.id;
        if (userId) {
          await subscribeUserToPush(userId);
          toast.success("Subscribed to notifications!");
          localStorage.setItem("pushSubscribed", "true");
        }
      } catch (err) {
        console.error("Error setting up push notifications:", err);
      }
    };

    handleEnableNotifications();
  }, [user]);

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <GuestRoute>
                <Landing />
              </GuestRoute>
            }
          />
           <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route
            path="/login"
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
