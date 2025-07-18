import React, { useState } from 'react';

const sections = [
  { id: 'blog', label: 'Blog Management' },
  { id: 'questions', label: 'Question Management' },
  { id: 'publish', label: 'Content Publishing' }
];

export default function AdminPortal() {
  const [active, setActive] = useState('blog');
  return (
    <div style={{ maxWidth: 900, margin: '3rem auto', background: 'rgba(30,41,59,0.97)', borderRadius: 18, boxShadow: '0 4px 32px rgba(99,102,241,0.13)', padding: '2.5rem 2rem', color: '#e2e8f0' }}>
      <h1 style={{ color: '#6366f1', fontWeight: 900, fontSize: '2rem', marginBottom: 32 }}>Admin Portal</h1>
      <div style={{ display: 'flex', gap: 24, marginBottom: 32 }}>
        {sections.map(s => (
          <button key={s.id} onClick={() => setActive(s.id)} style={{ background: active === s.id ? '#6366f1' : 'rgba(255,255,255,0.07)', color: active === s.id ? '#fff' : '#a5b4fc', border: 'none', borderRadius: 8, padding: '0.7rem 1.5rem', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', transition: 'all 0.2s' }}>{s.label}</button>
        ))}
      </div>
      <div>
        {active === 'blog' && <div>Blog Management Section (Add/Edit/Publish Blogs) - Coming Soon</div>}
        {active === 'questions' && <div>Question Management Section (Add/Edit Aptitude/DSA Questions) - Coming Soon</div>}
        {active === 'publish' && <div>Content Publishing Section (Push Content Live) - Coming Soon</div>}
      </div>
    </div>
  );
} 