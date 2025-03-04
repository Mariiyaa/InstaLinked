import React from "react";
import axios from 'axios'
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes,useLocation } from "react-router-dom";
import Login from "./components/Login";
import ResetPasswordRequest from "./components/ResetPasswordRequest";
import ResetPassword from "./components/ResetPassword";
import Home from "./components/Home";
import CreateProfile from "./components/CreateProfile";
import DisplayProfile from "./components/DisplayProfile";
import Explore from "./components/Explore"
import Signup from "./components/Signup";
import OtpVerification from './components/OtpVerification';
import PopUPexplore from "./components/PopUPexplore";
import PersonaSelection from "./components/PersonaSelection";
import ContentSelection from "./components/ContentSelection";
import NameSelection from "./components/NameSelection";
import Navbar from "./components/Navbar";
//import Messages from './components/Messages'
import CreatePost from "./components/CreatePost";



axios.defaults.baseURL = process.env.REACT_APP_BACK_PORT
axios.defaults.withCredentials = true


const App = () => {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const background = location.state?.background;

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setUser(storedEmail); 
      console.log(process.env) // ✅ Use setUser correctly
    }
  }, []);

  return (
    <>

  {/* Show Navbar only for Signup and Login */}
  <Routes>
    <Route path="/"element={
        <>
          <Navbar />
          <Signup />
        </>
      }
    />
    <Route path="/login" element={
        <>
          <Navbar />
          <Login />
        </>
      }
    />
  </Routes>

  {/* Other Routes without Navbar */}
  <Routes>
    <Route path="/verify-otp" element={<OtpVerification />} />
    <Route path="/create-profile" element={<CreateProfile />} />
    <Route path="/create-post" element={<CreatePost />} />
    <Route path="/your-name" element={<NameSelection />} />
    <Route path="/persona-selection" element={<PersonaSelection userEmail={user} />} />
    <Route path="/content-selection" element={<ContentSelection userEmail={user} />} />
    {/* <Route path="/messages" element={<Messages />} /> */}
    <Route path="/Home" element={<Home />} />
    <Route path="/reset-password-request" element={<ResetPasswordRequest />} />
    <Route path="/reset-password/:token" element={<ResetPassword />} />
    <Route path="/my-profile" element={<DisplayProfile />} />
    </Routes>

   <Routes location={background || location}>
        <Route path="/explore-page" element={<Explore />} />
      </Routes>

      {background && (
        <Routes>
          <Route
            path="/p/:postId"
            element={
              <PopUPexplore/>
                
            }
          />
        </Routes>
      )}


  </>
  );
};


const Root = () => (
  <Router>
    <App />
  </Router>
);

export default Root;


