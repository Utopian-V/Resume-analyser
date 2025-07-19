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

const EditorContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const MainEditor = styled.div`
  background: #1e293b;
  border-radius: 8px;
  padding: 2rem;
  border: 1px solid #334155;
`;

const Sidebar = styled.div`
  background: #1e293b;
  border-radius: 8px;
  padding: 2rem;
  border: 1px solid #334155;
  height: fit-content;
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
  min-height: 400px;
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
  
  &.secondary {
    background: #475569;
    
    &:hover {
      background: #334155;
    }
  }
`;

const Toolbar = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

const ToolbarButton = styled.button`
  background: #475569;
  border: 1px solid #64748b;
  border-radius: 4px;
  padding: 0.5rem;
  color: #fff;
  cursor: pointer;
  
  &:hover {
    background: #6366f1;
  }
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

export default function BlogEditor() {
  const [blog, setBlog] = useState({
    title: '',
    content: '',
    summary: '',
    author: '',
    status: 'draft',
    tags: [],
    featuredImage: null,
    publishDate: '',
    slug: ''
  });

  const [newTag, setNewTag] = useState('');

  const handleInputChange = (field, value) => {
    setBlog(prev => ({ ...prev, [field]: value }));
  };

  const addTag = (e) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      if (!blog.tags.includes(newTag.trim())) {
        setBlog(prev => ({
          ...prev,
          tags: [...prev.tags, newTag.trim()]
        }));
      }
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setBlog(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setBlog(prev => ({ ...prev, featuredImage: file }));
    }
  };

  const formatText = (format) => {
    const textarea = document.getElementById('content-editor');
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
      case 'h1':
        formattedText = `# ${selectedText}`;
        break;
      case 'h2':
        formattedText = `## ${selectedText}`;
        break;
      case 'quote':
        formattedText = `> ${selectedText}`;
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

  const handleSave = () => {
    console.log('Blog saved:', blog);
    alert('Blog saved successfully!');
  };

  const handlePublish = () => {
    console.log('Blog published:', blog);
    alert('Blog published successfully!');
  };

  return (
    <Container>
      <Title>Blog Editor</Title>
      
      <EditorContainer>
        <MainEditor>
          <FormGroup>
            <Label>Blog Title</Label>
            <Input
              type="text"
              value={blog.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter blog title..."
            />
          </FormGroup>

          <Toolbar>
            <ToolbarButton onClick={() => formatText('h1')}>H1</ToolbarButton>
            <ToolbarButton onClick={() => formatText('h2')}>H2</ToolbarButton>
            <ToolbarButton onClick={() => formatText('bold')}>Bold</ToolbarButton>
            <ToolbarButton onClick={() => formatText('italic')}>Italic</ToolbarButton>
            <ToolbarButton onClick={() => formatText('code')}>Code</ToolbarButton>
            <ToolbarButton onClick={() => formatText('quote')}>Quote</ToolbarButton>
            <ToolbarButton onClick={() => formatText('ul')}>List</ToolbarButton>
          </Toolbar>

          <FormGroup>
            <Label>Content</Label>
            <TextArea
              id="content-editor"
              value={blog.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              placeholder="Write your blog content here..."
            />
          </FormGroup>

          <div>
            <Button onClick={handleSave}>Save Draft</Button>
            <Button onClick={handlePublish}>Publish</Button>
            <Button className="secondary" onClick={() => window.location.href = '/admin/blogs'}>
              Cancel
            </Button>
          </div>
        </MainEditor>

        <Sidebar>
          <FormGroup>
            <Label>Status</Label>
            <Select
              value={blog.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Author</Label>
            <Input
              type="text"
              value={blog.author}
              onChange={(e) => handleInputChange('author', e.target.value)}
              placeholder="Author name"
            />
          </FormGroup>

          <FormGroup>
            <Label>Publish Date</Label>
            <Input
              type="date"
              value={blog.publishDate}
              onChange={(e) => handleInputChange('publishDate', e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <Label>URL Slug</Label>
            <Input
              type="text"
              value={blog.slug}
              onChange={(e) => handleInputChange('slug', e.target.value)}
              placeholder="blog-url-slug"
            />
          </FormGroup>

          <FormGroup>
            <Label>Featured Image</Label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />
            {blog.featuredImage && (
              <div style={{ marginTop: '0.5rem', color: '#94a3b8' }}>
                Selected: {blog.featuredImage.name}
              </div>
            )}
          </FormGroup>

          <FormGroup>
            <Label>Tags</Label>
            <TagInput>
              {blog.tags.map(tag => (
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
                placeholder="Add tag..."
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
            <Label>Summary</Label>
            <TextArea
              value={blog.summary}
              onChange={(e) => handleInputChange('summary', e.target.value)}
              placeholder="Brief description of the blog post..."
              style={{ minHeight: '100px' }}
            />
          </FormGroup>
        </Sidebar>
      </EditorContainer>
    </Container>
  );
} 