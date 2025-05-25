import React, { useState } from 'react'
import userlogindata from "./Authstore";
export default function Register( ) {

   const {
setShowRegister
 } = userlogindata()
const [name,setName] = useState("")
const [email,setEmail] = useState("")
const [password,setPassword] = useState("")
  const [error, setError] = useState(" ");
  const [success, setSuccess] = useState(" ");

const HandleSignup = () => {
if(!name || !email || !password){
  setError("Fields cannot be empty")
  setSuccess("")
  return;
}
    if (!email || !email.includes("@")) {
      setError("please eneter a valid email");
        setSuccess("")
      return;
    }
setSuccess("Success");
setError(" ")

}
    
  return (
   
    <div className="login_container">
      <h1>Register</h1>
      <form action="" onSubmit={(e) => e.preventDefault()}>
        <div className="input_field">
      
          <input type="text" placeholder='Enter your name' onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="input_field">
        
          <input type="email" placeholder='Enter your email' onChange={(e) => setEmail(e.target.value)}/>
        </div>
        <div className="input_field">
          
          <input type="password" placeholder='Enter password' onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type='submit'style={{marginTop:"28px"}} onClick={() => {HandleSignup()}}>Sign Up</button>

           {error && <h2 style={{color:"red",textAlign:"center",fontSize:"10px",marginTop:"15px"}}>{error}</h2>}
          {success && <h2 style={{color:"green",textAlign:"center",fontSize:"10px"}}>{success}</h2>}
      </form>
      <p>Already have an account? <a href="#" onClick={() => setShowRegister(false)}>Login</a></p>
    </div>
 
  )
}
