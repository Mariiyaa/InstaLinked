import React, { useState, useEffect } from "react";
import styled from "styled-components";
import io from "socket.io-client";
import axios from "axios";

const socket = io(process.env.REACT_APP_BACK_PORT, {
  transports: ["websocket", "polling"],
  withCredentials: true,
});

const UserList = ({ users, setSelectedUser, messages, selectedUser, currentUser }) => {
  const [search, setSearch] = useState("");
  const [updatedUsers, setUpdatedUsers] = useState([]);
  socket.onAny((event, ...args) => {
    console.log(`🔥 SOCKET EVENT: ${event}`, args);
});


  // Fetch latest messages for users
  const fetchLatestMessages = async () => {
    try {
      const response = await axios.post('/api/messages/latest', { email: currentUser.email });
      const lastMessages = response.data;
      console.log("🔹 API Response (lastMessages):", lastMessages);
  
      // Map users and find their latest message
      const usersWithMessages = users
      .filter(user=>user.email !==currentUser.email)
      .map(user => {
        const matchedMessage = lastMessages.find(msg => msg.email === user.email);
        
        return {
          ...user,
          lastMessage: matchedMessage ? matchedMessage.lastMessage : null,
          isUnread: matchedMessage ? !matchedMessage.isRead && matchedMessage.sender !== currentUser.email : false,
          isSentByCurrentUser: matchedMessage ? matchedMessage.sender === currentUser.email : false,
        };
      });
  
      console.log("🔹 Updated Users With Messages:", usersWithMessages);
      setUpdatedUsers(usersWithMessages);
    } catch (error) {
      console.error("❌ Error fetching latest messages:", error);
    }
  };
  

  // Update messages when `users` or `messages` change
  useEffect(() => {
    socket.on("message-read", ({ sender, receiver, updatedMessages }) => {
        console.log("🔹 Marking messages as read:", sender, receiver, updatedMessages);

        setUpdatedUsers((prevUsers) =>
            prevUsers.map((user) => {
                if (user.email === sender) {
                    return {
                        ...user,
                        latestMessage: updatedMessages.find(msg => msg._id === user.latestMessage?._id)
                            ? { ...user.latestMessage, isRead: true }
                            : user.latestMessage
                    };
                }
                return user;
            })
        );
    });

    return () => {
        socket.off("message-read");
    };
}, []);
// ✅ Runs when `users` or `messages` update

// ✅ Ensure only the receiver marks messages as read
useEffect(() => {
  if (selectedUser && currentUser) {
    // ✅ Find the latest message of the selected user
    const selectedUserData = updatedUsers.find(user => user.email === selectedUser.email);
    const latestMsg = selectedUserData?.latestMessage;

    console.log("________________", latestMsg, latestMsg?.sender, latestMsg?.receiver, currentUser.email);

    // ✅ If there's no latest message, return
    if (!latestMsg) return;

    // ✅ Ensure that the current user is the receiver of the latest message
    if (latestMsg.sender === selectedUser.email && latestMsg.receiver === currentUser.email) {
        console.log("✅ Marking messages as read for:", selectedUser.email);

        // ✅ Emit mark-as-read only if the current user is the receiver
        socket.emit("mark-as-read", {
            sender: selectedUser.email,
            receiver: currentUser.email,
        });
    }
}
}, [selectedUser]);


  
  // ✅ Ensure it re-runs if the user changes
  
  

  useEffect(() => {
    // ✅ Listen for real-time message updates
    socket.on("updateLatestMessages", (latestMessages) => {
      console.log("🔹 Updated messages received:", latestMessages);
  
      setUpdatedUsers((prevUsers) =>
        prevUsers.map((user) => {
          const updatedMsg = latestMessages.find((msg) => msg.email === user.email); 
          console.log("XXXXXXXXXXXXXXX",latestMessages)
          return updatedMsg
            ? { ...user, lastMessage: updatedMsg.lastMessage, isUnread: updatedMsg.isUnread }
            : user;
        })
      );
    });
    console.log("🔹 Updated User received:", updatedUsers);
  
    // ✅ Fetch latest messages when the component mounts
    socket.emit("fetchLatestMessages");
  
    return () => socket.off("updateLatestMessages");
  }, []);
  

  useEffect(() => {
    socket.on("new-message", ({ sender, message }) => {
      console.log("🔹 New message received from:", sender, "Current user:", currentUser?.email);

      setUpdatedUsers((prevUsers) =>
        prevUsers.map((user) => {
          if (user.email === sender) {
            const isSentByCurrentUser = sender === currentUser?.email;
            return { 
              ...user, 
              lastMessage: message, 
              isUnread: !isSentByCurrentUser,  // Only mark as unread if received from others
              isSentByCurrentUser: isSentByCurrentUser
            };
          }
          return user;
        })
      );
    });

    return () => socket.off("new-message");
  }, [currentUser]);

  // Update latest messages when `users` change
  useEffect(() => {
    if (users.length > 0 && currentUser) {
      console.log("Fetching latest messages for:", currentUser.email);
      fetchLatestMessages();
    }
  }, [users, currentUser]);

  // Handle user selection
  const handleUserClick = (user) => {
    setSelectedUser(user);

    // ✅ Find the latest message from this user
    const selectedUserData = updatedUsers.find(u => u.email === user.email);
    const latestMsg = selectedUserData?.latestMessage;

    console.log("🟡 HandleUserClick Log: ", latestMsg, latestMsg?.sender, latestMsg?.receiver, currentUser.email);

    // ✅ Only mark as read if the selected user was the sender and the current user is the receiver
    if (latestMsg && !latestMsg.isRead && latestMsg.sender === user.email && latestMsg.receiver === currentUser.email) {
        console.log("✅ Marking messages as read in handleUserClick for:", user.email);
        socket.emit("mark-as-read", { sender: user.email, receiver: currentUser.email });
    }
};

; // ✅ Runs whenever selectedUser or updatedUsers change


  

  const filteredUsers = updatedUsers.filter(user =>
    user.fullName?.toLowerCase().includes(search.toLowerCase())
  );
 
  return (
    <Container>
      {/* Search Input */}
      <SearchBar
        type="text"
        placeholder="Search messages"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* User List */}
      <UserContainer>
  {filteredUsers.map((user) => {
    // If searching, show all users; otherwise, hide users with null messages
    if (search || user.lastMessage !==  null) {
      return (
        <UserItem key={user.email} onClick={() => handleUserClick(user)}>
          <Avatar src={user.profileImage}></Avatar>
          <UserInfo>
            <UserName>{user.fullName}</UserName>
            <LastMessage 
                $isUnread={user.isUnread} 
                $isSentByCurrentUser={user.isSentByCurrentUser}
              >
                {user.lastMessage}
              </LastMessage>


          </UserInfo>
        </UserItem>
      );
    }
    return null;
  })}
</UserContainer>

    </Container>
  );
};

export default UserList;

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: white;
`;

const SearchBar = styled.input`
  padding: 10px;
  border: none;
  border-bottom: 1px solid #e0e0e0;
  outline: none;
  font-size: 14px;
  
  @media (max-width: 768px) {
    padding: 12px;
    font-size: 16px; /* Larger font for better touch targets */
  }
`;

const UserContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  
  @media (max-width: 768px) {
    padding: 5px;
  }
`;

const UserItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
  background-color: ${props => props.selected ? "#f0f0f0" : "transparent"};
  
  &:hover {
    background-color: #f5f5f5;
  }
  
  @media (max-width: 768px) {
    padding: 12px 10px;
  }
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 15px;
  
  @media (max-width: 768px) {
    width: 45px;
    height: 45px;
    margin-right: 12px;
  }
  
  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
    margin-right: 10px;
  }
`;

const UserInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const UserName = styled.div`
  font-weight: bold;
  margin-bottom: 3px;
  
  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const LastMessage = styled.div`
  font-size: 13px;
  color: ${props => props.$isUnread ? "#006d77" : "#666"};
  font-weight: ${props => props.$isUnread ? "bold" : "normal"};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
  
  @media (max-width: 768px) {
    max-width: 180px;
  }
  
  @media (max-width: 480px) {
    font-size: 12px;
    max-width: 150px;
  }
`;


