import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Dashboard from './pages/Dashboard';
import DiseaseDetection from './pages/DiseaseDetection';
import CropManagement from './pages/CropManagement';
import ExpertTips from './pages/ExpertTips';
import Weather from './pages/Weather';
import Community from './pages/Community';
import './styles/globals.css';
import './styles/components.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/disease-detection" element={<DiseaseDetection />} />
          <Route path="/crop-management" element={<CropManagement />} />
          <Route path="/expert-tips" element={<ExpertTips />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/community" element={<Community />} />
          <Route path="/chat" element={<div className="p-8 text-center"><h1 className="text-2xl font-bold text-emerald-600">Chat Assistant</h1><p className="mt-4 text-gray-600">Chat functionality coming soon!</p></div>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;


