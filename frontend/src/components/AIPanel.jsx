import { useState } from 'react';
import { Sparkles, Loader2, CheckSquare, Type, ChevronDown, ChevronUp } from 'lucide-react';
import { generateSummary, extractActionItems, suggestTitle } from '../services/aiService';
import toast from 'react-hot-toast';

// reusable AI action button
const AiBtn = ({ onClick, loading, icon: Icon, label }) => (
  <button onClick={onClick} disabled={loading}
    className="flex items-center justify-center gap-2 text-xs btn-secondary w-full">
    {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Icon className="w-3.5 h-3.5" />}
    {label}
  </button>
);

export default function AIPanel({ content, noteId, onTitleSuggest }) {
  const [summary, setSummary]         = useState('');
  const [actionItems, setActionItems] = useState([]);
  const [loading, setLoading]         = useState({});
  const [open, setOpen]               = useState(true);

  const run = async (type) => {
    if (!content?.trim()) return toast.error('Write something first');
    setLoading(l => ({ ...l, [type]: true }));
    try {
      if (type === 'summary') setSummary(await generateSummary(content, noteId));
      if (type === 'actions') setActionItems(await extractActionItems(content, noteId));
      if (type === 'title')   { onTitleSuggest?.(await suggestTitle(content)); toast.success('Title applied!'); }
    } catch (err) {
      toast.error(err.response?.data?.message || 'AI request failed');
    } finally {
      setLoading(l => ({ ...l, [type]: false }));
    }
  };

  return (
    <div className="card overflow-hidden">
      {/* collapsible header */}
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
        <span className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary-500" /> AI Assistant
        </span>
        {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {open && (
        <div className="p-4 pt-0 space-y-3">
          <div className="flex flex-col gap-2">
            <AiBtn onClick={() => run('summary')} loading={loading.summary} icon={Sparkles}    label="Generate Summary" />
            <AiBtn onClick={() => run('actions')} loading={loading.actions} icon={CheckSquare} label="Extract Action Items" />
            <AiBtn onClick={() => run('title')}   loading={loading.title}   icon={Type}        label="Suggest Title" />
          </div>

          {/* summary result */}
          {summary && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
              <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-1">Summary</p>
              <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">{summary}</p>
            </div>
          )}

          {/* action items result */}
          {actionItems.length > 0 && (
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
              <p className="text-xs font-semibold text-green-700 dark:text-green-400 mb-2">Action Items</p>
              {actionItems.map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-green-800 dark:text-green-300 mb-1">
                  <CheckSquare className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" /> {item}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
