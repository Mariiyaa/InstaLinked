import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { io } from "socket.io-client";
import axios from "axios";
import UserList from "./UserList";
import ChatWindow from "./ChatWindow";
import { useLocation, useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";

const socket = io(process.env.REACT_APP_BACK_PORT, {
  transports: ["websocket", "polling"],
  withCredentials: true
});

const Messages = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const hasRun = useRef(false);
  const [showUserList, setShowUserList] = useState(true);

  // ✅ Fetch logged-in user ONCE
  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  // Handle shared post from location state
  useEffect(() => {
    const handleSharedPost = async () => {
      // Only process if we have location state and haven't processed it yet
      if (location.state?.currentUser && 
          location.state?.selectedUser && 
          location.state?.sharedPost && 
          !hasRun.current) {
            
        hasRun.current = true;
        setSelectedUser(location.state.selectedUser);

        const newMessage = {
          sender: location.state.currentUser.email,
          receiver: location.state.selectedUser.email,
          message: 'shared a post',
          isRead: false,
          sharedPost: {
            _id: location.state.sharedPost._id.toString(),
            image: location.state.sharedPost.url,
            content_type: location.state.sharedPost.content_type,
            author: {
              name: location.state.sharedPost.user.fullName,
              email: location.state.sharedPost.user.email,
              profileImage: location.state.sharedPost.user.profileImage,
            },
            caption: location.state.sharedPost.caption,
            createdAt: new Date(location.state.sharedPost.created_at),
          },
          createdAt: new Date(),
        };

        socket.emit("sendMessage", newMessage);
        
        // Clear the location state by replacing it with just the pathname
        navigate(location.pathname, { replace: true, state: null });
      }
    };

    handleSharedPost();
  }, [location.state, navigate]); // Only depend on location.state and navigate

  // ✅ Fetch users ONCE
  useEffect(() => {
    const fetchUsers = async () => {
      const response = await axios.get("api/profile/getUsers");
      setUsers(response.data);
    };
    fetchUsers();
  }, []);

  // ✅ Fetch messages when selectedUser or currentUser changes
  useEffect(() => {
    if (selectedUser && currentUser?.email) {
      axios
        .get(`/api/messages/${encodeURIComponent(currentUser.email)}/${encodeURIComponent(selectedUser.email)}`)
        .then((res) => setMessages(res.data));
    }
  }, [selectedUser, currentUser]);

  // ✅ Listen for incoming messages and update state
  useEffect(() => {
    const messageHandler = (data) => {
      if (
        (data.sender === currentUser?.email && data.receiver === selectedUser?.email) ||
        (data.sender === selectedUser?.email && data.receiver === currentUser?.email)
      ) {
        setMessages((prev) => {
          // Check if message already exists to prevent duplicates
          const exists = prev.some(msg => 
            msg._id === data._id || 
            (msg.createdAt === data.createdAt && 
             msg.sender === data.sender && 
             msg.message === data.message)
          );
          if (exists) return prev;
          return [...prev, data];
        });
      }
    };

    socket.on("receiveMessage", messageHandler);

    return () => {
      socket.off("receiveMessage", messageHandler);
    };
  }, [selectedUser, currentUser]);

  // ✅ Send message function
  const sendMessage = (message) => {
    if (!selectedUser?.email || !currentUser?.email) return;

    const newMessage = { 
      sender: currentUser.email, 
      receiver: selectedUser.email, 
      message, 
      isRead: false,
      createdAt: new Date()
    };
    
    socket.emit("sendMessage", newMessage);
  };

  const handleCloseMessages = () => {
    if (currentUser) {
      socket.emit("userOffline", currentUser.email);
    }
    navigate("/home");
  };

  return (
    <Container>
      <CloseButton onClick={handleCloseMessages} showUserList={showUserList}>
        <FaTimes />
      </CloseButton>
      <UserListContainer showUserList={showUserList}>
        <UserList 
          users={users} 
          setSelectedUser={(user) => {
            setSelectedUser(user);
            setShowUserList(false);
          }} 
          messages={messages} 
          selectedUser={selectedUser} 
          currentUser={currentUser} 
        />
      </UserListContainer>
      
      <ChatContainer showUserList={showUserList}>
        {selectedUser ? (
          <>
            <MobileHeader>
              <BackButton onClick={() => setShowUserList(true)}>←</BackButton>
              <div>
                <strong>{selectedUser.fullName}</strong>
              </div>
            </MobileHeader>
            <ChatWindow 
              selectedUser={selectedUser} 
              messages={messages} 
              sendMessage={sendMessage} 
              currentUser={currentUser} 
            />
          </>
        ) : (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100%',
            flexDirection: 'column',
            padding: '20px',
            textAlign: 'center'
          }}>
            <h3>Select a conversation</h3>
            <p>Choose a user from the list to start messaging</p>
          </div>
        )}
      </ChatContainer>
    </Container>
  );
};

export default Messages;

const Container = styled.div`
  display: flex;
  height: calc(100vh - 60px);
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
  
  @media (max-width: 768px) {
    height: calc(100vh - 50px);
    border-radius: 0;
  }
`;

const UserListContainer = styled.div`
  width: 30%;
  border-right: 1px solid #e0e0e0;
  overflow-y: auto;
  
  @media (max-width: 768px) {
    width: 100%;
    display: ${props => props.showUserList ? 'block' : 'none'};
    position: absolute;
    height: 100%;
    z-index: 10;
    background: white;
  }
`;

const ChatContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  
  @media (max-width: 768px) {
    width: 100%;
    display: ${props => props.showUserList ? 'none' : 'flex'};
  }
`;

const MobileHeader = styled.div`
  display: none;
  padding: 10px;
  background: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
  
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
  }
`;

const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  margin-right: 10px;
  cursor: pointer;
  color: #006d77;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  z-index: 100;
  background: rgba(255, 255, 255, 0.8);
  border: none;
  color: #333;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.2s;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background-color: rgba(255, 255, 255, 1);
    color: #006d77;
    transform: scale(1.05);
  }
  
  @media (max-width: 768px) {
    display: ${props => props.showUserList ? 'flex' : 'none'};
  }
`;
