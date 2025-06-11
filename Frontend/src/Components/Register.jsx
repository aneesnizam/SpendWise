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
const [confirmPass,setConfirmPass] = useState("")
const [popup,SetPopUp] = useState(false)
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
    if (password !== confirmPass){
       setError("The passwords do not match");
      setSuccess("");
      return;
    }

    try {
      setLoading(true);
      await api.post("api/auth/register", { name, password, email }).then((res) => {
        // console.log(res.data);
        
        if (res.data.success) {
         
          SetPopUp(true);
     
         
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
const handlePopup = () => {
setShowRegister(false);
     toast.success("Please log in to continue. ");
}
  return (
    <>
    <div className={`login_container ${popup ? "popupBlur" : undefined} `}>
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
          <div className="input_field">
          <input
            type="password"
            value={confirmPass}
            placeholder="confirm Password"
            onChange={(e) => setConfirmPass(e.target.value)}
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
      
      </form>
      <p>
        Already have an account?{" "}
        <a href="#" onClick={() => setShowRegister(false)}>
          Login
        </a>
      </p>
 
    </div>
       {popup &&   <div className="popupContainer">
        <div className="popup">
          <h6>Registration successful! </h6>
          <p>A verification email has been sent to your registered email address. Please check your inbox and follow the link to verify your account.</p>
          <button onClick={handlePopup}>OK</button>
        </div>
      </div>}
    </>
  );
}
