import React, { useState,useEffect } from "react";
import styled from "styled-components";
import axios from "axios";

const UserList = ({ users, setSelectedUser,messages,selectedUser,currentUser }) => {
  const [search, setSearch] = useState("");
  const [updatedUsers, setUpdatedUsers] = useState([]);
  const [openedUsers, setOpenedUsers] = useState(new Set());

  console.log(messages)

  useEffect(() => {
    const fetchLatestMessages = async () => {
      try {
        const response = await axios.get("/api/messages/latest-messages");
        const latestMessages = response.data;

        const messageMap = new Map();
        latestMessages.forEach(({ _id, lastMessage, isRead, sender }) => {
          const userKey = sender === currentUser.email ? _id.receiver : sender;
          messageMap.set(userKey, { text: lastMessage, isRead, sender });
        });

        const usersWithMessages = users
          .filter(user => user.email !== currentUser.email) // Exclude self
          .map(user => ({
            ...user,
            lastMessage: messageMap.get(user.email)?.text || null,
            isUnread: messageMap.get(user.email)?.isRead === false,
            isSentByCurrentUser: messageMap.get(user.email)?.sender === currentUser.email, // Check if sender is current user
          }));

        setUpdatedUsers(usersWithMessages);
      } catch (error) {
        console.error("Error fetching latest messages:", error);
      }
    };

    if (users.length > 0) {
      fetchLatestMessages();
    }
  }, [users, currentUser,messages]);

const handleUserClick = (user) => {
    if (selectedUser?.email === user.email) return;
    setSelectedUser(user);
};

const filteredUsers = updatedUsers.filter(user =>
    user.fullName?.toLowerCase().includes(search.toLowerCase())
);
 
  return (
    <Container>
      {/* Search Input */}
      <SearchBar
        type="text"
        placeholder="Search Account"
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
  width: 30%;
  border-right: 1px solid #ddd;
  padding: 10px;
`;

const SearchBar = styled.input`
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
`;

const UserContainer = styled.div`
  max-height: 80vh;
  overflow-y: auto;
`;

const UserItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  cursor: pointer;
  border-radius: 5px;
  &:hover {
    background: #f0f0f0;
  }
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

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.div`
  font-weight: bold;
`;

const LastMessage = styled.div`
  font-size: 12px;
  color: ${({ $isUnread, $isSentByCurrentUser }) => 
    $isSentByCurrentUser ? "grey" : $isUnread ? "red" : "black"};
  font-weight: ${({ $isUnread, $isSentByCurrentUser }) => 
    $isSentByCurrentUser ? "normal" : $isUnread ? "bold" : "normal"};
`;


