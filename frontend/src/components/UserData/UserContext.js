import { createContext, useState, useContext, useEffect } from "react";

// Create Context
const UserContext = createContext();

// Custom hook to use the UserContext
export const useUser = () => useContext(UserContext);

// Context Provider Component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Get user from localStorage on initial load
    const storedUser = localStorage.setItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Sync user data to localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // Function to update user data
  const updateUser = (updatedData) => {
    setUser((prevUser) => {
      const newUser = { ...prevUser, ...updatedData };
      localStorage.setItem("user", JSON.stringify(newUser)); // Update localStorage
      return newUser;
    });
  };

  // Logout function to clear user data
  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <UserContext.Provider value={{ user, setUser, updateUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};
