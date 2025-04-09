import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import socket from "../socket";
import { FaPaperPlane } from "react-icons/fa";

const ChatWindow = ({ selectedUser, messages, sendMessage, currentUser }) => {
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const [isOnline, setIsOnline] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      socket.connect();
      socket.emit("userOnline", currentUser.email);
    }

    // Listen for updated user statuses
    const handleUserStatus = (updatedUsers) => {
      if (selectedUser) {
        const user = updatedUsers.find((u) => u.email === selectedUser.email);
        setIsOnline(user ? user.isOnline : false);
      }
    };

    socket.on("updateUserStatus", handleUserStatus);

    // Handle user going offline when the page is closed or refreshed
    const handleBeforeUnload = () => {
      if (currentUser) {
        socket.emit("userOffline", currentUser.email);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      if (currentUser) {
        socket.emit("userOffline", currentUser.email);
      }
      window.removeEventListener("beforeunload", handleBeforeUnload);
      socket.off("updateUserStatus", handleUserStatus);
      socket.disconnect();
    };
  }, [selectedUser, currentUser]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      sendMessage(newMessage);
      setNewMessage("");
    }
  };

  const renderMessage = (message, index) => {
    if (!message) {
      console.error("Received undefined message");
      return null;
    }

    console.log("Message:", message);
    const date = message.createdAt ? new Date(message.createdAt) : new Date();
    const isValidDate = !isNaN(date.getTime());
    const timeString = isValidDate ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : null;
    const dateString = isValidDate ? date.toLocaleDateString([], { year: "numeric", month: "short", day: "numeric" }) : null;
    const previousDate = index > 0 && messages[index - 1]?.createdAt ? new Date(messages[index - 1].createdAt).toDateString() : null;
    const currentDate = date.toDateString();
    const isOwnMessage = message.sender === currentUser?.email;
  
    return (
      <React.Fragment key={message._id || index}>
        {/* Show date separator */}
        {index === 0 || currentDate !== previousDate ? (
          <DateSeparator>{dateString}</DateSeparator>
        ) : null}
  
        {message.sharedPost ? (
          // If it's a shared post, display formatted post details
          <SharedPostMessage isOwnMessage={isOwnMessage}>
            <strong>{message.sharedPost.author?.name || 'Unknown'} shared a post:</strong>
            <SharedPostCard>
              {message.sharedPost.content_type === 'Image' && (
                <SharedPostImage src={message.sharedPost.image} alt="Shared Post" onClick={() => navigate(`/p/${message.sharedPost._id}`)} />
              )}
              {message.sharedPost.content_type === 'Pdf' && (
                <SharedPostPdf>
                  <PdfIcon>📄</PdfIcon>
                  <PdfText>PDF Document</PdfText>
                </SharedPostPdf>
              )}
              {(message.sharedPost.content_type === 'Reel' || message.sharedPost.content_type === 'Documentary') && (
                <SharedPostVideo>
                  <VideoIcon>🎥</VideoIcon>
                  <VideoText>{message.sharedPost.content_type === 'Reel' ? 'Reel' : 'Documentary'}</VideoText>
                </SharedPostVideo>
              )}
              <SharedPostDetails>
                <SharedPostCaption>{message.sharedPost.caption || "no caption"}</SharedPostCaption>
              </SharedPostDetails>
            </SharedPostCard>
          </SharedPostMessage>
        ) : (
          // Normal message
          <Message isOwnMessage={isOwnMessage}>{message.message || ''}</Message>
        )}
  
        <Timestamp isOwnMessage={isOwnMessage}>{timeString}</Timestamp>
      </React.Fragment>
    );
  };
  

  return (
    <Container>
      {selectedUser ? (
        <>
      <Header>
          <UserAvatar src={selectedUser.profileImage}/>
          <UserName>{selectedUser.email}
          <Status isOnline={isOnline}>{isOnline ? "Online" : "Offline"}</Status>
          </UserName>
          </Header>
          <MessagesContainer>
            {messages.map((msg, index) => renderMessage(msg, index))}
            <div ref={messagesEndRef} />
          </MessagesContainer>
          <InputContainer onSubmit={handleSubmit}>
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
            />
            <SendButton type="submit">
              <FaPaperPlane />
            </SendButton>
          </InputContainer>
        </>
      ) : (
        <NoChatSelected>
          Select a user to start chatting
        </NoChatSelected>
      )}
    </Container>
  );
};

export default ChatWindow;

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
  
  @media (max-width: 768px) {
    height: 100%;
  }
`;

const Header = styled.div`
  background: #FAFAFA;
  padding: 10px;
  display: flex;
  align-items: center;
  font-weight: bold;
  
  @media (max-width: 768px) {
    padding: 8px;
  }
`;
const UserAvatar = styled.img`
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
  
  @media (max-width: 480px) {
    width: 32px;
    height: 32px;
  }
`;

const Status = styled.div`
  font-size: 14px;
  color: ${(props) => (props.isOnline ? "green" : "red")};
  font-weight: bold;
;`
const UserName = styled.div`
  font-weight: bold;
`;

const MessagesContainer = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  
  @media (max-width: 768px) {
    padding: 15px;
  }
  
  @media (max-width: 480px) {
    padding: 10px;
  }
`;

const Message = styled.div`
  max-width: 70%;
  padding: 10px 15px;
  border-radius: 15px;
  background-color: ${props => props.isOwnMessage ? "#006d77" : "white"};
  color: ${props => props.isOwnMessage ? "white" : "#333"};
  align-self: ${props => props.isOwnMessage ? "flex-end" : "flex-start"};
  word-wrap: break-word;
  
  @media (max-width: 768px) {
    max-width: 80%;
  }
  
  @media (max-width: 480px) {
    max-width: 85%;
    padding: 8px 12px;
    font-size: 14px;
  }
`;

const SharedPostMessage = styled(Message)`
  max-width: 80%;
  display: flex;
  flex-direction: column;
  
  @media (max-width: 768px) {
    max-width: 85%;
  }
  
  @media (max-width: 480px) {
    max-width: 90%;
  }
`;

const SharedPostContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SharedPostText = styled.div`
  margin-bottom: 5px;
`;

const SharedPostCard = styled.div`
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-top: 5px;
  
  @media (max-width: 480px) {
    border-radius: 8px;
  }
`;

const SharedPostImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  
  @media (max-width: 768px) {
    height: 180px;
  }
  
  @media (max-width: 480px) {
    height: 150px;
  }
`;

const SharedPostDetails = styled.div`
  padding: 10px;
  
  @media (max-width: 480px) {
    padding: 8px;
  }
`;

const SharedPostAuthor = styled.div`
  font-weight: 500;
  margin-bottom: 5px;
  color:black
`;

const SharedPostCaption = styled.div`
  color: #666;
  font-size: 0.9em;
  
  @media (max-width: 480px) {
    font-size: 0.8em;
  }
`;

const InputContainer = styled.form`
  padding: 15px;
  background-color: white;
  border-top: 1px solid #ddd;
  display: flex;
  gap: 10px;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 20px;
  outline: none;

  &:focus {
    border-color: #006d77;
  }
`;

const SendButton = styled.button`
  background-color: #006d77;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #1557b0;
  }
`;

const NoChatSelected = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 1.2em;
`;

const DateSeparator = styled.div`
  text-align: center;
  color: #888;
  font-size: 0.8em;
  
  @media (max-width: 480px) {
    font-size: 0.7em;
    margin: 8px 0;
  }
`;

const Timestamp = styled.div`
  font-size: 0.7em;
  color: #888;
  margin-top: 2px;
  align-self: ${props => props.isOwnMessage ? "flex-end" : "flex-start"};
  
  @media (max-width: 480px) {
    font-size: 0.6em;
  }
`;

const SharedPostPdf = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: #f5f5f5;
  cursor: pointer;
  &:hover {
    background: #e5e5e5;
  }
  
  @media (max-width: 480px) {
    padding: 15px;
  }
`;

const PdfIcon = styled.div`
  font-size: 48px;
  margin-bottom: 10px;
  
  @media (max-width: 480px) {
    font-size: 36px;
  }
`;

const PdfText = styled.div`
  font-size: 16px;
  color: #333;
  
  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const SharedPostVideo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: #f5f5f5;
  cursor: pointer;
  &:hover {
    background: #e5e5e5;
  }
  
  @media (max-width: 480px) {
    padding: 15px;
  }
`;

const VideoIcon = styled.div`
  font-size: 48px;
  margin-bottom: 10px;
  
  @media (max-width: 480px) {
    font-size: 36px;
  }
`;

const VideoText = styled.div`
  font-size: 16px;
  color: #333;
  
  @media (max-width: 480px) {
    font-size: 14px;
  }
`;