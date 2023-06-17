import React, { useEffect } from "react";
import Navbar from "../../components/navbar/Navbar.js";
import "./Home.scss";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getMyInfo } from "../../redux/slices/appConfigSlice.js";

function Home() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getMyInfo());
  }, []);
  return (
    <>
      <Navbar />
      <div className="outlet" style={{ marginTop: "60px" }}>
        <Outlet />
      </div>
    </>
  );
}

export default Home;
