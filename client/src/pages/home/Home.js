import React from 'react'
import Navbar from '../../components/navbar/Navbar.js';
import "./Home.scss";
import { Outlet } from 'react-router-dom';


function Home() {
  return (
    <>
      <Navbar />
      <div className="outlet" style={{marginTop:"60px"}}>
         <Outlet />
      </div>
    </>
  )
}

export default Home;