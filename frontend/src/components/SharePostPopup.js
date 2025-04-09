import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import default_user from '../assets/default_user.jpg';


const SharePostPopup = ({ post, onClose }) => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();
  const currentUser = JSON.parse(sessionStorage.getItem('user'));

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await axios.get('api/profile/getUsers');
     const  filteruser=response.data.filter(user => user.email !== currentUser.email)
     setUsers(filteruser)
      console.log(response.data)
    };
    fetchUsers();
  }, []);
console.log(users)
const filteredUsers = users.filter(user =>
  (user.fullName && user.fullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
  (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase()))
);


  const handleSendPost = () => {
    if (!selectedUser) return;
    
    // Navigate to messages with selected user and post data
    navigate('/messages', {
      state: {
        currentUser,
        selectedUser,
        sharedPost: post
      }
    });
  };

  return (
    <PopupOverlay>
      <PopupContent>
        <CloseButton onClick={onClose}>×</CloseButton>
        <Title>Share Post</Title>
        <SearchInput
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <UserList>
          {filteredUsers.map((user) => (
            <UserItem
              key={user.email}
              selected={selectedUser?.email === user.email}
              onClick={() => setSelectedUser(user)}
            >
              <UserAvatar src={user.profileImage || {default_user}} alt={user.name} />
              <UserInfo>
                <UserName>{user.name}</UserName>
                <UserEmail>{user.email}</UserEmail>
              </UserInfo>
            </UserItem>
          ))}
        </UserList>
        <SendButton
          disabled={!selectedUser}
          onClick={handleSendPost}
        >
          Send Post
        </SendButton>
      </PopupContent>
    </PopupOverlay>
  );
};

export default SharePostPopup;

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  
  @media (max-width: 768px) {
    align-items: flex-end;
  }
`;

const PopupContent = styled.div`
  background: white;
  border-radius: 8px;
  width: 400px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  
  @media (max-width: 768px) {
    width: 100%;
    max-height: 90vh;
    border-radius: 12px 12px 0 0;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  
  @media (max-width: 480px) {
    top: 8px;
    right: 8px;
    font-size: 20px;
  }
`;

const Title = styled.h2`
  margin: 20px 0;
  text-align: center;
  color: #333;
  
  @media (max-width: 480px) {
    margin: 15px 0;
    font-size: 18px;
  }
`;

const SearchInput = styled.input`
  margin: 0 20px 20px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: calc(100% - 40px);
  
  @media (max-width: 480px) {
    margin: 0 15px 15px;
    padding: 8px;
    width: calc(100% - 30px);
  }
`;

const UserList = styled.div`
  overflow-y: auto;
  max-height: 50vh;
  padding: 0 20px;
  
  @media (max-width: 768px) {
    max-height: 60vh;
  }
  
  @media (max-width: 480px) {
    padding: 0 15px;
    max-height: 50vh;
  }
`;

const UserItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  background-color: ${props => props.selected ? "#f0f0f0" : "transparent"};
  
  &:hover {
    background-color: #f5f5f5;
  }
  
  @media (max-width: 480px) {
    padding: 8px;
  }
`;

const UserAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 10px;
  
  @media (max-width: 480px) {
    width: 36px;
    height: 36px;
    margin-right: 8px;
  }
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.div`
  font-weight: bold;
  
  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const UserEmail = styled.div`
  font-size: 12px;
  color: #666;
  
  @media (max-width: 480px) {
    font-size: 11px;
  }
`;

const SendButton = styled.button`
  margin: 20px;
  padding: 10px;
  background-color: ${props => props.disabled ? "#ccc" : "#006d77"};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: ${props => props.disabled ? "not-allowed" : "pointer"};
  
  @media (max-width: 480px) {
    margin: 15px;
    padding: 8px;
    font-size: 14px;
  }
`;