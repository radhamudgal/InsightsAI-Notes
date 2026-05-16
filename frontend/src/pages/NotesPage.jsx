import { useEffect } from 'react';
import { useNoteStore } from '../store/noteStore';
import NoteCard  from '../components/NoteCard';
import SearchBar from '../components/SearchBar';
import TagFilter from '../components/TagFilter';
import { FileText, Loader2 } from 'lucide-react';

// small grid wrapper to avoid repeating the grid classNames
const NoteGrid = ({ notes }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
    {notes.map(note => <NoteCard key={note._id} note={note} />)}
  </div>
);

export default function NotesPage() {
  const { notes, fetchNotes, isLoading, showArchived } = useNoteStore();

  // re-fetch whenever the archived toggle changes
  useEffect(() => { fetchNotes(); }, [showArchived]);

  const pinned   = notes.filter(n => n.isPinned);
  const unpinned = notes.filter(n => !n.isPinned);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1 dark:text-white">
          {showArchived ? 'Archived Notes' : 'My Notes'}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {notes.length} note{notes.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* left: search + filters */}
        <div className="lg:w-56 flex-shrink-0 space-y-4">
          <SearchBar />
          <TagFilter />
        </div>

        {/* right: notes grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            </div>
          ) : notes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <FileText className="w-12 h-12 mb-3" />
              <p className="text-sm">No notes yet. Hit "New Note" to get started!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {pinned.length > 0 && (
                <section>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Pinned</p>
                  <NoteGrid notes={pinned} />
                </section>
              )}
              {unpinned.length > 0 && (
                <section>
                  {pinned.length > 0 && (
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Others</p>
                  )}
                  <NoteGrid notes={unpinned} />
                </section>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
