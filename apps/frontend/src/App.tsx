import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { LoginPage } from './pages/auth/LoginPage';
import { DashboardLayout } from './layouts/DashboardLayout';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { StudentDashboard } from './pages/dashboards/StudentDashboard';
import { TeacherDashboard } from './pages/dashboards/TeacherDashboard';
import { AdminDashboard } from './pages/dashboards/AdminDashboard';
import { ProfilePage } from './pages/ProfilePage';
import { ModuleListPage } from './pages/modules/ModuleListPage';
import { ModuleDetailPage } from './pages/modules/ModuleDetailPage';
import { QuizListPage } from './pages/quizzes/QuizListPage';
import { QuizRunnerPage } from './pages/quizzes/QuizRunnerPage';
import { AiAssistantPage } from './pages/ai/AiAssistantPage';
import { CertificatePage } from './pages/certificates/CertificatePage';
import { ReportsPage } from './pages/reports/ReportsPage';
import './services/i18n';

const RoleBasedDashboard: React.FC = () => {
  const { user } = useAuthStore();
  switch (user?.role) {
    case 'ADMIN':
      return <AdminDashboard />;
    case 'TEACHER':
      return <TeacherDashboard />;
    case 'STUDENT':
    default:
      return <StudentDashboard />;
  }
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<RoleBasedDashboard />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="modules" element={<ModuleListPage />} />
            <Route path="modules/:id" element={<ModuleDetailPage />} />
            <Route path="quizzes" element={<QuizListPage />} />
            <Route path="quizzes/:id" element={<QuizRunnerPage />} />
            <Route path="ai-assistant" element={<AiAssistantPage />} />
            <Route path="certificates" element={<CertificatePage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="*" element={<RoleBasedDashboard />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
