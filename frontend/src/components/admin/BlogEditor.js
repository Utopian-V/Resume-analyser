import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { 
  FiSave, 
  FiEye, 
  FiUpload, 
  FiImage, 
  FiTag, 
  FiCalendar,
  FiUser,
  FiGlobe,
  FiSettings,
  FiX,
  FiPlus,
  FiTrash2,
  FiBold,
  FiItalic,
  FiList,
  FiLink,
  FiCode,
  FiMessageSquare,
  FiType
} from 'react-icons/fi';

const EditorContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const MainEditor = styled.div`
  background: rgba(30, 41, 59, 0.95);
  border-radius: 20px;
  padding: 2rem;
`;

const Sidebar = styled.div`
  background: rgba(30, 41, 59, 0.95);
  border-radius: 20px;
  padding: 2rem;
  height: fit-content;
  position: sticky;
  top: 2rem;
`;

const EditorHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(99, 102, 241, 0.2);
`;

const Title = styled.h1`
  color: #6366f1;
  font-size: 1.8rem;
  font-weight: 900;
  margin: 0;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
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
    }
  }
`;

const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  margin-bottom: 2rem;
  border: 1px solid rgba(99, 102, 241, 0.2);
`;

const ToolbarButton = styled.button`
  background: ${props => props.active ? 'rgba(99, 102, 241, 0.3)' : 'rgba(255, 255, 255, 0.1)'};
  border: 1px solid ${props => props.active ? '#6366f1' : 'rgba(99, 102, 241, 0.2)'};
  border-radius: 6px;
  padding: 0.5rem;
  color: ${props => props.active ? '#fff' : '#a5b4fc'};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: rgba(99, 102, 241, 0.2);
    color: white;
  }
`;

const TitleInput = styled.input`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: 10px;
  padding: 1rem;
  color: #e2e8f0;
  font-size: 1.5rem;
  font-weight: 700;
  width: 100%;
  margin-bottom: 1rem;
  
  &:focus {
    outline: none;
    border-color: #6366f1;
    background: rgba(255, 255, 255, 0.1);
  }
  
  &::placeholder {
    color: #64748b;
  }
`;

const ContentEditor = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 10px;
  min-height: 500px;
  padding: 1.5rem;
  color: #e2e8f0;
  font-size: 1rem;
  line-height: 1.6;
  
  &:focus {
    outline: none;
    border-color: #6366f1;
  }
  
  h1, h2, h3, h4, h5, h6 {
    color: #6366f1;
    margin: 1.5rem 0 1rem 0;
  }
  
  p {
    margin: 1rem 0;
  }
  
  ul, ol {
    margin: 1rem 0;
    padding-left: 2rem;
  }
  
  blockquote {
    border-left: 4px solid #6366f1;
    padding-left: 1rem;
    margin: 1rem 0;
    font-style: italic;
    color: #a5b4fc;
  }
  
  code {
    background: rgba(99, 102, 241, 0.2);
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
    font-family: 'Monaco', 'Menlo', monospace;
  }
  
  pre {
    background: rgba(0, 0, 0, 0.3);
    padding: 1rem;
    border-radius: 8px;
    overflow-x: auto;
    margin: 1rem 0;
  }
`;

const SidebarSection = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  color: #6366f1;
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
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

const ImageUpload = styled.div`
  border: 2px dashed rgba(99, 102, 241, 0.3);
  border-radius: 10px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: #6366f1;
    background: rgba(99, 102, 241, 0.05);
  }
  
  input {
    display: none;
  }
`;

const TagInput = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: 8px;
  min-height: 50px;
`;

const Tag = styled.span`
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  button {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    padding: 0;
    font-size: 0.8rem;
    
    &:hover {
      opacity: 0.8;
    }
  }
`;

const TagInputField = styled.input`
  background: none;
  border: none;
  color: #e2e8f0;
  font-size: 0.8rem;
  flex: 1;
  min-width: 80px;
  
  &:focus {
    outline: none;
  }
  
  &::placeholder {
    color: #64748b;
  }
`;

const StatusBadge = styled.span`
  background: ${props => {
    switch (props.status) {
      case 'draft': return 'rgba(156, 163, 175, 0.2)';
      case 'published': return 'rgba(34, 197, 94, 0.2)';
      case 'scheduled': return 'rgba(59, 130, 246, 0.2)';
      default: return 'rgba(156, 163, 175, 0.2)';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'draft': return '#9ca3af';
      case 'published': return '#22c55e';
      case 'scheduled': return '#3b82f6';
      default: return '#9ca3af';
    }
  }};
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
`;

const PreviewImage = styled.div`
  width: 100%;
  height: 200px;
  background: ${props => props.image ? `url(${props.image}) center/cover` : 'rgba(255, 255, 255, 0.05)'};
  border-radius: 10px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  border: 1px solid rgba(99, 102, 241, 0.2);
`;

export default function BlogEditor() {
  const [blog, setBlog] = useState({
    title: '',
    content: '',
    summary: '',
    tags: [],
    featuredImage: null,
    status: 'draft',
    author: 'John Doe',
    publishDate: new Date().toISOString().split('T')[0],
    slug: ''
  });

  const [newTag, setNewTag] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const contentRef = useRef();

  const handleSave = () => {
    console.log('Saving blog:', blog);
    // Save logic here
  };

  const handlePublish = () => {
    setBlog(prev => ({ ...prev, status: 'published' }));
    console.log('Publishing blog:', blog);
    // Publish logic here
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBlog(prev => ({ ...prev, featuredImage: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addTag = (e) => {
    if (e.key === 'Enter' && newTag.trim()) {
      setBlog(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setBlog(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const insertText = (text) => {
    const textarea = contentRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newContent = blog.content.substring(0, start) + text + blog.content.substring(end);
    setBlog(prev => ({ ...prev, content: newContent }));
    
    // Set cursor position after inserted text
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + text.length, start + text.length);
    }, 0);
  };

  const formatText = (format) => {
    const textarea = contentRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = blog.content.substring(start, end);
    
    let formattedText = '';
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'code':
        formattedText = `\`${selectedText}\``;
        break;
      case 'link':
        formattedText = `[${selectedText}](url)`;
        break;
      case 'quote':
        formattedText = `> ${selectedText}`;
        break;
      case 'h1':
        formattedText = `# ${selectedText}`;
        break;
      case 'h2':
        formattedText = `## ${selectedText}`;
        break;
      case 'h3':
        formattedText = `### ${selectedText}`;
        break;
      case 'ul':
        formattedText = `- ${selectedText}`;
        break;
      case 'ol':
        formattedText = `1. ${selectedText}`;
        break;
      default:
        formattedText = selectedText;
    }
    
    const newContent = blog.content.substring(0, start) + formattedText + blog.content.substring(end);
    setBlog(prev => ({ ...prev, content: newContent }));
  };

  return (
    <EditorContainer>
      <MainEditor>
        <EditorHeader>
          <Title>Blog Editor</Title>
          <ActionButtons>
            <Button className="secondary" onClick={() => setIsPreview(!isPreview)}>
              <FiEye />
              {isPreview ? 'Edit' : 'Preview'}
            </Button>
            <Button className="secondary" onClick={handleSave}>
              <FiSave />
              Save Draft
            </Button>
            <Button className="primary" onClick={handlePublish}>
              <FiGlobe />
              Publish
            </Button>
          </ActionButtons>
        </EditorHeader>

        <TitleInput
          type="text"
          placeholder="Enter blog title..."
          value={blog.title}
          onChange={(e) => setBlog(prev => ({ ...prev, title: e.target.value }))}
        />

        <Toolbar>
          <ToolbarButton onClick={() => formatText('h1')}>
            <FiType />
          </ToolbarButton>
          <ToolbarButton onClick={() => formatText('h2')}>
            <FiType />
          </ToolbarButton>
          <ToolbarButton onClick={() => formatText('bold')}>
            <FiBold />
          </ToolbarButton>
          <ToolbarButton onClick={() => formatText('italic')}>
            <FiItalic />
          </ToolbarButton>
          <ToolbarButton onClick={() => formatText('code')}>
            <FiCode />
          </ToolbarButton>
          <ToolbarButton onClick={() => formatText('link')}>
            <FiLink />
          </ToolbarButton>
          <ToolbarButton onClick={() => formatText('quote')}>
            <FiMessageSquare />
          </ToolbarButton>
          <ToolbarButton onClick={() => formatText('ul')}>
            <FiList />
          </ToolbarButton>
          <ToolbarButton onClick={() => formatText('ol')}>
            <FiList />
          </ToolbarButton>
        </Toolbar>

        <ContentEditor
          ref={contentRef}
          contentEditable={!isPreview}
          suppressContentEditableWarning={true}
          onInput={(e) => setBlog(prev => ({ ...prev, content: e.target.textContent }))}
          dangerouslySetInnerHTML={isPreview ? { __html: blog.content } : undefined}
          style={{ pointerEvents: isPreview ? 'none' : 'auto' }}
        >
          {!isPreview && blog.content}
        </ContentEditor>
      </MainEditor>

      <Sidebar>
        <SidebarSection>
          <SectionTitle>
            <FiSettings />
            Blog Settings
          </SectionTitle>
          
          <FormGroup>
            <Label>Status</Label>
            <StatusBadge status={blog.status}>
              {blog.status}
            </StatusBadge>
          </FormGroup>

          <FormGroup>
            <Label>Author</Label>
            <Input
              type="text"
              value={blog.author}
              onChange={(e) => setBlog(prev => ({ ...prev, author: e.target.value }))}
              placeholder="Author name"
            />
          </FormGroup>

          <FormGroup>
            <Label>Publish Date</Label>
            <Input
              type="date"
              value={blog.publishDate}
              onChange={(e) => setBlog(prev => ({ ...prev, publishDate: e.target.value }))}
            />
          </FormGroup>

          <FormGroup>
            <Label>URL Slug</Label>
            <Input
              type="text"
              value={blog.slug}
              onChange={(e) => setBlog(prev => ({ ...prev, slug: e.target.value }))}
              placeholder="blog-url-slug"
            />
          </FormGroup>
        </SidebarSection>

        <SidebarSection>
          <SectionTitle>
            <FiImage />
            Featured Image
          </SectionTitle>
          
          <ImageUpload onClick={() => document.getElementById('image-upload').click()}>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />
            <FiUpload size={24} style={{ color: '#6366f1', marginBottom: '0.5rem' }} />
            <div>Click to upload image</div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
              PNG, JPG up to 5MB
            </div>
          </ImageUpload>
          
          {blog.featuredImage && (
            <PreviewImage image={blog.featuredImage} />
          )}
        </SidebarSection>

        <SidebarSection>
          <SectionTitle>
            <FiTag />
            Tags
          </SectionTitle>
          
          <TagInput>
            {blog.tags.map(tag => (
              <Tag key={tag}>
                {tag}
                <button onClick={() => removeTag(tag)}>
                  <FiX />
                </button>
              </Tag>
            ))}
            <TagInputField
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={addTag}
              placeholder="Add tag..."
            />
          </TagInput>
        </SidebarSection>

        <SidebarSection>
          <SectionTitle>
            <FiUser />
            Summary
          </SectionTitle>
          
          <TextArea
            value={blog.summary}
            onChange={(e) => setBlog(prev => ({ ...prev, summary: e.target.value }))}
            placeholder="Brief description of the blog post..."
          />
        </SidebarSection>
      </Sidebar>
    </EditorContainer>
  );
} 