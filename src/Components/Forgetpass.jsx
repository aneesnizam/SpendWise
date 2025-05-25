import React, { useState } from "react";
import userlogindata from "./Authstore";
export default function Forgetpass({ onForgetPassword }) {
  const [email, setEmail] = useState("");
  const [sendcode, setSendCode] = useState(false);
  const [error, setError] = useState(" ");
  const [success, setSuccess] = useState(" ");
  const [password, setPassword] = useState("");
  const [confirmpass, setConfirmpass] = useState("");

   const {
setForgetPassword 
 } = userlogindata()

  const handleSendCode = () => {
    if (!email || !email.includes("@") ) {
      setError("please eneter a valid email");
      return;
    }
    setSuccess("code sended");
    setSendCode(true);
    setError(" ");
  };
  const handlereset = () => {
    if (!password || !confirmpass) {
      setSuccess("");
      setError("all field required");
      return;
    }
    if (password !== confirmpass) {
      setSuccess("");
      setError("do not match");
      return;
    }
    setError("");
    setSuccess("completed");
    setTimeout(() => {
      setForgetPassword(false);
    }, 1500);
  };

  return (
   
      <div className="login_container">
        <h1>Reset Password</h1>
        <form action="" onSubmit={(e) => e.preventDefault()}>
          <div className="input_field">
           
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {!sendcode && (
            <button type="button" onClick={() => handleSendCode()}>
              send code
            </button>
          )}
          {sendcode && (
            <>
              <div className="input_field">
                <input type="text" placeholder="Enter the Code" />
              </div>
              <div className="input_field">
                <input
                  type="password"
                  placeholder="Enter New Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="input_field">
              
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  onChange={(e) => setConfirmpass(e.target.value)}
                />
              </div>
              <button style={{marginTop:"28px",fontWeight:"700"}} onClick={() => handlereset()}>Confirm</button>
            </>
          )}
          {error && <h2 style={{color:"red",textAlign:"center",fontSize:"10px",marginTop:"15px"}}>{error}</h2>}
          {success && <h2 style={{color:"green",textAlign:"center",fontSize:"10px"}}>{success}</h2>}
        </form>
      </div>
  
  );
}
