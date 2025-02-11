import React from 'react'
import { useLocation } from 'react-router-dom'
import AppNavbar from './AppNavbar'
function Home() {

 const user = JSON.parse(localStorage.getItem("user"));
   console.log("ProfileEdit received userData:", user);
  return (
    <div>
      <AppNavbar />
      <h1>welcome Home </h1>
    </div>
  )
}

export default Home
