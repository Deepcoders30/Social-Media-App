import React, { useState } from 'react';
import "./Signup.scss";
import { Link } from 'react-router-dom';
import { axiosClient } from '../../utils/axiosClient';

function Signup() {
  const [name, setName]=useState()
  const [email, setEmail]=useState("");
  const [password, setPassword]=useState(""); 
  
  
  
  async function handleSubmit(event){
      event.preventDefault();
      try{
      const result=await axiosClient.post("/auth/signup", {
        name,
        email,
        password
      });
      

      }catch(error){
        console.log(error)
      }
  }

  return (
    <div className="Signup">
    <div className="signup-box">
     <h2 className="heading">Signup</h2>
     <form onSubmit={handleSubmit}>
     <label htmlFor="name">Name</label>
         <input type="name" className="name" id="name" onChange={(event)=>setName(event.target.value)} />

         <label htmlFor="email">Email</label>
         <input type="email" className="email" id="email" onChange={(event)=>setEmail(event.target.value)} />

         <label htmlFor="password">Password</label>
         <input type="password" className="password" id="password" onChange={(event)=>setPassword(event.target.value)} />

         <input type="submit" className="submit" />

         <p>Already have an account? <Link to="/login">Log In </Link></p>
     </form>
    </div>
 </div>
  )
}

export default Signup;