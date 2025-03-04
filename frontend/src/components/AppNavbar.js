import React, { useState,useEffect } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { FaHome, FaPlusCircle, FaBell, FaEnvelope, FaCog, FaWpexplorer } from "react-icons/fa";
import default_user from '../assets/default_user.jpg';
import logo from "../assets/logo.svg";
import { Link,useNavigate } from 'react-router-dom';

const Navbar = ({ userProfile, posts }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredHashtags, setFilteredHashtags] = useState([]);
  const [searchPlaceHolder, setSearchPlaceholder] = useState(".")
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (location.pathname === "/explore-page") {
      setSearchPlaceholder("Search hashtags...");
    } else if (location.pathname === "/Home") {
      setSearchPlaceholder("Search users...");
    } else {
      setSearchPlaceholder("Search...");
    }
  }, [location.pathname]);

  const handleSearch = (event) => {
  const term = event.target.value;
  setSearchTerm(term);

  if (term.length > 0 && location.pathname === "/explore-page") {
    setSearchPlaceholder('Search hashtags....')
    const uniqueHashtags = new Set();
    posts.forEach(post => {
      post.hashtags.forEach(tag => {
        if (tag.toLowerCase().includes(term.toLowerCase())) {
          uniqueHashtags.add(tag);
        }
      });
    });
    setFilteredHashtags([...uniqueHashtags]);
  } else {
    setFilteredHashtags([]);
    navigate('/explore-page', { state: { selectedHashtag: null } });
      // Set to null if search bar is empty
  } 

};
  const handleHashtagClick = (tag) => {
    navigate('/explore-page', { state: { selectedHashtag: tag } });
};

  return (
    <NavBarContainer>
      <LeftSection>
        <Logo src={logo} alt="InstaLinked" />
        <SearchBar 
          type="text" 
          placeholder={searchPlaceHolder}
          value={searchTerm} 
          onChange={handleSearch} 
        />
        {filteredHashtags.length > 0 && (
          <SearchResults>
            {filteredHashtags.map((tag, index) => (
              <SearchResultItem key={index} onClick={() => handleHashtagClick(tag)}>
              {tag}
            </SearchResultItem>
            
            ))}
          </SearchResults>
        )}
      </LeftSection>

      <RightSection>
        <NavIcon><NavLink href="/Home"><FaHome /></NavLink></NavIcon>
        <NavIcon><NavLink href="/explore-page"><FaWpexplorer /></NavLink></NavIcon>
        <NavIcon><NavLink href="/create-post"><FaPlusCircle /></NavLink></NavIcon>
        <NavIcon><FaBell /></NavIcon>
        <NavIcon><NavLink href="/messages"><FaEnvelope /></NavLink></NavIcon>
        <NavLink href="/create-profile"><ProfileImage src={user?.profileImage || default_user} alt="User Profile" /></NavLink>
        <NavIcon><FaCog /></NavIcon>
      </RightSection>
    </NavBarContainer>
  );
};

export default Navbar;

const NavBarContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #006b6b;
  padding: 10px 20px;
  width: 100%;
  height: 8vh;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  position: relative;
`;

const Logo = styled.img`
  height: 100%;
`;

const SearchBar = styled.input`
  width: 30vw;
  padding: 8px;
  border: none;
  border-radius: 5px;
  background: #f5f5f5;
  outline: none;
`;

const SearchResults = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  width: 30vw;
  border: 1px solid #ccc;
  max-height: 200px;
  overflow-y: auto;
  list-style: none;
  padding: 5px;
`;

const SearchResultItem = styled.li`
  padding: 8px;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
  &:hover {
    background: #f0f0f0;
  }
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

const ProfileImage = styled.img`
  height: 20px;
  width: 20px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid white;
  cursor: pointer;
`;

const NavLink = styled.a`
  color: white;
  text-decoration: none;
`;
