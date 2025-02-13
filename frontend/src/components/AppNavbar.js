import React from "react";
import styled from "styled-components";
import { FaHome, FaPlusCircle, FaBell, FaEnvelope, FaCog,FaWpexplorer } from "react-icons/fa";
import default_user from '../assets/default_user.jpg'
import logo from "../assets/logo.svg"
import {Link} from 'react-router-dom'

const Navbar = ({ userProfile }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <NavBarContainer>
      <LeftSection>
        <Logo src={logo} alt="InstaLinked" />
        <SearchBar type="text" placeholder="Search" />
      </LeftSection>

      <RightSection>
        <NavIcon><NavLink href="/Home"><FaHome /></NavLink></NavIcon>
        <NavIcon><NavLink href="/explore-page"><FaWpexplorer /></NavLink></NavIcon> {/* ✅ Corrected telescope icon */}
        <NavIcon><NavLink href="/create-post"><FaPlusCircle /></NavLink></NavIcon>
        <NavIcon>
          <BellIcon>
            <FaBell />
            {/* <NotificationBadge>12</NotificationBadge> */}
          </BellIcon>
        </NavIcon>
        <NavIcon><FaEnvelope /></NavIcon>
        <NavLink href="/create-profile"><ProfileImage src={user?.profileImage || default_user}  alt="User Profile" /></NavLink>
        <NavIcon><FaCog /></NavIcon>
      </RightSection>
    </NavBarContainer>
  );
};

export default Navbar;

// 🌟 Styled Components
const NavBarContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #006b6b;
  padding: 10px 20px;
  width: 100%;
  height:8vh;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const Logo = styled.img`
position:relative;
  height:100%;
`;

const SearchBar = styled.input`
position:relative;
  width: 30vw;
  padding: 8px;
  border: none;
  border-radius: 5px;
  background: #f5f5f5;
  outline: none;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const NavIcon = styled.div`
  color: white;
  font-size: 25px;
  cursor: pointer;
  position: relative;
`;

const BellIcon = styled.div`
  position: relative;
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: -5px;
  right: -8px;
  background-color: red;
  color: white;
  font-size: 12px;
  border-radius: 50%;
  padding: 2px 6px;
`;

const ProfileImage = styled.img`
  height: 20px;
  width: 20px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid white;
  cursor: pointer;
`;
const NavLink=styled.a`
color:white;
`