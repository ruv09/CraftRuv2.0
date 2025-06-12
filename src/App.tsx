import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ProjectProvider } from './contexts/ProjectContext';
import { Header } from './components/layout/Header';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';

// Public pages
import { HomePage } from './pages/HomePage';
import { AuthPage } from './pages/AuthPage';
import PricingPage from './pages/PricingPage';

// Protected user pages
import { DashboardPage } from './pages/DashboardPage';
import { EditorPage } from './pages/EditorPage';
import { MaterialsPage } from './pages/MaterialsPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import BillingPage from './pages/BillingPage';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import MaterialsManagement from './pages/admin/MaterialsManagement';
import FurnitureManagement from './pages/admin/FurnitureManagement';
import UsersManagement from './pages/admin/UsersManagement';

import DesignStudio from './pages/DesignStudio';

import './index.css';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <ProjectProvider>
            <Router>
              <div className="min-h-screen bg-background text-foreground transition-colors">
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={
                    <>
                      <Header />
                      <main>
                        <HomePage />
                      </main>
                    </>
                  } />
                  <Route path="/auth" element={
                    <>
                      <Header />
                      <main>
                        <AuthPage />
                      </main>
                    </>
                  } />
                  <Route path="/pricing" element={
                    <>
                      <Header />
                      <main>
                        <PricingPage />
                      </main>
                    </>
                  } />

                  {/* Protected user routes */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Header />
                      <main>
                        <DashboardPage />
                      </main>
                    </ProtectedRoute>
                  } />
                  <Route path="/editor" element={
                    <ProtectedRoute>
                      <Header />
                      <main>
                        <EditorPage />
                      </main>
                    </ProtectedRoute>
                  } />
                  <Route path="/editor/:projectId" element={
                    <ProtectedRoute>
                      <Header />
                      <main>
                        <EditorPage />
                      </main>
                    </ProtectedRoute>
                  } />
                  <Route path="/materials" element={
                    <ProtectedRoute>
                      <Header />
                      <main>
                        <MaterialsPage />
                      </main>
                    </ProtectedRoute>
                  } />
                  <Route path="/ai-assistant" element={
                    <ProtectedRoute>
                      <Header />
                      <main>
                        <AIAssistantPage />
                      </main>
                    </ProtectedRoute>
                  } />
                  <Route path="/billing" element={
                    <ProtectedRoute>
                      <Header />
                      <main>
                        <BillingPage />
                      </main>
                    </ProtectedRoute>
                  } />

                  {/* Admin routes */}
                  <Route path="/admin/*" element={
                    <ProtectedRoute adminOnly>
                      <AdminLayout />
                    </ProtectedRoute>
                  }>
                    <Route index element={<AdminDashboard />} />
                    <Route path="materials" element={<MaterialsManagement />} />
                    <Route path="furniture" element={<FurnitureManagement />} />
                    <Route path="users" element={<UsersManagement />} />
                    <Route path="subscriptions" element={<UsersManagement />} />
                    <Route path="settings" element={<div className="p-8">Настройки (в разработке)</div>} />
                  </Route>

                  <Route path="/design-studio" element={<DesignStudio />} />
                </Routes>
              </div>
            </Router>
          </ProjectProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
