import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  color: #6366f1;
  margin-bottom: 2rem;
`;

const Form = styled.form`
  background: #1e293b;
  padding: 2rem;
  border-radius: 8px;
  border: 1px solid #334155;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  color: #94a3b8;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
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

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  background: #334155;
  border: 1px solid #475569;
  border-radius: 4px;
  color: #fff;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #6366f1;
  }
`;

const Button = styled.button`
  background: #6366f1;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  margin-right: 1rem;
  
  &:hover {
    background: #5855eb;
  }
`;

const AvatarSection = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Avatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: #334155;
  margin: 0 auto 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: #94a3b8;
  border: 2px solid #6366f1;
`;

const TagInput = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.5rem;
  background: #334155;
  border: 1px solid #475569;
  border-radius: 4px;
  min-height: 50px;
`;

const Tag = styled.span`
  background: #6366f1;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const RemoveTag = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1rem;
`;

export default function WriterProfile() {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    bio: '',
    expertise: [],
    socialLinks: {
      linkedin: '',
      twitter: '',
      github: ''
    },
    avatar: null
  });

  const [newTag, setNewTag] = useState('');

  const handleInputChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSocialLinkChange = (platform, value) => {
    setProfile(prev => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [platform]: value }
    }));
  };

  const addTag = (e) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      if (!profile.expertise.includes(newTag.trim())) {
        setProfile(prev => ({
          ...prev,
          expertise: [...prev.expertise, newTag.trim()]
        }));
      }
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setProfile(prev => ({
      ...prev,
      expertise: prev.expertise.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Profile saved:', profile);
    alert('Profile saved successfully!');
  };

  return (
    <Container>
      <Title>Writer Profile</Title>
      
      <Form onSubmit={handleSubmit}>
        <AvatarSection>
          <Avatar>
            {profile.avatar ? '📷' : '👤'}
          </Avatar>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setProfile(prev => ({ ...prev, avatar: file }));
              }
            }}
          />
        </AvatarSection>

        <FormGroup>
          <Label>Full Name</Label>
          <Input
            type="text"
            value={profile.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter your full name"
          />
        </FormGroup>

        <FormGroup>
          <Label>Email</Label>
          <Input
            type="email"
            value={profile.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="Enter your email"
          />
        </FormGroup>

        <FormGroup>
          <Label>Bio</Label>
          <TextArea
            value={profile.bio}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            placeholder="Tell us about yourself..."
          />
        </FormGroup>

        <FormGroup>
          <Label>Areas of Expertise</Label>
          <TagInput>
            {profile.expertise.map(tag => (
              <Tag key={tag}>
                {tag}
                <RemoveTag onClick={() => removeTag(tag)}>×</RemoveTag>
              </Tag>
            ))}
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={addTag}
              placeholder="Add expertise..."
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fff',
                flex: 1,
                minWidth: '120px'
              }}
            />
          </TagInput>
        </FormGroup>

        <FormGroup>
          <Label>LinkedIn</Label>
          <Input
            type="url"
            value={profile.socialLinks.linkedin}
            onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
            placeholder="https://linkedin.com/in/yourprofile"
          />
        </FormGroup>

        <FormGroup>
          <Label>Twitter</Label>
          <Input
            type="url"
            value={profile.socialLinks.twitter}
            onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
            placeholder="https://twitter.com/yourhandle"
          />
        </FormGroup>

        <FormGroup>
          <Label>GitHub</Label>
          <Input
            type="url"
            value={profile.socialLinks.github}
            onChange={(e) => handleSocialLinkChange('github', e.target.value)}
            placeholder="https://github.com/yourusername"
          />
        </FormGroup>

        <div>
          <Button type="submit">Save Profile</Button>
          <Button type="button" onClick={() => setProfile({
            name: '',
            email: '',
            bio: '',
            expertise: [],
            socialLinks: { linkedin: '', twitter: '', github: '' },
            avatar: null
          })}>
            Reset
          </Button>
        </div>
      </Form>
    </Container>
  );
} 