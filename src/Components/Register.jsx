import React, { useState } from "react";
import userlogindata from "./Authstore";
import api from "../utilities/axios";
import { toast } from "react-toastify";

export default function Register() {
  const { setShowRegister } = userlogindata();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(" ");
  const [success, setSuccess] = useState(" ");
  const [loading, setLoading] = useState(false);

  const HandleSignup = async() => {
    

    if (!name || !email || !password) {
      setError("Fields cannot be empty");
      setSuccess("");
      return;
    }
    if (!email || !email.includes("@")) {
      setError("please eneter a valid email");
      setSuccess("");
      return;
    }

    try {
      setLoading(true);
      await api.post("api/auth/register", { name, password, email }).then((res) => {
        // console.log(res.data);
        
        if (res.data.success) {
          setShowRegister(false);
           toast.success(res.data.message);
         
        }
        else{
         toast.error(res.data.message)
        }
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }

    setError(" ");

    setEmail("");
    setName("");
    setPassword("");
  };

  return (
    <div className="login_container">
      <h1>Register</h1>
      <form action="" onSubmit={(e) => e.preventDefault()}>
        <div className="input_field">
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="input_field">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="input_field">
          <input
            type="password"
            value={password}
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button 
         disabled = {loading}
          type="submit"
          style={{ marginTop: "28px" }}
          onClick={() => {
            HandleSignup();
          }}
        >
          {loading ? <span className="load"></span> : " Sign Up"}
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
        {/* {success && (
          <h2 style={{ color: "green", textAlign: "center", fontSize: "10px" }}>
            {success}
          </h2>
        )} */}
      </form>
      <p>
        Already have an account?{" "}
        <a href="#" onClick={() => setShowRegister(false)}>
          Login
        </a>
      </p>
    </div>
  );
}
