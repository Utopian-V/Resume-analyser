import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  color: #6366f1;
  margin-bottom: 2rem;
`;

const SearchBar = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 0.75rem;
  background: #334155;
  border: 1px solid #475569;
  border-radius: 4px;
  color: #fff;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #6366f1;
  }
`;

const FilterSelect = styled.select`
  padding: 0.75rem;
  background: #334155;
  border: 1px solid #475569;
  border-radius: 4px;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #6366f1;
  }
  
  option {
    background: #1e293b;
    color: #fff;
  }
`;

const UserGrid = styled.div`
  display: grid;
  gap: 1rem;
`;

const UserCard = styled.div`
  background: #1e293b;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #334155;
`;

const UserHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.h3`
  color: #fff;
  margin: 0 0 0.5rem 0;
`;

const UserEmail = styled.div`
  color: #94a3b8;
  font-size: 0.9rem;
`;

const UserActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  background: #475569;
  border: 1px solid #64748b;
  border-radius: 4px;
  padding: 0.5rem;
  color: #fff;
  cursor: pointer;
  
  &:hover {
    background: #6366f1;
  }
  
  &.danger:hover {
    background: #ef4444;
  }
`;

const UserMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 0.9rem;
  color: #94a3b8;
`;

const RoleBadge = styled.span`
  background: ${props => {
    switch (props.role) {
      case 'admin': return '#ef4444';
      case 'writer': return '#6366f1';
      case 'user': return '#22c55e';
      default: return '#64748b';
    }
  }};
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
`;

export default function UserManagement() {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'admin',
      joinDate: '2023-01-15',
      lastActive: '2024-01-20'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: 'writer',
      joinDate: '2023-03-10',
      lastActive: '2024-01-19'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike.johnson@example.com',
      role: 'user',
      joinDate: '2023-06-22',
      lastActive: '2024-01-18'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleEdit = (userId) => {
    console.log('Edit user:', userId);
  };

  const handleDelete = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(prev => prev.filter(user => user.id !== userId));
    }
  };

  const handleView = (userId) => {
    console.log('View user:', userId);
  };

  return (
    <Container>
      <Title>User Management</Title>

      <SearchBar>
        <SearchInput
          type="text"
          placeholder="Search users by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FilterSelect value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="writer">Writer</option>
          <option value="user">User</option>
        </FilterSelect>
      </SearchBar>

      <UserGrid>
        {filteredUsers.map(user => (
          <UserCard key={user.id}>
            <UserHeader>
              <UserInfo>
                <UserName>{user.name}</UserName>
                <UserEmail>{user.email}</UserEmail>
              </UserInfo>
              <UserActions>
                <ActionButton onClick={() => handleView(user.id)}>
                  View
                </ActionButton>
                <ActionButton onClick={() => handleEdit(user.id)}>
                  Edit
                </ActionButton>
                <ActionButton className="danger" onClick={() => handleDelete(user.id)}>
                  Delete
                </ActionButton>
              </UserActions>
            </UserHeader>

            <UserMeta>
              <RoleBadge role={user.role}>
                {user.role}
              </RoleBadge>
              <span>Joined: {user.joinDate}</span>
              <span>Last Active: {user.lastActive}</span>
            </UserMeta>
          </UserCard>
        ))}
      </UserGrid>
    </Container>
  );
} 