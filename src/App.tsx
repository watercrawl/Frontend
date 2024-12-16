import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { TeamProvider } from './contexts/TeamContext';
import { AuthLayout } from './layouts/AuthLayout';
import { DashboardLayout } from './layouts/DashboardLayout';
import { TeamScopedComponent } from './components/shared/TeamScopedComponent';
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import ActivityLogsPage from './pages/dashboard/ActivityLogsPage';
import ApiKeysPage from './pages/dashboard/ApiKeysPage';
import SettingsPage from './pages/dashboard/SettingsPage';
import PlaygroundPage from './pages/dashboard/PlaygroundPage';
import UsagePage from './pages/dashboard/UsagePage';
import { Toaster } from 'react-hot-toast';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/" element={<LoginPage />} />
            <Route path="/register" element={<SignupPage />} />
          </Route>
          <Route element={
            <TeamProvider>
              <TeamScopedComponent>
                <DashboardLayout />
              </TeamScopedComponent>
            </TeamProvider>
          }>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/dashboard/playground" element={<PlaygroundPage />} />
            <Route path="/dashboard/logs" element={<ActivityLogsPage />} />
            <Route path="/dashboard/usage" element={<UsagePage />} />
            <Route path="/dashboard/api-keys" element={<ApiKeysPage />} />
            <Route path="/dashboard/settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
