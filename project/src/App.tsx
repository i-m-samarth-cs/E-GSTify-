import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { SellerDashboard } from './components/SellerDashboard';
import { Dashboard } from './components/Dashboard';
import { InvoiceVerification } from './components/InvoiceVerification';
import { Chatbot } from './components/Chatbot';
import { NewsPage } from './components/NewsPage';
import { SignIn } from './components/auth/SignIn';
import { SignUp } from './components/auth/SignUp';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/signin" replace />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['seller']}>
            <Layout>
              <SellerDashboard />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/invoices" element={
          <ProtectedRoute allowedRoles={['seller']}>
            <Layout>
              <Dashboard invoices={[]} />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/verification" element={
          <ProtectedRoute>
            <Layout>
              <InvoiceVerification />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/news" element={
          <ProtectedRoute>
            <Layout>
              <NewsPage />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/support" element={
          <ProtectedRoute>
            <Layout>
              <Chatbot />
            </Layout>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;