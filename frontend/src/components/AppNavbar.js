import React, { useState,useEffect } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { FaHome, FaPlusCircle, FaBell, FaEnvelope, FaCog, FaWpexplorer } from "react-icons/fa";
import default_user from '../assets/default_user.jpg';
import logo from "../assets/logo.svg";
import { Link,useNavigate } from 'react-router-dom';

const Navbar = ({ userProfile, posts }) => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredHashtags, setFilteredHashtags] = useState([]);
  const [searchPlaceHolder, setSearchPlaceholder] = useState(".")
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

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

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    navigate("/login");
  };
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
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

      <MenuButton onClick={toggleMenu}>
        {isOpen ? "✕" : "☰"}
      </MenuButton>

      <NavLinks isOpen={isOpen}>
        <NavLink onClick={() => navigate("/explore-page")}>Explore</NavLink>
        <NavLink onClick={() => navigate("/create-post")}>Create Post</NavLink>
        <NavLink onClick={() => navigate("/create-profile")}>view  Profile</NavLink>
        <NavLink onClick={() => navigate("/messages")}>Messages</NavLink>
        <NavLink onClick={() => navigate("/settings")}>Settings</NavLink>
        
        <UserSection>
          <UserAvatar src={user?.profileImage || default_user} alt="User" />
          <UserName>{user?.fullName || "User"}</UserName>
          <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
        </UserSection>
      </NavLinks>
    </NavBarContainer>
  );
};

export default Navbar;

const NavBarContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #006d77;
  padding: 10px 20px;
  width: 100%;
  height: 8vh;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  
  @media (max-width: 768px) {
    padding: 8px 15px;
  }
  
  @media (max-width: 480px) {
    padding: 8px 10px;
  }
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  position: relative;
  
  @media (max-width: 768px) {
    gap: 10px;
    flex: 1;
  }
`;

const Logo = styled.img`
  height: 100%;
  max-height: 100px;
  
  @media (max-width: 768px) {
    max-height: 50px;
  }
  
  @media (max-width: 480px) {
    max-height: 50px;
  }
`;

const SearchBar = styled.input`
  width: 30vw;
  padding: 8px;
  border: none;
  border-radius: 5px;
  background: #f5f5f5;
  outline: none;
  
  @media (max-width: 1024px) {
    width: 25vw;
  }
  
  @media (max-width: 768px) {
    width: 100%;
    padding: 6px;
    font-size: 14px;
  }
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
  z-index: 1001;
  
  @media (max-width: 1024px) {
    width: 25vw;
  }
  
  @media (max-width: 768px) {
    width: calc(100% - 45px);
    left: 45px;
  }
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
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavIcon = styled.div`
  color: white;
  font-size: 25px;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (max-width: 1024px) {
    font-size: 22px;
  }
`;

const ProfileImage = styled.img`
  height: 20px;
  width: 20px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid white;
  cursor: pointer;
  
  @media (max-width: 1024px) {
    height: 18px;
    width: 18px;
  }
`;

const NavLink = styled.a`
  color: white;
  text-decoration: none;
`;

const NavLinks = styled.div`
  display: none;
  
  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'flex' : 'none'};
    flex-direction: column;
    position: absolute;
    top: 8vh;
    left: 0;
    right: 0;
    background-color: #006d77;
    padding: 10px 0;
    z-index: 999;
    
    ${NavLink} {
      padding: 12px 20px;
      width: 100%;
      text-align: left;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      
      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }
    }
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    margin-top: 10px;
    padding: 12px 20px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
`;

const UserAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
  object-fit: cover;
  
  @media (max-width: 480px) {
    width: 32px;
    height: 32px;
    margin-right: 8px;
  }
`;

const UserName = styled.span`
  color: white;
  margin-right: 15px;
  
  @media (max-width: 480px) {
    font-size: 14px;
    margin-right: 10px;
  }
`;

const LogoutButton = styled.button`
  background-color: transparent;
  color: white;
  border: 1px solid white;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  margin-left: auto;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  @media (max-width: 480px) {
    padding: 4px 8px;
    font-size: 14px;
  }
`;

const MenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 0 10px;
  
  @media (max-width: 768px) {
    display: block;
  }
`;
