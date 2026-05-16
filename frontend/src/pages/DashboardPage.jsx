import { useEffect, useState } from 'react';
import api from '../services/api';
import { FileText, Archive, Pin, Globe, BookOpen, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const CHART_COLORS = ['#0ea5e9', '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="card p-5 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <p className="text-2xl font-bold dark:text-white">{value}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  </div>
);

export default function DashboardPage() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/stats').then(r => setData(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
    </div>
  );

  const { stats, activityData, tagData, categoryData, recentNotes } = data;
  const chartActivity   = activityData.map(d => ({ date: d._id.slice(5), notes: d.count }));
  const chartCategories = categoryData.map(d => ({ name: d._id, value: d.count }));

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1 dark:text-white">Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Your productivity overview</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard icon={FileText}  label="Active Notes"  value={stats.totalNotes}              color="bg-primary-500" />
        <StatCard icon={Archive}   label="Archived"      value={stats.archivedNotes}            color="bg-gray-400" />
        <StatCard icon={Pin}       label="Pinned"        value={stats.pinnedNotes}              color="bg-amber-500" />
        <StatCard icon={Globe}     label="Public"        value={stats.publicNotes}              color="bg-green-500" />
        <StatCard icon={BookOpen}  label="Total Words"   value={stats.totalWords.toLocaleString()} color="bg-purple-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Notes Created (Last 7 Days)</h2>
          {chartActivity.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartActivity}>
                <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" allowDecimals={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#f9fafb' }} />
                <Bar dataKey="notes" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-sm text-gray-400 text-center py-10">No activity in the last 7 days</p>}
        </div>

        <div className="card p-5">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Notes by Category</h2>
          {chartCategories.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={chartCategories} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                  {chartCategories.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Pie>
                <Legend />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#f9fafb' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : <p className="text-sm text-gray-400 text-center py-10">No data yet</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Top Tags</h2>
          {tagData.length > 0 ? (
            <div className="space-y-2">
              {tagData.map(t => (
                <div key={t._id} className="flex items-center gap-3">
                  <span className="text-xs text-gray-600 dark:text-gray-400 w-24 truncate">#{t._id}</span>
                  <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-primary-500 h-2 rounded-full" style={{ width: `${(t.count / tagData[0].count) * 100}%` }} />
                  </div>
                  <span className="text-xs text-gray-500 w-6 text-right">{t.count}</span>
                </div>
              ))}
            </div>
          ) : <p className="text-sm text-gray-400">No tags yet</p>}
        </div>

        <div className="card p-5">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Recently Updated</h2>
          <div className="space-y-3">
            {recentNotes.length === 0
              ? <p className="text-sm text-gray-400">No notes yet</p>
              : recentNotes.map(note => (
                <div key={note._id} className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium dark:text-white truncate">{note.title}</p>
                    <p className="text-xs text-gray-400">
                      {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })} · {note.wordCount} words
                    </p>
                  </div>
                  {note.tags?.slice(0, 2).map(tag => (
                    <span key={tag} className="text-xs bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 px-2 py-0.5 rounded-full flex-shrink-0">
                      #{tag}
                    </span>
                  ))}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
