import React, { useState } from "react";
import styled from "styled-components";

const UserList = ({ users, setSelectedUser,messages }) => {
  const [search, setSearch] = useState("");
 

  // Filter users based on search input
  const filteredUsers = users.filter((user) =>
    user.fullName?.toLowerCase().includes(search.toLowerCase())
  );
  const getLastMessage = (user) => {
    const userMessages = messages.filter(
      (msg) => msg.sender === user.email || msg.receiver === user.email
    );
    return userMessages.length > 0
      ? userMessages[userMessages.length - 1].message // Get the last message
      : "No messages yet";
  };

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
        {filteredUsers.map((user) => (
          <UserItem key={user._id} onClick={() => setSelectedUser(user)}>
            <Avatar src={user.profileImage}></Avatar>
            <UserInfo>
              <UserName>{user.fullName}</UserName>
              <LastMessage>{getLastMessage(user)}</LastMessage>
            </UserInfo>
          </UserItem>
        ))}
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
  color: gray;
`;
