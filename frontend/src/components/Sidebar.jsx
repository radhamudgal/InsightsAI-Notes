import { NavLink, useNavigate } from 'react-router-dom';
import { FileText, LayoutDashboard, Archive, LogOut, Plus, BookOpen, Sun, Moon } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useNoteStore } from '../store/noteStore';
import { useThemeStore } from '../store/themeStore';

export default function Sidebar() {
  const { user, logout }                              = useAuthStore();
  const { showArchived, setShowArchived, createNote } = useNoteStore();
  const { theme, toggleTheme }                        = useThemeStore();
  const navigate = useNavigate();

  const handleNew = async () => {
    const note = await createNote({ title: 'Untitled Note', content: '' });
    navigate(`/notes/${note._id}`);
  };

  // active link gets a highlighted style, inactive gets a hover style
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
     ${isActive
       ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
       : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'}`;

  return (
    <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full">

      {/* logo + theme toggle */}
      <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-primary-600" />
          <span className="text-lg font-bold dark:text-white">InsightsAI Notes</span>
        </div>
        <button onClick={toggleTheme} title="Toggle theme"
          className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          {theme === 'dark'
            ? <Sun  className="w-4 h-4 text-yellow-400" />
            : <Moon className="w-4 h-4 text-gray-500" />}
        </button>
      </div>

      {/* new note button */}
      <div className="p-4">
        <button onClick={handleNew} className="btn-primary w-full flex items-center justify-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> New Note
        </button>
      </div>

      {/* navigation */}
      <nav className="flex-1 px-3 space-y-1">
        <NavLink to="/notes"     className={linkClass}><FileText        className="w-4 h-4" /> Notes</NavLink>
        <NavLink to="/dashboard" className={linkClass}><LayoutDashboard className="w-4 h-4" /> Dashboard</NavLink>
        <button
          onClick={() => { setShowArchived(!showArchived); navigate('/notes'); }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
        >
          <Archive className="w-4 h-4" />
          {showArchived ? 'Active Notes' : 'Archived'}
        </button>
      </nav>

      {/* user info + logout */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-3">
          {/* avatar — first letter of name */}
          <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-700 dark:text-primary-300 font-semibold text-sm">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate dark:text-white">{user?.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </aside>
  );
}
