import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  FiSearch, 
  FiFilter, 
  FiEdit, 
  FiTrash2, 
  FiEye, 
  FiPlus,
  FiUser,
  FiMail,
  FiCalendar,
  FiShield,
  FiMoreVertical
} from 'react-icons/fi';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: #6366f1;
  font-size: 2rem;
  font-weight: 900;
  margin: 0;
`;

const Button = styled.button`
  padding: 0.8rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.9rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &.primary {
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(99, 102, 241, 0.3);
    }
  }
`;

const SearchBar = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SearchInput = styled.div`
  position: relative;
  flex: 1;
  
  input {
    width: 100%;
    padding: 0.8rem 1rem 0.8rem 3rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(99, 102, 241, 0.3);
    border-radius: 10px;
    color: #e2e8f0;
    font-size: 1rem;
    
    &:focus {
      outline: none;
      border-color: #6366f1;
      background: rgba(255, 255, 255, 0.1);
    }
    
    &::placeholder {
      color: #64748b;
    }
  }
  
  svg {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #6366f1;
  }
`;

const FilterSelect = styled.select`
  padding: 0.8rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: 10px;
  color: #e2e8f0;
  font-size: 1rem;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #6366f1;
  }
  
  option {
    background: #1e293b;
    color: #e2e8f0;
  }
`;

const UserGrid = styled.div`
  display: grid;
  gap: 1.5rem;
`;

const UserCard = styled.div`
  background: rgba(30, 41, 59, 0.95);
  border-radius: 15px;
  padding: 1.5rem;
  border: 1px solid rgba(99, 102, 241, 0.2);
  transition: all 0.2s;
  
  &:hover {
    border-color: #6366f1;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(99, 102, 241, 0.1);
  }
`;

const UserHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const UserAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: ${props => props.image ? `url(${props.image}) center/cover` : 'linear-gradient(135deg, #6366f1, #8b5cf6)'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1.2rem;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.h3`
  color: #e2e8f0;
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0 0 0.2rem 0;
`;

const UserEmail = styled.div`
  color: #a5b4fc;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
`;

const UserActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 6px;
  padding: 0.5rem;
  color: #a5b4fc;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: rgba(99, 102, 241, 0.2);
    color: white;
  }
  
  &.danger:hover {
    background: #ef4444;
    border-color: #ef4444;
  }
`;

const UserMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: #a5b4fc;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
`;

const RoleBadge = styled.span`
  background: ${props => {
    switch (props.role) {
      case 'admin': return 'rgba(239, 68, 68, 0.2)';
      case 'blog_writer': return 'rgba(34, 197, 94, 0.2)';
      case 'moderator': return 'rgba(59, 130, 246, 0.2)';
      default: return 'rgba(156, 163, 175, 0.2)';
    }
  }};
  color: ${props => {
    switch (props.role) {
      case 'admin': return '#ef4444';
      case 'blog_writer': return '#22c55e';
      case 'moderator': return '#3b82f6';
      default: return '#9ca3af';
    }
  }};
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
`;

const StatusBadge = styled.span`
  background: ${props => props.active ? 'rgba(34, 197, 94, 0.2)' : 'rgba(156, 163, 175, 0.2)'};
  color: ${props => props.active ? '#22c55e' : '#9ca3af'};
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
`;

const UserStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(99, 102, 241, 0.2);
`;

const Stat = styled.div`
  text-align: center;
`;

const StatNumber = styled.div`
  color: #6366f1;
  font-size: 1.2rem;
  font-weight: 700;
`;

const StatLabel = styled.div`
  color: #a5b4fc;
  font-size: 0.8rem;
`;

export default function UserManagement() {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'blog_writer',
      status: 'active',
      joinDate: '2024-01-01',
      avatar: null,
      stats: {
        blogs: 15,
        views: '12.5K',
        rating: 4.8
      }
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: 'admin',
      status: 'active',
      joinDate: '2023-12-15',
      avatar: null,
      stats: {
        blogs: 8,
        views: '8.2K',
        rating: 4.9
      }
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike.johnson@example.com',
      role: 'moderator',
      status: 'active',
      joinDate: '2024-01-10',
      avatar: null,
      stats: {
        blogs: 23,
        views: '18.7K',
        rating: 4.7
      }
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
      <Header>
        <Title>User Management</Title>
        <Button className="primary">
          <FiPlus />
          Add New User
        </Button>
      </Header>

      <SearchBar>
        <SearchInput>
          <FiSearch />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchInput>
        <FilterSelect value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="blog_writer">Blog Writer</option>
          <option value="moderator">Moderator</option>
        </FilterSelect>
      </SearchBar>

      <UserGrid>
        {filteredUsers.map(user => (
          <UserCard key={user.id}>
            <UserHeader>
              <UserAvatar image={user.avatar}>
                {!user.avatar && user.name.charAt(0)}
              </UserAvatar>
              <UserInfo>
                <UserName>{user.name}</UserName>
                <UserEmail>
                  <FiMail size={14} />
                  {user.email}
                </UserEmail>
              </UserInfo>
              <UserActions>
                <ActionButton onClick={() => handleView(user.id)}>
                  <FiEye size={16} />
                </ActionButton>
                <ActionButton onClick={() => handleEdit(user.id)}>
                  <FiEdit size={16} />
                </ActionButton>
                <ActionButton className="danger" onClick={() => handleDelete(user.id)}>
                  <FiTrash2 size={16} />
                </ActionButton>
              </UserActions>
            </UserHeader>

            <UserMeta>
              <MetaItem>
                <FiCalendar size={14} />
                Joined {user.joinDate}
              </MetaItem>
              <RoleBadge role={user.role}>
                {user.role.replace('_', ' ')}
              </RoleBadge>
              <StatusBadge active={user.status === 'active'}>
                {user.status}
              </StatusBadge>
            </UserMeta>

            <UserStats>
              <Stat>
                <StatNumber>{user.stats.blogs}</StatNumber>
                <StatLabel>Blogs</StatLabel>
              </Stat>
              <Stat>
                <StatNumber>{user.stats.views}</StatNumber>
                <StatLabel>Views</StatLabel>
              </Stat>
              <Stat>
                <StatNumber>{user.stats.rating}</StatNumber>
                <StatLabel>Rating</StatLabel>
              </Stat>
            </UserStats>
          </UserCard>
        ))}
      </UserGrid>
    </Container>
  );
} 