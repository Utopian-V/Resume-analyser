import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminDashboard from './admin/AdminDashboard';

export default function AdminPortal() {
  return (
    <Routes>
      <Route path="/*" element={<AdminDashboard />} />
    </Routes>
  );
} 