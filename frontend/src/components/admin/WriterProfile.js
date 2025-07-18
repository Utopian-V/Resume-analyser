import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { 
  FiUser, 
  FiCamera, 
  FiEdit, 
  FiSave, 
  FiX, 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiGlobe,
  FiLinkedin,
  FiTwitter,
  FiGithub,
  FiUpload,
  FiTrash2
} from 'react-icons/fi';

const ProfileContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const ProfileHeader = styled.div`
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border-radius: 20px;
  padding: 3rem 2rem;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/><circle cx="10" cy="60" r="0.5" fill="white" opacity="0.1"/><circle cx="90" cy="40" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
    opacity: 0.3;
  }
`;

const AvatarSection = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const AvatarContainer = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
`;

const Avatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: ${props => props.image ? `url(${props.image}) center/cover` : 'linear-gradient(135deg, #6366f1, #8b5cf6)'};
  border: 4px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
  font-weight: 700;
  position: relative;
  overflow: hidden;
`;

const AvatarUpload = styled.label`
  position: absolute;
  bottom: 0;
  right: 0;
  background: #6366f1;
  border: 3px solid white;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #4f46e5;
    transform: scale(1.1);
  }
  
  input {
    display: none;
  }
`;

const ProfileInfo = styled.div`
  flex: 1;
  color: white;
`;

const ProfileName = styled.h1`
  font-size: 2.5rem;
  font-weight: 900;
  margin: 0 0 0.5rem 0;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const ProfileRole = styled.div`
  font-size: 1.1rem;
  opacity: 0.9;
  margin-bottom: 1rem;
`;

const ProfileStats = styled.div`
  display: flex;
  gap: 2rem;
  
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const Stat = styled.div`
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  opacity: 0.8;
`;

const ProfileForm = styled.div`
  background: rgba(30, 41, 59, 0.95);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
`;

const FormSection = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  color: #6366f1;
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  color: #a5b4fc;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Input = styled.input`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: 10px;
  padding: 0.8rem 1rem;
  color: #e2e8f0;
  font-size: 1rem;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: #6366f1;
    background: rgba(255, 255, 255, 0.1);
  }
  
  &::placeholder {
    color: #64748b;
  }
`;

const TextArea = styled.textarea`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: 10px;
  padding: 0.8rem 1rem;
  color: #e2e8f0;
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: #6366f1;
    background: rgba(255, 255, 255, 0.1);
  }
  
  &::placeholder {
    color: #64748b;
  }
`;

const SocialLinks = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
`;

const SocialInput = styled.div`
  position: relative;
  
  svg {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #6366f1;
  }
  
  input {
    padding-left: 3rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
`;

const Button = styled.button`
  padding: 0.8rem 2rem;
  border-radius: 10px;
  font-weight: 600;
  font-size: 1rem;
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
  
  &.secondary {
    background: rgba(255, 255, 255, 0.1);
    color: #a5b4fc;
    border: 1px solid rgba(99, 102, 241, 0.3);
    
    &:hover {
      background: rgba(255, 255, 255, 0.15);
      color: white;
    }
  }
  
  &.danger {
    background: #ef4444;
    color: white;
    
    &:hover {
      background: #dc2626;
      transform: translateY(-2px);
    }
  }
`;

const TagInput = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: 10px;
  min-height: 50px;
`;

const Tag = styled.span`
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  button {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    padding: 0;
    font-size: 1rem;
    
    &:hover {
      opacity: 0.8;
    }
  }
`;

const TagInputField = styled.input`
  background: none;
  border: none;
  color: #e2e8f0;
  font-size: 0.9rem;
  flex: 1;
  min-width: 100px;
  
  &:focus {
    outline: none;
  }
  
  &::placeholder {
    color: #64748b;
  }
`;

export default function WriterProfile() {
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    website: 'https://johndoe.com',
    bio: 'Experienced technical writer and content creator with 5+ years in the tech industry. Passionate about helping developers and tech professionals grow their careers.',
    expertise: ['JavaScript', 'React', 'Node.js', 'Python', 'Data Science'],
    social: {
      linkedin: 'https://linkedin.com/in/johndoe',
      twitter: 'https://twitter.com/johndoe',
      github: 'https://github.com/johndoe'
    },
    avatar: null
  });

  const [isEditing, setIsEditing] = useState(false);
  const [newTag, setNewTag] = useState('');
  const fileInputRef = useRef();

  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfile(prev => ({ ...prev, avatar: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // Save profile logic here
    setIsEditing(false);
    console.log('Profile saved:', profile);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original data
  };

  const addTag = (e) => {
    if (e.key === 'Enter' && newTag.trim()) {
      setProfile(prev => ({
        ...prev,
        expertise: [...prev.expertise, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setProfile(prev => ({
      ...prev,
      expertise: prev.expertise.filter(tag => tag !== tagToRemove)
    }));
  };

  return (
    <ProfileContainer>
      <ProfileHeader>
        <AvatarSection>
          <AvatarContainer>
            <Avatar image={profile.avatar}>
              {!profile.avatar && profile.name.charAt(0)}
            </Avatar>
            {isEditing && (
              <AvatarUpload>
                <FiCamera size={20} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  ref={fileInputRef}
                />
              </AvatarUpload>
            )}
          </AvatarContainer>
          
          <ProfileInfo>
            <ProfileName>{profile.name}</ProfileName>
            <ProfileRole>Technical Writer & Content Creator</ProfileRole>
            <ProfileStats>
              <Stat>
                <StatNumber>47</StatNumber>
                <StatLabel>Blog Posts</StatLabel>
              </Stat>
              <Stat>
                <StatNumber>12.5K</StatNumber>
                <StatLabel>Total Views</StatLabel>
              </Stat>
              <Stat>
                <StatNumber>4.8</StatNumber>
                <StatLabel>Avg Rating</StatLabel>
              </Stat>
            </ProfileStats>
          </ProfileInfo>
        </AvatarSection>
      </ProfileHeader>

      <ProfileForm>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <SectionTitle>
            <FiUser />
            Profile Information
          </SectionTitle>
          {!isEditing ? (
            <Button className="secondary" onClick={() => setIsEditing(true)}>
              <FiEdit />
              Edit Profile
            </Button>
          ) : (
            <ButtonGroup>
              <Button className="secondary" onClick={handleCancel}>
                <FiX />
                Cancel
              </Button>
              <Button className="primary" onClick={handleSave}>
                <FiSave />
                Save Changes
              </Button>
            </ButtonGroup>
          )}
        </div>

        <FormSection>
          <FormGrid>
            <FormGroup>
              <Label><FiUser /> Full Name</Label>
              <Input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                disabled={!isEditing}
                placeholder="Enter your full name"
              />
            </FormGroup>
            
            <FormGroup>
              <Label><FiMail /> Email</Label>
              <Input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                disabled={!isEditing}
                placeholder="Enter your email"
              />
            </FormGroup>
            
            <FormGroup>
              <Label><FiPhone /> Phone</Label>
              <Input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                disabled={!isEditing}
                placeholder="Enter your phone number"
              />
            </FormGroup>
            
            <FormGroup>
              <Label><FiMapPin /> Location</Label>
              <Input
                type="text"
                value={profile.location}
                onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                disabled={!isEditing}
                placeholder="Enter your location"
              />
            </FormGroup>
            
            <FormGroup>
              <Label><FiGlobe /> Website</Label>
              <Input
                type="url"
                value={profile.website}
                onChange={(e) => setProfile(prev => ({ ...prev, website: e.target.value }))}
                disabled={!isEditing}
                placeholder="Enter your website URL"
              />
            </FormGroup>
          </FormGrid>
        </FormSection>

        <FormSection>
          <SectionTitle>
            <FiEdit />
            Bio & Expertise
          </SectionTitle>
          <FormGroup>
            <Label>Bio</Label>
            <TextArea
              value={profile.bio}
              onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
              disabled={!isEditing}
              placeholder="Tell us about yourself, your experience, and what you write about..."
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Areas of Expertise</Label>
            <TagInput>
              {profile.expertise.map(tag => (
                <Tag key={tag}>
                  {tag}
                  {isEditing && (
                    <button onClick={() => removeTag(tag)}>
                      <FiX size={14} />
                    </button>
                  )}
                </Tag>
              ))}
              {isEditing && (
                <TagInputField
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={addTag}
                  placeholder="Add expertise..."
                />
              )}
            </TagInput>
          </FormGroup>
        </FormSection>

        <FormSection>
          <SectionTitle>
            <FiGlobe />
            Social Links
          </SectionTitle>
          <SocialLinks>
            <FormGroup>
              <Label><FiLinkedin /> LinkedIn</Label>
              <SocialInput>
                <FiLinkedin />
                <Input
                  type="url"
                  value={profile.social.linkedin}
                  onChange={(e) => setProfile(prev => ({ 
                    ...prev, 
                    social: { ...prev.social, linkedin: e.target.value }
                  }))}
                  disabled={!isEditing}
                  placeholder="LinkedIn profile URL"
                />
              </SocialInput>
            </FormGroup>
            
            <FormGroup>
              <Label><FiTwitter /> Twitter</Label>
              <SocialInput>
                <FiTwitter />
                <Input
                  type="url"
                  value={profile.social.twitter}
                  onChange={(e) => setProfile(prev => ({ 
                    ...prev, 
                    social: { ...prev.social, twitter: e.target.value }
                  }))}
                  disabled={!isEditing}
                  placeholder="Twitter profile URL"
                />
              </SocialInput>
            </FormGroup>
            
            <FormGroup>
              <Label><FiGithub /> GitHub</Label>
              <SocialInput>
                <FiGithub />
                <Input
                  type="url"
                  value={profile.social.github}
                  onChange={(e) => setProfile(prev => ({ 
                    ...prev, 
                    social: { ...prev.social, github: e.target.value }
                  }))}
                  disabled={!isEditing}
                  placeholder="GitHub profile URL"
                />
              </SocialInput>
            </FormGroup>
          </SocialLinks>
        </FormSection>
      </ProfileForm>
    </ProfileContainer>
  );
} 