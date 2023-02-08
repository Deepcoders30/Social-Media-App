import Login from "./pages/login/Login.js";
import Signup from "./pages/signup/Signup.js";
import Home from "./pages/home/Home.js";
import {Routes, Route} from "react-router-dom";
import RequireUser from "./components/RequireUser.js";

function App() {
  return (
    <div className="App">
     <Routes>
      
     <Route element={<RequireUser />}>
     <Route path="/home" element={<Home />} />  
     </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
     </Routes>
    </div>
  );
}

export default App;
