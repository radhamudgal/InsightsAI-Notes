import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { BookOpen, Loader2, AlertCircle, CheckSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function SharedNotePage() {
  const { shareId }           = useParams();
  const [note, setNote]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    api.get(`/share/${shareId}`)
      .then(r => setNote(r.data.note))
      .catch(() => setError('Note not found or no longer public'))
      .finally(() => setLoading(false));
  }, [shareId]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center dark:bg-gray-950">
      <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-gray-500 dark:bg-gray-950">
      <AlertCircle className="w-12 h-12 text-red-400" />
      <p className="text-lg font-medium dark:text-gray-300">{error}</p>
      <Link to="/" className="text-primary-600 hover:underline text-sm">Go to InsightsAI Notes</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* public header — no login required to view this page */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary-600" />
          <span className="font-bold dark:text-white">InsightsAI Notes</span>
        </div>
        <Link to="/signup" className="btn-primary text-sm">Get Started Free</Link>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="card p-8" style={{ backgroundColor: note.color || '#ffffff' }}>
          <h1 className="text-3xl font-bold mb-2 dark:text-white">{note.title}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            By {note.user?.name} · {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
          </p>

          {note.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {note.tags.map(tag => (
                <span key={tag} className="bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-xs px-2.5 py-1 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap mb-6">{note.content}</p>

          {/* AI results are shown here if the owner generated them */}
          {note.aiSummary && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-4">
              <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-1">AI Summary</p>
              <p className="text-sm text-blue-800 dark:text-blue-300">{note.aiSummary}</p>
            </div>
          )}

          {note.aiActionItems?.length > 0 && (
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
              <p className="text-xs font-semibold text-green-700 dark:text-green-400 mb-2">Action Items</p>
              {note.aiActionItems.map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-green-800 dark:text-green-300 mb-1">
                  <CheckSquare className="w-4 h-4 mt-0.5 flex-shrink-0" /> {item}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
