import React, { useState, useEffect } from "react";
import { FaHome, FaPlusCircle, FaBell, FaEnvelope, FaCog,FaWpexplorer, FaCompass } from "react-icons/fa";
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import default_user from '../assets/default_user.jpg'
import styled from "styled-components";
import logo from "../assets/logo.svg"
//import { useSocket } from '../context/SocketContext';

const HomeNavbar = () => {
   // const { unreadCount, setUnreadCount } = useSocket();
   const user = JSON.parse(sessionStorage.getItem("user"));
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    
    // useEffect(() => {
    //     const storedUser = sessionStorage.getItem("user");
    //     if (storedUser) {
    //         setUser(JSON.parse(storedUser));
    //     }
        
    //     // Fetch unread notification count
    //     fetchUnreadCount();
    // }, []);

    // Function to fetch unread notification count
    // const fetchUnreadCount = async () => {
    //     try {
    //         const user = JSON.parse(sessionStorage.getItem('user'));
    //         if (!user) return;
            
    //         const response = await fetch(`http://localhost:5500/api/notifications/unread/${user._id}`, {
    //             credentials: 'include'
    //         });
            
    //         if (response.ok) {
    //             const data = await response.json();
    //             setUnreadCount(data.count);
    //         }
    //     } catch (error) {
    //         console.error('Error fetching unread count:', error);
    //     }
    // };

    // ✅ Search users
    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            console.log("Search query is empty");
            setSearchResults([]); // Clear previous results
            return;
        }
        setLoading(true);
        console.log("Searching for:", searchQuery);
        try {
            // Encode the search query to handle special characters
            const encodedQuery = encodeURIComponent(searchQuery.trim());
            const response = await axios.get(`/api/homesearch/search?q=${encodedQuery}`, {
                withCredentials: true // Add this to handle cookies if needed
            });
            console.log("Search Results:", response.data);
            setSearchResults(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("Error searching users:", error);
            setSearchResults([]); // Clear results on error
        } finally {
            setLoading(false);
        }
    };
    
    // Debounce search to prevent too many API calls
    const handleSearchInputChange = (e) => {
        setSearchQuery(e.target.value);
        if (!e.target.value.trim()) {
            setSearchResults([]);
            return;
        }
        // Add small delay before searching
        setTimeout(() => {
            if (e.target.value === searchQuery) {
                handleSearch();
            }
        }, 300);
    };

    const handleProfileClick = () => {
        const storedUser = sessionStorage.getItem("user");
        if (user) {
         
            // Use email for consistent navigation
            navigate(`/profile/${user.email}`);
        }
    };

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = () => {
        sessionStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <NavBarContainer>
            <LeftSection>
                <Logo src={logo} alt="InstaLinked" />
                <div style={styles.searchContainer}>
                    <SearchBar 
                        type="text" 
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={handleSearchInputChange}
                    />
                    <button onClick={handleSearch} style={styles.searchButton}>Search</button>
                </div>
            </LeftSection>

            <RightSection>
                <NavIcon><NavLink href="/Home"><FaHome /></NavLink></NavIcon>
                <NavIcon><NavLink href="/explore-page"><FaWpexplorer /></NavLink></NavIcon>
                <NavIcon><NavLink href="/create-post"><FaPlusCircle /></NavLink></NavIcon>
                <NavIcon><FaBell /></NavIcon>
                <NavIcon><NavLink href="/messages"><FaEnvelope /></NavLink></NavIcon>
                <NavLink onClick={handleProfileClick}><ProfileImage src={user?.profileImage || default_user} alt="User Profile" /></NavLink>
                <NavIcon><FaCog /></NavIcon>
            </RightSection>

            <MenuButton onClick={toggleMenu}>
                {isOpen ? "✕" : "☰"}
            </MenuButton>

            <NavLinks isOpen={isOpen}>
                <NavLink onClick={() => navigate("/explore-page")}>Explore</NavLink>
                <NavLink onClick={() => navigate("/create-post")}>Create Post</NavLink>
                <NavLink onClick={() => navigate("/messages")}>Messages</NavLink>
                <NavLink onClick={() => navigate("/settings")}>Settings</NavLink>
                <UserSection>
                    <UserAvatar src={user?.profileImage || default_user} alt="User" />
                    <UserName>{user?.fullName || "User"}</UserName>
                    <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
                </UserSection>
            </NavLinks>

            {/* Search Results */}
            {searchQuery.trim() && !loading && searchResults.length > 0 && (
                <ul style={styles.searchResultsContainer}>
                    {searchResults.map(user => (
                        <li key={user._id} style={styles.searchItem}>
                            <div style={styles.profileContainer}>
                                <span style={styles.username}>{user.username || user.email}</span>
                            </div>
                            <button
                                style={styles.viewProfileButton}
                                onClick={() => navigate(`/profile/${user.email}`)}
                            >
                                View Profile
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </NavBarContainer>
    );
};

export default HomeNavbar;

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

const styles = {
    navbarContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#006d77",
        padding: "10px 20px",
        color: "#ffffff",
        width: "100%",
        height:"8vh"
    },
    leftSection: {
        display: "flex",
        alignItems: "center",
        gap: "15px",
        flex: 0.98,
    },
    logo: {
        width: "120px",  // ✅ Adjust size as needed
        height: "100%",
        position:"relative",
    },
    searchContainer: {
        display: "flex",
        padding: "8px",
        alignItems: "center", 
        borderRadius: "5px",
        border: "none",
        width: "400px",
        gap: "4px", 
    },
    searchInput: {
        padding: "8px",
        borderRadius: "4px",
        width: "350px",
        fontSize: "14px",
    },
    searchButton: {
        marginRight: "5px",
        padding: "8px 15px",
        backgroundColor: "#ffffff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
    },
    rightSection: {
        display: "flex",
        alignItems: "center",
        gap: "20px",
        marginLeft: "auto", // Push icons to the right
        justifyContent: "flex-end",
        flexShrink: 0,
    },
    navIcon: {
        color: "white",
        fontSize: "24px",
        cursor: "pointer",
        textDecoration: "none",
        position: "relative",
    },
    profileImage: {
        height: "30px",
        width: "30px",
        borderRadius: "50%",
        objectFit: "cover",
        border: "2px solid white",
        cursor: "pointer",
    },
    notificationBadge: {
        position: "absolute",
        top: "-5px",
        right: "-8px",
        backgroundColor: "red",
        color: "white",
        fontSize: "12px",
        borderRadius: "50%",
        padding: "2px 6px",
    },
    searchResultsContainer: {
        position: "absolute",
        top: "60px",
        left: "220px",
        transform: "none",
        backgroundColor: "white",
        padding: "10px",
        borderRadius: "5px",
        boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
        width: "400px",
        zIndex: 1000,
    },
    searchItem: {
        display: "flex",
        justifyContent: "space-between",
        padding: "5px 0",
    },
    loadingContainer: {
        position: "relative",
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        padding: "8px 16px",
        borderRadius: "5px",
        fontWeight: "bold",
        boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
    },
    profileContainer: {
        display: "flex",
        alignItems: "center", // Aligns profile image and username horizontally
        gap: "10px", // Adds space between image and text
    },
    viewProfileButton: {
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        padding: "3px 8px",
        cursor: "pointer",
    },
    icons: {
        display: "flex",
        gap: "15px",
    },
    profileLink: {
        cursor: "pointer",
    },
};