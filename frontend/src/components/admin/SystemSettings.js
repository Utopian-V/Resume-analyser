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

const Section = styled.div`
  background: #1e293b;
  padding: 2rem;
  border-radius: 8px;
  border: 1px solid #334155;
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  color: #fff;
  margin-bottom: 1.5rem;
  font-size: 1.3rem;
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

const Select = styled.select`
  width: 100%;
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

const Toggle = styled.label`
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  color: #fff;
`;

const ToggleInput = styled.input`
  appearance: none;
  width: 50px;
  height: 25px;
  background: #475569;
  border-radius: 25px;
  position: relative;
  cursor: pointer;
  
  &:checked {
    background: #6366f1;
  }
  
  &:before {
    content: '';
    position: absolute;
    width: 21px;
    height: 21px;
    border-radius: 50%;
    background: #fff;
    top: 2px;
    left: 2px;
    transition: transform 0.2s;
  }
  
  &:checked:before {
    transform: translateX(25px);
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

export default function SystemSettings() {
  const [settings, setSettings] = useState({
    site: {
      name: 'PrepNexus',
      description: 'Your comprehensive platform for interview preparation',
      url: 'https://prepnexus.com',
      maintenance: false
    },
    email: {
      smtpHost: 'smtp.gmail.com',
      smtpPort: '587',
      username: 'noreply@prepnexus.com',
      password: '',
      fromName: 'PrepNexus Team'
    },
    security: {
      requireEmailVerification: true,
      allowRegistration: true,
      maxLoginAttempts: 5,
      sessionTimeout: 24
    },
    content: {
      allowComments: true,
      moderateComments: true,
      maxFileSize: 5,
      allowedFileTypes: 'jpg,jpeg,png,pdf,doc,docx'
    }
  });

  const handleInputChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    console.log('Settings saved:', settings);
    alert('Settings saved successfully!');
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all settings to default?')) {
      setSettings({
        site: {
          name: 'PrepNexus',
          description: 'Your comprehensive platform for interview preparation',
          url: 'https://prepnexus.com',
          maintenance: false
        },
        email: {
          smtpHost: 'smtp.gmail.com',
          smtpPort: '587',
          username: 'noreply@prepnexus.com',
          password: '',
          fromName: 'PrepNexus Team'
        },
        security: {
          requireEmailVerification: true,
          allowRegistration: true,
          maxLoginAttempts: 5,
          sessionTimeout: 24
        },
        content: {
          allowComments: true,
          moderateComments: true,
          maxFileSize: 5,
          allowedFileTypes: 'jpg,jpeg,png,pdf,doc,docx'
        }
      });
    }
  };

  return (
    <Container>
      <Title>System Settings</Title>

      <Section>
        <SectionTitle>Site Settings</SectionTitle>
        <FormGroup>
          <Label>Site Name</Label>
          <Input
            type="text"
            value={settings.site.name}
            onChange={(e) => handleInputChange('site', 'name', e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Label>Site Description</Label>
          <TextArea
            value={settings.site.description}
            onChange={(e) => handleInputChange('site', 'description', e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Label>Site URL</Label>
          <Input
            type="url"
            value={settings.site.url}
            onChange={(e) => handleInputChange('site', 'url', e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Toggle>
            <ToggleInput
              type="checkbox"
              checked={settings.site.maintenance}
              onChange={(e) => handleInputChange('site', 'maintenance', e.target.checked)}
            />
            Maintenance Mode
          </Toggle>
        </FormGroup>
      </Section>

      <Section>
        <SectionTitle>Email Settings</SectionTitle>
        <FormGroup>
          <Label>SMTP Host</Label>
          <Input
            type="text"
            value={settings.email.smtpHost}
            onChange={(e) => handleInputChange('email', 'smtpHost', e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Label>SMTP Port</Label>
          <Input
            type="number"
            value={settings.email.smtpPort}
            onChange={(e) => handleInputChange('email', 'smtpPort', e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Label>Username</Label>
          <Input
            type="text"
            value={settings.email.username}
            onChange={(e) => handleInputChange('email', 'username', e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Label>Password</Label>
          <Input
            type="password"
            value={settings.email.password}
            onChange={(e) => handleInputChange('email', 'password', e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Label>From Name</Label>
          <Input
            type="text"
            value={settings.email.fromName}
            onChange={(e) => handleInputChange('email', 'fromName', e.target.value)}
          />
        </FormGroup>
      </Section>

      <Section>
        <SectionTitle>Security Settings</SectionTitle>
        <FormGroup>
          <Toggle>
            <ToggleInput
              type="checkbox"
              checked={settings.security.requireEmailVerification}
              onChange={(e) => handleInputChange('security', 'requireEmailVerification', e.target.checked)}
            />
            Require Email Verification
          </Toggle>
        </FormGroup>
        <FormGroup>
          <Toggle>
            <ToggleInput
              type="checkbox"
              checked={settings.security.allowRegistration}
              onChange={(e) => handleInputChange('security', 'allowRegistration', e.target.checked)}
            />
            Allow User Registration
          </Toggle>
        </FormGroup>
        <FormGroup>
          <Label>Max Login Attempts</Label>
          <Input
            type="number"
            value={settings.security.maxLoginAttempts}
            onChange={(e) => handleInputChange('security', 'maxLoginAttempts', e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Label>Session Timeout (hours)</Label>
          <Input
            type="number"
            value={settings.security.sessionTimeout}
            onChange={(e) => handleInputChange('security', 'sessionTimeout', e.target.value)}
          />
        </FormGroup>
      </Section>

      <Section>
        <SectionTitle>Content Settings</SectionTitle>
        <FormGroup>
          <Toggle>
            <ToggleInput
              type="checkbox"
              checked={settings.content.allowComments}
              onChange={(e) => handleInputChange('content', 'allowComments', e.target.checked)}
            />
            Allow Comments
          </Toggle>
        </FormGroup>
        <FormGroup>
          <Toggle>
            <ToggleInput
              type="checkbox"
              checked={settings.content.moderateComments}
              onChange={(e) => handleInputChange('content', 'moderateComments', e.target.checked)}
            />
            Moderate Comments
          </Toggle>
        </FormGroup>
        <FormGroup>
          <Label>Max File Size (MB)</Label>
          <Input
            type="number"
            value={settings.content.maxFileSize}
            onChange={(e) => handleInputChange('content', 'maxFileSize', e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Label>Allowed File Types</Label>
          <Input
            type="text"
            value={settings.content.allowedFileTypes}
            onChange={(e) => handleInputChange('content', 'allowedFileTypes', e.target.value)}
            placeholder="jpg,jpeg,png,pdf,doc,docx"
          />
        </FormGroup>
      </Section>

      <div>
        <Button onClick={handleSave}>Save Settings</Button>
        <Button onClick={handleReset}>Reset to Default</Button>
      </div>
    </Container>
  );
} 