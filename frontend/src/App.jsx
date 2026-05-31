import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import MainLayout from './components/layout/MainLayout';
import ErrorBoundary from './components/error/ErrorBoundary';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MySchedules from './pages/MySchedules';
import Restrictions from './pages/Restrictions';
import Reports from './pages/Reports';
import Notifications from './pages/Notifications';
import Help from './pages/Help';
import Profile from './pages/Profile';
import Courses from './pages/Courses';
import Teachers from './pages/Teachers';
import Students from './pages/Students';
import Classrooms from './pages/Classrooms';
import Schedules from './pages/Schedules';
import Planning from './pages/Planning';
import Careers from './pages/Careers';
import InstitutionalPolicies from './pages/InstitutionalPolicies';
import Enrollment from './pages/Enrollment';
import TeacherProfile from './pages/TeacherProfile';
import StudentPreferences from './pages/StudentPreferences';
import CareerGeneration from './pages/CareerGeneration';
import Simulations from './pages/Simulations';
import CampusPage from './pages/Campus';
import TeacherPreferences from './pages/TeacherPreferences';
import MyPreferences from './pages/MyPreferences';

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
        {/* Common routes for all roles */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/planning" element={<Planning />} />
        <Route path="/generate" element={<Navigate to="/career-generation" />} />
        <Route path="/my-schedules" element={<MySchedules />} />
        <Route path="/restrictions" element={<Restrictions />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/help" element={<Help />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/enrollment" element={<Enrollment />} />
        <Route path="/teacher-profile" element={<TeacherProfile />} />
        
        {/* Coordinator admin routes */}
        <Route path="/careers" element={<Careers />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/teachers" element={<Teachers />} />
        <Route path="/students" element={<Students />} />
        <Route path="/classrooms" element={<Classrooms />} />
        <Route path="/generation" element={<Navigate to="/career-generation" />} />
        <Route path="/schedules" element={<Schedules />} />
        <Route path="/policies" element={<InstitutionalPolicies />} />
        <Route path="/student-preferences" element={<StudentPreferences />} />
        <Route path="/teacher-preferences" element={<TeacherPreferences />} />
        <Route path="/career-generation" element={<CareerGeneration />} />
        <Route path="/simulations" element={<Simulations />} />
        <Route path="/mis-preferencias" element={<MyPreferences />} />
        <Route path="/campus" element={<CampusPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ErrorBoundary>
          <AppRoutes />
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  );
}
