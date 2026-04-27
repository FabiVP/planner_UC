import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import MainLayout from './components/layout/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import Teachers from './pages/Teachers';
import Students from './pages/Students';
import Classrooms from './pages/Classrooms';
import Generation from './pages/Generation';
import Schedules from './pages/Schedules';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/teachers" element={<Teachers />} />
        <Route path="/students" element={<Students />} />
        <Route path="/classrooms" element={<Classrooms />} />
        <Route path="/generation" element={<Generation />} />
        <Route path="/schedules" element={<Schedules />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
