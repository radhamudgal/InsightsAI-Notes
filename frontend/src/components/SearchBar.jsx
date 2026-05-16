import { useRef } from 'react';
import { Search, X } from 'lucide-react';
import { useNoteStore } from '../store/noteStore';

export default function SearchBar() {
  const { searchQuery, setSearch, fetchNotes } = useNoteStore();
  const timer = useRef(null);

  const onChange = (e) => {
    setSearch(e.target.value);
    // debounce — wait 400ms after user stops typing before hitting the API
    clearTimeout(timer.current);
    timer.current = setTimeout(fetchNotes, 400);
  };

  const onClear = () => { setSearch(''); fetchNotes(); };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input
        value={searchQuery}
        onChange={onChange}
        placeholder="Search notes..."
        className="input-field pl-9 pr-8"
      />
      {searchQuery && (
        <button onClick={onClear} className="absolute right-3 top-1/2 -translate-y-1/2">
          <X className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
        </button>
      )}
    </div>
  );
}
