import { createContext, useState, useContext, useEffect } from "react";

// Create Context
const UserContext = createContext();

// Custom hook to use the UserContext
export const useUser = () => useContext(UserContext);

// Context Provider Component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Get user from sessionStorage on initial load
    const storedUser = sessionStorage.setItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Sync user data to sessionStorage when it changes
  useEffect(() => {
    if (user) {
      sessionStorage.setItem("user", JSON.stringify(user));
    } else {
      sessionStorage.removeItem("user");
    }
  }, [user]);

  // Function to update user data
  const updateUser = (updatedData) => {
    setUser((prevUser) => {
      const newUser = { ...prevUser, ...updatedData };
      sessionStorage.setItem("user", JSON.stringify(newUser)); // Update sessionStorage
      return newUser;
    });
  };

  // Logout function to clear user data
  const logoutUser = () => {
    setUser(null);
    sessionStorage.removeItem("user");
  };

  return (
    <UserContext.Provider value={{ user, setUser, updateUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};
