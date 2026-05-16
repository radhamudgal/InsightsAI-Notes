import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Layout        from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage     from './pages/LoginPage';
import SignupPage    from './pages/SignupPage';
import NotesPage     from './pages/NotesPage';
import NoteEditorPage from './pages/NoteEditorPage';
import DashboardPage from './pages/DashboardPage';
import SharedNotePage from './pages/SharedNotePage';

export default function App() {
  const { loadUser, isLoading } = useAuthStore();

  // restore session from localStorage on first load
  useEffect(() => { loadUser(); }, []);

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center dark:bg-gray-950">
      <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <Routes>
      {/* public routes */}
      <Route path="/login"           element={<LoginPage />} />
      <Route path="/signup"          element={<SignupPage />} />
      <Route path="/share/:shareId"  element={<SharedNotePage />} />

      {/* protected routes — wrapped in Layout (sidebar + main area) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/"            element={<Navigate to="/notes" replace />} />
          <Route path="/notes"       element={<NotesPage />} />
          <Route path="/notes/:id"   element={<NoteEditorPage />} />
          <Route path="/dashboard"   element={<DashboardPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
