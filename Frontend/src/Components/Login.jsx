import React, { useState, useEffect } from "react";
import "./login.css";
import Register from "./Register";
import Forgetpass from "./Forgetpass";
import userlogindata from "./Authstore";
import api from "../utilities/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [error, setError] = useState(" ");
  const [success, setSuccess] = useState(" ");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    showRegister,
    forgetPassword,
    setForgetPassword,
    setShowRegister,
    setUser,
    setToken
  } = userlogindata();

  // Load remembered credentials (if any)
  useEffect(() => {
    const savedCredentials = localStorage.getItem("rememberedCredentials");
    if (savedCredentials) {
      const { email: savedEmail, password: savedPassword } = JSON.parse(savedCredentials);
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleSignin = async () => {
    setError("");
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email");
      return;
    }

    if (!password) {
      setError("Please enter the password");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("api/auth/login", { email, password });

      const { user, token, message, success } = response.data;

      if (success) {
        // Store in Zustand
        setUser(user);
        setToken(token);

        // Immediately update axios default headers
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        // Remember credentials if selected
        if (rememberMe) {
          localStorage.setItem(
            "rememberedCredentials",
            JSON.stringify({ email, password })
          );
        } else {
          localStorage.removeItem("rememberedCredentials");
        }

        toast.success(message || "Login successful");
        navigate("/home");
      } else {
        toast.error(message || "Login failed");
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      toast.error(errorMsg);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="login">
      <div className="firstpage">
        {forgetPassword ? (
          <Forgetpass />
        ) : !showRegister ? (
          <div className="login_container">
            <h1>Login</h1>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="input_field">
                <input
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="input_field">
                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="remeber_container">
                <div className="remeber_me">
                  <input
                    type="checkbox"
                    id="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label htmlFor="checkbox">Remember me</label>
                </div>
                <a href="#" onClick={() => setForgetPassword(true)}>
                  Forgot password?
                </a>
              </div>
              <button
                type="submit"
                disabled={loading}
                onClick={handleSignin}
              >
                {loading ? <span className="load"></span> : "Sign In"}
              </button>
              {error && (
                <h2 style={{ color: "red", textAlign: "center", fontSize: "10px", marginTop: "15px" }}>
                  {error}
                </h2>
              )}
              {success && (
                <h2 style={{ color: "green", textAlign: "center", fontSize: "10px" }}>
                  {success}
                </h2>
              )}
            </form>
            <p>
              Don't have an account?{" "}
              <a href="#" onClick={() => setShowRegister(true)}>
                Register
              </a>
            </p>
          </div>
        ) : (
          <Register />
        )}
      </div>
    </section>
  );
}
