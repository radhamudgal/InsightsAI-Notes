import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Pin, Archive, ArchiveRestore, Trash2, Share2 } from 'lucide-react';
import { useNoteStore } from '../store/noteStore';
import toast from 'react-hot-toast';

export default function NoteCard({ note }) {
  const navigate = useNavigate();
  const { togglePin, toggleArchive, deleteNote, toggleShare } = useNoteStore();

  // stops card click from firing when action buttons are clicked
  const wrap = (fn) => (e) => { e.stopPropagation(); fn(); };

  const onPin = wrap(() => togglePin(note._id));

  const onArchive = wrap(async () => {
    await toggleArchive(note._id);
    toast.success(note.isArchived ? 'Note restored' : 'Note archived');
  });

  const onDelete = wrap(async () => {
    if (!confirm('Delete this note?')) return;
    await deleteNote(note._id);
    toast.success('Note deleted');
  });

  const onShare = wrap(async () => {
    const updated = await toggleShare(note._id);
    if (updated.isPublic) {
      navigator.clipboard.writeText(`${window.location.origin}/share/${updated.shareId}`);
      toast.success('Share link copied!');
    } else {
      toast.success('Note made private');
    }
  });

  return (
    <div
      onClick={() => navigate(`/notes/${note._id}`)}
      className="card p-4 cursor-pointer hover:shadow-md transition-shadow group relative"
      style={{ borderLeft: `4px solid ${note.color || '#e5e7eb'}` }}
    >
      {/* pin indicator */}
      {note.isPinned && <Pin className="absolute top-3 right-3 w-3.5 h-3.5 text-primary-500 fill-primary-500" />}

      <h3 className="font-semibold text-sm mb-1 truncate pr-6 dark:text-white">{note.title}</h3>
      <p className="text-gray-500 dark:text-gray-400 text-xs mb-3 line-clamp-2">
        {note.content?.slice(0, 120) || 'No content yet'}
      </p>

      {/* tags */}
      {note.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {note.tags.slice(0, 3).map(tag => (
            <span key={tag} className="bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-xs px-2 py-0.5 rounded-full">
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">
          {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
        </span>

        {/* action buttons — visible on hover */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={onPin}     title="Pin"     className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
            <Pin     className={`w-3.5 h-3.5 ${note.isPinned ? 'text-primary-500 fill-primary-500' : 'text-gray-400'}`} />
          </button>
          <button onClick={onShare}   title="Share"   className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
            <Share2  className={`w-3.5 h-3.5 ${note.isPublic ? 'text-green-500' : 'text-gray-400'}`} />
          </button>
          <button onClick={onArchive} title="Archive" className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
            {note.isArchived
              ? <ArchiveRestore className="w-3.5 h-3.5 text-gray-400" />
              : <Archive        className="w-3.5 h-3.5 text-gray-400" />}
          </button>
          <button onClick={onDelete}  title="Delete"  className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded">
            <Trash2  className="w-3.5 h-3.5 text-red-400" />
          </button>
        </div>
      </div>
    </div>
  );
}
