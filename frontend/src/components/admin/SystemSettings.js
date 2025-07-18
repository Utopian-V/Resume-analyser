import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  FiSettings, 
  FiSave, 
  FiGlobe,
  FiMail,
  FiShield,
  FiDatabase,
  FiMonitor
} from 'react-icons/fi';

const Container = styled.div`
  max-width: 800px;
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

const SettingsSection = styled.div`
  background: rgba(30, 41, 59, 0.95);
  border-radius: 15px;
  padding: 2rem;
  margin-bottom: 2rem;
  border: 1px solid rgba(99, 102, 241, 0.2);
`;

const SectionTitle = styled.h3`
  color: #6366f1;
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0 0 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  color: #a5b4fc;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  display: block;
`;

const Input = styled.input`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: 8px;
  padding: 0.8rem;
  color: #e2e8f0;
  font-size: 0.9rem;
  width: 100%;
  
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
  border-radius: 8px;
  padding: 0.8rem;
  color: #e2e8f0;
  font-size: 0.9rem;
  width: 100%;
  min-height: 80px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #6366f1;
    background: rgba(255, 255, 255, 0.1);
  }
  
  &::placeholder {
    color: #64748b;
  }
`;

const Select = styled.select`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: 8px;
  padding: 0.8rem;
  color: #e2e8f0;
  font-size: 0.9rem;
  width: 100%;
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

const Toggle = styled.label`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  cursor: pointer;
  
  input {
    display: none;
  }
  
  .toggle-slider {
    width: 50px;
    height: 24px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    position: relative;
    transition: all 0.3s;
    
    &::after {
      content: '';
      position: absolute;
      top: 2px;
      left: 2px;
      width: 20px;
      height: 20px;
      background: #a5b4fc;
      border-radius: 50%;
      transition: all 0.3s;
    }
  }
  
  input:checked + .toggle-slider {
    background: #6366f1;
    
    &::after {
      transform: translateX(26px);
      background: white;
    }
  }
`;

export default function SystemSettings() {
  const [settings, setSettings] = useState({
    site: {
      name: 'Prep Nexus',
      description: 'Your comprehensive platform for career preparation and skill development',
      url: 'https://prepnexus.com',
      logo: ''
    },
    email: {
      smtpHost: 'smtp.gmail.com',
      smtpPort: '587',
      username: 'noreply@prepnexus.com',
      password: ''
    },
    security: {
      enableTwoFactor: true,
      sessionTimeout: '24',
      maxLoginAttempts: '5'
    },
    content: {
      autoApproveBlogs: false,
      enableComments: true,
      moderationRequired: true
    },
    performance: {
      enableCaching: true,
      cacheTimeout: '3600',
      enableCDN: true
    }
  });

  const handleSave = () => {
    console.log('Saving settings:', settings);
    // Save logic here
  };

  const updateSetting = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  return (
    <Container>
      <Header>
        <Title>System Settings</Title>
        <Button className="primary" onClick={handleSave}>
          <FiSave />
          Save Settings
        </Button>
      </Header>

      <SettingsSection>
        <SectionTitle>
          <FiGlobe />
          Site Configuration
        </SectionTitle>
        
        <FormGroup>
          <Label>Site Name</Label>
          <Input
            type="text"
            value={settings.site.name}
            onChange={(e) => updateSetting('site', 'name', e.target.value)}
            placeholder="Enter site name"
          />
        </FormGroup>
        
        <FormGroup>
          <Label>Site Description</Label>
          <TextArea
            value={settings.site.description}
            onChange={(e) => updateSetting('site', 'description', e.target.value)}
            placeholder="Enter site description"
          />
        </FormGroup>
        
        <FormGroup>
          <Label>Site URL</Label>
          <Input
            type="url"
            value={settings.site.url}
            onChange={(e) => updateSetting('site', 'url', e.target.value)}
            placeholder="https://example.com"
          />
        </FormGroup>
      </SettingsSection>

      <SettingsSection>
        <SectionTitle>
          <FiMail />
          Email Configuration
        </SectionTitle>
        
        <FormGroup>
          <Label>SMTP Host</Label>
          <Input
            type="text"
            value={settings.email.smtpHost}
            onChange={(e) => updateSetting('email', 'smtpHost', e.target.value)}
            placeholder="smtp.gmail.com"
          />
        </FormGroup>
        
        <FormGroup>
          <Label>SMTP Port</Label>
          <Input
            type="number"
            value={settings.email.smtpPort}
            onChange={(e) => updateSetting('email', 'smtpPort', e.target.value)}
            placeholder="587"
          />
        </FormGroup>
        
        <FormGroup>
          <Label>Email Username</Label>
          <Input
            type="email"
            value={settings.email.username}
            onChange={(e) => updateSetting('email', 'username', e.target.value)}
            placeholder="noreply@example.com"
          />
        </FormGroup>
        
        <FormGroup>
          <Label>Email Password</Label>
          <Input
            type="password"
            value={settings.email.password}
            onChange={(e) => updateSetting('email', 'password', e.target.value)}
            placeholder="Enter email password"
          />
        </FormGroup>
      </SettingsSection>

      <SettingsSection>
        <SectionTitle>
          <FiShield />
          Security Settings
        </SectionTitle>
        
        <FormGroup>
          <Toggle>
            <input
              type="checkbox"
              checked={settings.security.enableTwoFactor}
              onChange={(e) => updateSetting('security', 'enableTwoFactor', e.target.checked)}
            />
            <span className="toggle-slider"></span>
            Enable Two-Factor Authentication
          </Toggle>
        </FormGroup>
        
        <FormGroup>
          <Label>Session Timeout (hours)</Label>
          <Select
            value={settings.security.sessionTimeout}
            onChange={(e) => updateSetting('security', 'sessionTimeout', e.target.value)}
          >
            <option value="1">1 hour</option>
            <option value="6">6 hours</option>
            <option value="12">12 hours</option>
            <option value="24">24 hours</option>
          </Select>
        </FormGroup>
        
        <FormGroup>
          <Label>Maximum Login Attempts</Label>
          <Select
            value={settings.security.maxLoginAttempts}
            onChange={(e) => updateSetting('security', 'maxLoginAttempts', e.target.value)}
          >
            <option value="3">3 attempts</option>
            <option value="5">5 attempts</option>
            <option value="10">10 attempts</option>
          </Select>
        </FormGroup>
      </SettingsSection>

      <SettingsSection>
        <SectionTitle>
          <FiDatabase />
          Content Management
        </SectionTitle>
        
        <FormGroup>
          <Toggle>
            <input
              type="checkbox"
              checked={settings.content.autoApproveBlogs}
              onChange={(e) => updateSetting('content', 'autoApproveBlogs', e.target.checked)}
            />
            <span className="toggle-slider"></span>
            Auto-approve blog posts
          </Toggle>
        </FormGroup>
        
        <FormGroup>
          <Toggle>
            <input
              type="checkbox"
              checked={settings.content.enableComments}
              onChange={(e) => updateSetting('content', 'enableComments', e.target.checked)}
            />
            <span className="toggle-slider"></span>
            Enable comments on blogs
          </Toggle>
        </FormGroup>
        
        <FormGroup>
          <Toggle>
            <input
              type="checkbox"
              checked={settings.content.moderationRequired}
              onChange={(e) => updateSetting('content', 'moderationRequired', e.target.checked)}
            />
            <span className="toggle-slider"></span>
            Require content moderation
          </Toggle>
        </FormGroup>
      </SettingsSection>

      <SettingsSection>
        <SectionTitle>
          <FiMonitor />
          Performance Settings
        </SectionTitle>
        
        <FormGroup>
          <Toggle>
            <input
              type="checkbox"
              checked={settings.performance.enableCaching}
              onChange={(e) => updateSetting('performance', 'enableCaching', e.target.checked)}
            />
            <span className="toggle-slider"></span>
            Enable caching
          </Toggle>
        </FormGroup>
        
        <FormGroup>
          <Label>Cache Timeout (seconds)</Label>
          <Input
            type="number"
            value={settings.performance.cacheTimeout}
            onChange={(e) => updateSetting('performance', 'cacheTimeout', e.target.value)}
            placeholder="3600"
          />
        </FormGroup>
        
        <FormGroup>
          <Toggle>
            <input
              type="checkbox"
              checked={settings.performance.enableCDN}
              onChange={(e) => updateSetting('performance', 'enableCDN', e.target.checked)}
            />
            <span className="toggle-slider"></span>
            Enable CDN for static assets
          </Toggle>
        </FormGroup>
      </SettingsSection>
    </Container>
  );
} 