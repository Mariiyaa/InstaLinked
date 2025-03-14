import React, { useState,useEffect } from "react";
import styled from "styled-components";
import io from "socket.io-client";
import axios from 'axios'

const socket = io(process.env.REACT_APP_BACK_PORT, {
  transports: ["websocket", "polling"],
  withCredentials: true
});


const ChatWindow = ({ selectedUser, messages, sendMessage,currentUser }) => {
  const [message, setMessage] = useState("");
  const [isOnline, setIsOnline] = useState(false)

  useEffect(() => {
    // Load current user from localStorage

    if (currentUser) {

      socket.emit("userOnline", currentUser.email);
    }

    // Listen for updated user statuses
    socket.on("updateUserStatus", (updatedUsers) => {


      // Update selected user's status
      if (selectedUser) {
        const user = updatedUsers.find((u) => u.email === selectedUser.email);
        setIsOnline(user ? user.isOnline : false);
      }
    });
    

    // Handle user going offline when the page is closed or refreshed
    const handleBeforeUnload = () => {
      if (currentUser) {
        socket.emit("userOffline", currentUser.email);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      socket.emit("userOffline", currentUser?.email);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      socket.off("updateUserStatus");
    };
  }, [selectedUser, currentUser]);

  useEffect(() => {
    if (!selectedUser || messages.length === 0) return;

    // ✅ Log all messages for debugging
    messages.forEach(msg => console.log(`Message: ${msg._id}, Content: ${msg.message}, isRead: ${msg.isRead}, Sender: ${msg.sender}`));

  }, [messages, selectedUser]); // Runs when messages update



  if (!selectedUser || !selectedUser.email) {
    return <Placeholder>Select a user to start chatting</Placeholder>;
  }


  const handleSend = () => {
    if (message.trim()) {
      sendMessage(message);
  console.log(message)
      setMessage("");
    }
  };

  return (
    <ChatContainer>
     {selectedUser && selectedUser.email ?(
        <>
          <Header>
          <Avatar src={selectedUser.profileImage}/>
          <UserName>{selectedUser.email}
          <Status isOnline={isOnline}>{isOnline ? "Online" : "Offline"}</Status>
          </UserName>
          </Header>
          <Messages>
          {messages.map((msg, index) => {
  const date = new Date(msg.createdAt);
  const isValidDate = !isNaN(date.getTime()); // Check if date is valid

  const timeString = isValidDate
    ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : null;

  const dateString = isValidDate
    ? date.toLocaleDateString([], { year: "numeric", month: "short", day: "numeric" })
    : null;

  const isSender = msg.sender !== selectedUser.email;
  const previousDate = index > 0 ? new Date(messages[index - 1].createdAt).toDateString() : null;
  const currentDate = date.toDateString();

  return (
    <React.Fragment key={index}>
      {/* Show date separator if the current message is from a different day */}
      {index === 0 || currentDate !== previousDate ? (
        <DateSeparator>{dateString}</DateSeparator>
      ) : null}

      <Message isSender={isSender}>
        {msg.message}
        
      </Message>
      <Timestamp isSender={isSender}>{timeString}</Timestamp>
    </React.Fragment>
  );
})}

          </Messages>
          <InputContainer>
            <Input
              type="text"
              placeholder="Type Here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <SendButton onClick={handleSend}>Send</SendButton>
          </InputContainer>
        </>
      ) : (
        <Placeholder>Select a user to start chatting</Placeholder>
      )}
    </ChatContainer>
  );
};

export default ChatWindow;

const ChatContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #E5E7EB;
`;

const Header = styled.div`
  background: #FAFAFA;
  padding: 10px;
  display:flex;
  align-items:center;
  font-weight: bold;
`;
const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #007bff;
  color: white;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
`;

const Status = styled.div`
  font-size: 14px;
  color: ${(props) => (props.isOnline ? "green" : "red")};
  font-weight: bold;
;`
const UserName = styled.div`
  font-weight: bold;
`;

const Messages = styled.div`
  flex: 1;
  padding: 10px;
    display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const Message = styled.div`
  background: ${(props) => (props.isSender ? "#006D77" : "#FAFAFA")};
  color: ${(props) => (props.isSender ? "white" : "black")};
  padding: 10px;
  border-radius: 10px;
  max-width: 60%;
  display:flex;
  flex-direction:column;
  align-self: ${(props) => (props.isSender ? "flex-end" : "flex-start")};
  margin: 5px;
`;
const Timestamp = styled.div`
  font-size: 12px;
  color:#737373;
  text-align: ${(props) => (props.isSender ? "right" : "left")};
  margin-top: 0px;
  margin-bottom: 8px;
`;
const DateSeparator = styled.div`
  text-align: center;
  color: #999;
  font-size: 14px;
  font-weight: bold;
  margin: 10px 0;
  position: relative;

 
`;


const InputContainer = styled.div`
  display: flex;
  padding: 10px;
  background: white;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 5px;
`;

const SendButton = styled.button`
  background: #006D77;
  color: white;
  border: none;
  padding: 10px;
  margin-left: 5px;
  border-radius: 5px;
  cursor: pointer;
`;

const Placeholder = styled.div`
  text-align: center;
  padding: 20px;
  color: gray;
`;
