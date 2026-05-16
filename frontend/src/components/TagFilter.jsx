import { Tag } from 'lucide-react';
import { useNoteStore } from '../store/noteStore';

const CATEGORIES = ['general', 'work', 'personal', 'study', 'ideas', 'todo'];

export default function TagFilter() {
  const { notes, activeTag, setActiveTag, activeCategory, setActiveCategory, fetchNotes } = useNoteStore();

  // collect unique tags from loaded notes
  const allTags = [...new Set(notes.flatMap(n => n.tags || []))].slice(0, 15);

  // toggle: clicking the active filter clears it, clicking a new one sets it
  const pick = (setter, current, val) => {
    setter(current === val ? '' : val);
    setTimeout(fetchNotes, 0);
  };

  const catClass = (active) =>
    `text-xs px-2.5 py-1 rounded-full capitalize transition-colors cursor-pointer
     ${active ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`;

  const tagClass = (active) =>
    `text-xs px-2.5 py-1 rounded-full transition-colors cursor-pointer
     ${active ? 'bg-primary-600 text-white' : 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 hover:bg-primary-100'}`;

  return (
    <div className="space-y-4">
      {/* category filter */}
      <div>
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Categories</p>
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => pick(setActiveCategory, activeCategory, cat)} className={catClass(activeCategory === cat)}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* tag filter — only shown if notes have tags */}
      {allTags.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1">
            <Tag className="w-3 h-3" /> Tags
          </p>
          <div className="flex flex-wrap gap-1.5">
            {allTags.map(tag => (
              <button key={tag} onClick={() => pick(setActiveTag, activeTag, tag)} className={tagClass(activeTag === tag)}>
                #{tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
