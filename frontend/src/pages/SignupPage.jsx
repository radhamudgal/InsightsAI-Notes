import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { BookOpen, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SignupPage() {
  const [form, setForm]       = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { signup } = useAuthStore();
  const navigate   = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await signup(form.name, form.email, form.password);
      navigate('/notes');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    } finally { setLoading(false); }
  };

  // field config to avoid repeating JSX
  const fields = [
    { key: 'name',     type: 'text',     label: 'Name',     placeholder: 'Your name' },
    { key: 'email',    type: 'email',    label: 'Email',    placeholder: 'you@example.com' },
    { key: 'password', type: 'password', label: 'Password', placeholder: 'Min 6 characters' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="card w-full max-w-md p-8">

        <div className="flex items-center justify-center gap-2 mb-8">
          <BookOpen className="w-8 h-8 text-primary-600" />
          <span className="text-2xl font-bold dark:text-white">InsightsAI Notes</span>
        </div>

        <h1 className="text-xl font-semibold mb-1 dark:text-white">Create account</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Start taking smarter notes</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map(({ key, type, label, placeholder }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
              <input type={type} required value={form[key]}
                onChange={e => setForm({ ...form, [key]: e.target.value })}
                className="input-field" placeholder={placeholder} />
            </div>
          ))}
          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Create Account
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
