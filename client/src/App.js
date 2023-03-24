import Login from "./pages/login/Login.js";
import Signup from "./pages/signup/Signup.js";
import Home from "./pages/home/Home.js";
import {Routes, Route} from "react-router-dom";
import RequireUser from "./components/RequireUser.js";
import Profile from "./components/profile/Profile.js";
import Feed from "./components/feed/Feed.js";
import UpdateProfile from "./components/updateProfile/UpdateProfile.js";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import LoadingBar from 'react-top-loading-bar';
import { useRef } from "react";

function App() {

  const isLoading=useSelector(state=>state.appConfigReducer.isLoading);
  const loadingRef=useRef(null);

  useEffect(()=>{
    if(isLoading){
      loadingRef.current?.continuousStart();
    }else{
      loadingRef.current?.complete();
    }
  }, [isLoading])
  return (
    <div className="App">
    <LoadingBar color='#000' ref={loadingRef} />
     <Routes>
     {/* <Route element={<RequireUser />}> */}
         <Route element={<Home />}> 
            <Route path="/" element={<Feed />} />
            <Route path="/profile/:userId" element={<Profile />} />
            <Route path="/updateProfile" element={<UpdateProfile />} />
        </Route>
     {/* </Route> */}

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
     </Routes>
    </div>
  );
}

export default App;
