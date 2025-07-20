import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminDashboard from './AdminDashboard.js';

export default function AdminPortal() {
  return (
    <Routes>
      <Route path="/*" element={<AdminDashboard />} />
    </Routes>
  );
} 