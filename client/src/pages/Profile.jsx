import { useState } from 'react';
import { useAuthStore } from '../utils/store';
import { authAPI } from '../utils/api';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, updateUser } = useAuthStore();
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [saved, setSaved] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const { data } = await authAPI.updateProfile(form);
      updateUser(data.user);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      toast.success('Profile updated!');
    } catch { toast.error('Update failed'); }
  };

  return (
    <div className="pt-24 pb-16">
      <div className="container-custom max-w-2xl">
        <h1 className="font-display text-3xl font-bold text-[var(--text)] mb-8">Profile Settings</h1>
        <div className="card p-8">
          <div className="flex items-center gap-5 mb-8">
            <div className="w-20 h-20 bg-primary-500 rounded-2xl flex items-center justify-center text-white font-display text-3xl font-bold">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-[var(--text)]">{user?.name}</h2>
              <p className="text-[var(--text-muted)]">{user?.email}</p>
              {user?.role === 'admin' && <span className="badge bg-primary-100 dark:bg-primary-950 text-primary-600 mt-1">Admin</span>}
            </div>
          </div>
          <form onSubmit={handleSave} className="space-y-4">
            {[['name', 'Full Name', 'text'], ['email', 'Email', 'email']].map(([key, label, type]) => (
              <div key={key}>
                <label className="block text-sm font-semibold text-[var(--text-muted)] mb-2">{label}</label>
                <input type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} className="input-field" />
              </div>
            ))}
            <button type="submit" className={`btn-primary ${saved ? 'bg-emerald-500' : ''}`}>
              {saved ? '✓ Saved!' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
