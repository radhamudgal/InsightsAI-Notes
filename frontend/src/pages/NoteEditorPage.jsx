import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNoteStore } from '../store/noteStore';
import AIPanel from '../components/AIPanel';
import { ArrowLeft, Save, Loader2, Tag, X, Palette } from 'lucide-react';
import toast from 'react-hot-toast';

const COLORS     = ['#ffffff', '#fef9c3', '#dcfce7', '#dbeafe', '#fce7f3', '#ede9fe', '#ffedd5'];
const CATEGORIES = ['general', 'work', 'personal', 'study', 'ideas', 'todo'];

export default function NoteEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchNote, updateNote, currentNote, setCurrentNote } = useNoteStore();

  const [title, setTitle]         = useState('Untitled Note');
  const [content, setContent]     = useState('');
  const [tags, setTags]           = useState([]);
  const [tagInput, setTagInput]   = useState('');
  const [category, setCategory]   = useState('general');
  const [color, setColor]         = useState('#ffffff');
  const [saving, setSaving]       = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  // ref holds latest values so the debounced save always has fresh data
  const noteRef    = useRef({});
  noteRef.current  = { title, content, tags, category, color };
  const timerRef   = useRef(null);

  useEffect(() => {
    if (id) {
      fetchNote(id).then(note => {
        setTitle(note.title);
        setContent(note.content);
        setTags(note.tags || []);
        setCategory(note.category || 'general');
        setColor(note.color || '#ffffff');
      });
    }
    return () => setCurrentNote(null);
  }, [id]);

  // auto-save: fires 1.5s after the user stops typing
  useEffect(() => {
    if (!id) return;
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      setSaving(true);
      try {
        await updateNote(id, noteRef.current);
        setLastSaved(new Date());
      } catch { toast.error('Failed to save'); }
      finally { setSaving(false); }
    }, 1500);
    return () => clearTimeout(timerRef.current);
  }, [title, content, tags, category, color]);

  const addTag = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      const t = tagInput.trim().toLowerCase().replace(/,/g, '');
      if (!tags.includes(t)) setTags([...tags, t]);
      setTagInput('');
    }
  };

  return (
    <div className="flex h-full">
      {/* editor area */}
      <div className="flex-1 flex flex-col dark:bg-gray-900" style={{ backgroundColor: color === '#ffffff' ? undefined : color }}>

        {/* toolbar */}
        <div className="flex items-center gap-3 px-6 py-3 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <button onClick={() => navigate('/notes')} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <ArrowLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
          <div className="flex-1" />

          <select value={category} onChange={e => setCategory(e.target.value)}
            className="text-xs border border-gray-200 dark:border-gray-600 rounded-lg px-2 py-1.5 bg-white dark:bg-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-primary-500">
            {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
          </select>

          <div className="flex items-center gap-1">
            <Palette className="w-3.5 h-3.5 text-gray-400" />
            {COLORS.map(c => (
              <button key={c} onClick={() => setColor(c)}
                className={`w-5 h-5 rounded-full border-2 transition-transform hover:scale-110 ${color === c ? 'border-primary-500 scale-110' : 'border-gray-300'}`}
                style={{ backgroundColor: c }} />
            ))}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-gray-400 min-w-16">
            {saving
              ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...</>
              : lastSaved ? <><Save className="w-3.5 h-3.5" /> Saved</> : null}
          </div>
        </div>

        {/* title */}
        <div className="px-8 pt-8 pb-2">
          <input type="text" value={title} onChange={e => setTitle(e.target.value)}
            className="w-full text-3xl font-bold bg-transparent border-none outline-none placeholder-gray-300 dark:text-white dark:placeholder-gray-600"
            placeholder="Note title..." />
        </div>

        {/* tags */}
        <div className="px-8 pb-4 flex flex-wrap items-center gap-2">
          {tags.map(tag => (
            <span key={tag} className="flex items-center gap-1 bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 text-xs px-2.5 py-1 rounded-full">
              #{tag}
              <button onClick={() => setTags(tags.filter(t => t !== tag))}><X className="w-3 h-3" /></button>
            </span>
          ))}
          <div className="flex items-center gap-1">
            <Tag className="w-3.5 h-3.5 text-gray-400" />
            <input type="text" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={addTag}
              placeholder="Add tag..." className="text-xs bg-transparent border-none outline-none text-gray-500 dark:text-gray-400 placeholder-gray-300 w-24" />
          </div>
        </div>

        {/* content */}
        <div className="flex-1 px-8 pb-8">
          <textarea value={content} onChange={e => setContent(e.target.value)}
            className="w-full h-full min-h-64 text-gray-700 dark:text-gray-200 bg-transparent border-none outline-none resize-none text-base leading-relaxed placeholder-gray-300 dark:placeholder-gray-600"
            placeholder="Start writing your note..." />
        </div>
      </div>

      {/* AI sidebar */}
      <div className="w-72 border-l border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-4 overflow-y-auto">
        <AIPanel content={content} noteId={id} onTitleSuggest={t => setTitle(t)} />

        {currentNote && (
          <div className="mt-4 card p-4 text-xs text-gray-500 dark:text-gray-400 space-y-1">
            <p>Words: <span className="font-medium text-gray-700 dark:text-gray-200">{currentNote.wordCount || 0}</span></p>
            <p>Category: <span className="font-medium text-gray-700 dark:text-gray-200 capitalize">{currentNote.category}</span></p>
            {currentNote.isPublic && (
              <div>
                <p className="text-green-600 font-medium mb-1">Public link:</p>
                <p className="break-all text-primary-600 cursor-pointer hover:underline"
                  onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/share/${currentNote.shareId}`); toast.success('Link copied!'); }}>
                  /share/{currentNote.shareId}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
