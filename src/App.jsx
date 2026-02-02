import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Teams from './pages/Teams';
import Games from './pages/Games';
import DailyTask from './pages/DailyTask';
import Profile from './pages/Profile';
import MyTeam from './pages/MyTeam';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CompanyWorkforce from './pages/CompanyWorkforce';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Protected Routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/employees" element={
                <ProtectedRoute>
                  <Layout>
                    <Employees />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/teams" element={
                <ProtectedRoute adminOnly={true}>
                  <Layout>
                    <Teams />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/games" element={
                <ProtectedRoute>
                  <Layout>
                    <Games />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/daily-task" element={
                <ProtectedRoute>
                  <Layout>
                    <DailyTask />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/company-workforce" element={
                <ProtectedRoute>
                  <Layout>
                    <CompanyWorkforce />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Layout>
                    <Profile />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/my-team" element={
                <ProtectedRoute memberOnly={true}>
                  <Layout>
                    <MyTeam />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Layout>
                    <Settings />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute adminOnly={true}>
                  <Layout>
                    <AdminPanel />
                  </Layout>
                </ProtectedRoute>
              } />

              {/* Catch all - redirect to login */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </Router>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
