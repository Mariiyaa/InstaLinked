import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { io } from "socket.io-client";
import axios from "axios";
import UserList from "./UserList";
import ChatWindow from "./ChatWindow";

const socket = io(process.env.REACT_APP_BACK_PORT, {
  transports: [ "polling"],
  withCredentials: true
});


const ChatApp = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // ✅ Fetch logged-in user ONCE
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      console.log("Retrieved from localStorage:", user);
      setCurrentUser(user);
    }
  }, []);

  // ✅ Fetch users ONCE
  useEffect(() => {
    axios.get("api/profile/getUsers").then((res) => setUsers(res.data));
  }, []);

  // ✅ Fetch messages when `selectedUser` or `currentUser` changes
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
        setMessages((prev) => [...prev, data]); // ✅ Update messages instantly
      }
    };

    socket.on("receiveMessage", messageHandler);

    return () => {
      socket.off("receiveMessage", messageHandler);
    };
  }, [selectedUser, currentUser, messages]); // ✅ Runs when messages change

  // ✅ Send message function
  const sendMessage = (message) => {
    if (!selectedUser?.email || !currentUser?.email) return;

    const newMessage = { sender: currentUser.email, receiver: selectedUser.email, message };

    // ✅ Send message through Socket.io
    socket.emit("sendMessage", newMessage);

    // ✅ Instantly update sender's UI
    
  };

  return (
    <Container>
      <UserList users={users} setSelectedUser={setSelectedUser} messages={messages} />
      <ChatWindow selectedUser={selectedUser} messages={messages} sendMessage={sendMessage} currentUser={currentUser} />
    </Container>
  );
};

export default ChatApp;

const Container = styled.div`
  display: flex;
  height: 100vh;
`;
