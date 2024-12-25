import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { TeamProvider } from './contexts/TeamContext';
import { AuthLayout } from './layouts/AuthLayout';
import { DashboardLayout } from './layouts/DashboardLayout';
import { TeamScopedComponent } from './components/shared/TeamScopedComponent';
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';
import { VerifyEmailPage } from './pages/auth/VerifyEmailPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import ActivityLogsPage from './pages/dashboard/ActivityLogsPage';
import ApiKeysPage from './pages/dashboard/ApiKeysPage';
import SettingsPage from './pages/dashboard/SettingsPage';
import PlaygroundPage from './pages/dashboard/PlaygroundPage';
import UsagePage from './pages/dashboard/UsagePage';
import ProfilePage from './pages/dashboard/ProfilePage';
import { Toaster } from 'react-hot-toast';
import { SettingsProvider } from './contexts/SettingsProvider';
import { NotFoundPage } from './pages/NotFoundPage';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Router>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'rgb(51, 65, 85)',
              color: '#fff',
              borderRadius: '8px',
              padding: '12px 16px',
            },
            success: {
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <SettingsProvider>
          <Routes>
            <Route element={<AuthLayout />}>
              <Route path="/" element={<LoginPage />} />
              <Route path="/register" element={<SignupPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
              <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
            </Route>
            <Route element={
              <TeamProvider>
                <TeamScopedComponent>
                  <DashboardLayout />
                </TeamScopedComponent>
              </TeamProvider>
            }>
              <Route path="/dashboard">
                <Route index element={<DashboardPage />} />
                <Route path="playground" element={<PlaygroundPage />} />
                <Route path="logs" element={<ActivityLogsPage />} />
                <Route path="usage" element={<UsagePage />} />
                <Route path="api-keys" element={<ApiKeysPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="profile" element={<ProfilePage />} />
              </Route>
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </SettingsProvider>
      </Router>
    </ThemeProvider>
  );
};

export default App;
