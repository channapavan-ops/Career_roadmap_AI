import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { DashboardLayout } from './layouts/DashboardLayout';
import { UserRole } from './types';

import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Onboarding } from './pages/Onboarding';
import { Dashboard } from './pages/Dashboard';
import { Roadmap } from './pages/Roadmap';
import { Projects } from './pages/Projects';
import { ProjectDetails } from './pages/ProjectDetails';
import { Internships } from './pages/Internships';
import { Mentors } from './pages/Mentors';
import { MentorDashboard } from './pages/MentorDashboard';
import { AIAssistant } from './pages/AIAssistant';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { NotFound } from './pages/NotFound';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  allowedRoles?: UserRole[];
  requiredRole?: UserRole;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  requiredRole,
}) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // 1. Show loading state while session authentication is resolving
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFF1F2] dark:bg-[#18181B] flex items-center justify-center p-4 transition-colors">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-rose-200 dark:border-zinc-700 border-t-[#9F1239] dark:border-t-rose-400 rounded-full animate-spin" />
          <p className="text-xs font-semibold text-[#9F1239] dark:text-rose-300">
            Resolving role-based access...
          </p>
        </div>
      </div>
    );
  }

  // 2. Redirect unauthenticated users to login, preserving intended location
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Unknown or missing roles: Do not automatically treat as student or mentor
  // Route to onboarding / account resolution flow
  if (!user.role || (user.role !== 'student' && user.role !== 'mentor')) {
    return <Navigate to="/onboarding" replace />;
  }

  // 4. Incomplete onboarding: Prevent students from accessing dashboard or roadmap without completing onboarding
  const { studentPrefs } = useAuth();
  if (user.role === 'student' && (!studentPrefs || !studentPrefs.onboardingCompleted)) {
    if (location.pathname !== '/onboarding') {
      return <Navigate to="/onboarding" replace />;
    }
  }

  // 4. Role-based access control check
  const effectiveAllowedRoles = allowedRoles || (requiredRole ? [requiredRole] : undefined);
  if (effectiveAllowedRoles && !effectiveAllowedRoles.includes(user.role)) {
    // If student attempts to access a mentor-only route, redirect to student dashboard
    // If mentor attempts to access a student-only route, redirect to mentor dashboard
    const targetRedirect = user.role === 'mentor' ? '/mentor-dashboard' : '/dashboard';
    return <Navigate to={targetRedirect} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Authenticated Onboarding Route */}
            <Route
              path="/onboarding"
              element={
                <ProtectedRoute>
                  <Onboarding />
                </ProtectedRoute>
              }
            />

            {/* Protected Dashboard Routes (Wrapped in DashboardLayout) */}
            <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              {/* Student-only routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/roadmap"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <Roadmap />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/roadmap/:id"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <Roadmap />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/projects"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <Projects />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/projects/:id"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <ProjectDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/internships"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <Internships />
                  </ProtectedRoute>
                }
              />

              {/* Mentor-only routes */}
              <Route
                path="/mentor-dashboard"
                element={
                  <ProtectedRoute allowedRoles={['mentor']}>
                    <MentorDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Shared protected routes (Student & Mentor) */}
              <Route
                path="/mentors"
                element={
                  <ProtectedRoute allowedRoles={['student', 'mentor']}>
                    <Mentors />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/mentors/:id"
                element={
                  <ProtectedRoute allowedRoles={['student', 'mentor']}>
                    <Mentors />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ai-assistant"
                element={
                  <ProtectedRoute allowedRoles={['student', 'mentor']}>
                    <AIAssistant />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute allowedRoles={['student', 'mentor']}>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute allowedRoles={['student', 'mentor']}>
                    <Settings />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
