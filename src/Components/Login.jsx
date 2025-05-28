import React, { useState } from "react";
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
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {
    showRegister,
    forgetPassword,
    setForgetPassword,
    setShowRegister,
    setUser,
  } = userlogindata();

  const handleSignin = async () => {
    if (!email || !email.includes("@")) {
      setError("please eneter a valid email");
      setSuccess("");
      return;
    }
    if (!password) {
      setError("please enter the password");
      setSuccess("");
      return;
    }
    try {
      setLoading(true);
      await api.post("api/auth/login", { email, password })
      .then((res) => {
        setUser(res.data.user); //id ,name ,email

        if (res.data.success) {
          toast.success(res.data.message);
          navigate("/home");
        } else {
          toast.error(res.data.message);
        }
      });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
    setError(" ");
  };

  return (
    <section id="login">
      <div className="firstpage">
        {forgetPassword ? (
          <Forgetpass />
        ) : !showRegister ? (
          <div div className="login_container">
            <h1>Login</h1>
            <form action="" onSubmit={(e) => e.preventDefault()}>
              <div className="input_field">
                <input
                  type="email"
                  placeholder="Enter email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="input_field">
                <input
                  type="password"
                  placeholder="Enter password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="remeber_container">
                <div className="remeber_me">
                  <input type="checkbox" id="checkbox" />
                  <label htmlFor="checkbox">Remember me</label>
                </div>
                <a href="#" onClick={() => setForgetPassword(true)}>
                  Forgot password?
                </a>
              </div>
              <button
                type="submit"
                disabled={loading}
                onClick={() => handleSignin()}
              >
                {loading ? <span className="load"></span> : " Sign In"}
              </button>
              {error && (
                <h2
                  style={{
                    color: "red",
                    textAlign: "center",
                    fontSize: "10px",
                    marginTop: "15px",
                  }}
                >
                  {error}
                </h2>
              )}
              {success && (
                <h2
                  style={{
                    color: "green",
                    textAlign: "center",
                    fontSize: "10px",
                  }}
                >
                  {success}
                </h2>
              )}
            </form>
            <p>
              Don't have an account?
              {"  "}
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
