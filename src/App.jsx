import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import TestPage from './pages/TestPage';
import Leaderboard from './pages/Leaderboard';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminLayout from './components/AdminLayout';
import AdminUsers from './pages/AdminUsers';
import AdminQuestions from './pages/AdminQuestions';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b1120] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090514] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/test" replace />;
  }

  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Student Protected Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/test" replace />} />
            <Route path="test" element={<TestPage />} />
            <Route path="leaderboard" element={<Leaderboard />} />
          </Route>

          {/* Admin Protected Routes */}
          <Route path="/admin" element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }>
            <Route index element={<Navigate to="users" replace />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="questions" element={<AdminQuestions />} />
          </Route>

          <Route path="*" element={<Navigate to="/test" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;