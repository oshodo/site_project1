// client/src/pages/Profile.jsx
import { useState } from 'react';
import { useAuthStore } from '../utils/store';
import { authAPI } from '../utils/api';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser } = useAuthStore();

  const [profile, setProfile] = useState({
    name:   user?.name   || '',
    phone:  user?.phone  || '',
    street: user?.address?.street || '',
    city:   user?.address?.city   || '',
    state:  user?.address?.state  || '',
    zip:    user?.address?.zip    || '',
  });
  const [pwd, setPwd] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPwd,     setSavingPwd]     = useState(false);
  const [tab, setTab] = useState('profile');

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await authAPI.updateProfile({
        name:    profile.name,
        phone:   profile.phone,
        address: { street: profile.street, city: profile.city, state: profile.state, zip: profile.zip },
      });
      updateUser(res.data.data);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePwdSubmit = async (e) => {
    e.preventDefault();
    if (pwd.newPassword !== pwd.confirm) { toast.error('Passwords do not match'); return; }
    setSavingPwd(true);
    try {
      await authAPI.changePassword({ currentPassword: pwd.currentPassword, newPassword: pwd.newPassword });
      toast.success('Password changed successfully!');
      setPwd({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setSavingPwd(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="card p-6 mb-6 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-orange-500 text-white flex items-center justify-center text-2xl font-extrabold">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-bold dark:text-white">{user?.name}</h1>
            <p className="text-gray-400 text-sm">{user?.email}</p>
            <span className="inline-block mt-1 px-2 py-0.5 text-xs font-semibold rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300 capitalize">
              {user?.role}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b dark:border-gray-700 mb-6">
          {['profile', 'security'].map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-3 text-sm font-semibold capitalize transition-colors ${tab === t ? 'border-b-2 border-orange-500 text-orange-500' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>
              {t === 'profile' ? '👤 Profile' : '🔒 Security'}
            </button>
          ))}
        </div>

        {tab === 'profile' && (
          <form onSubmit={handleProfileSubmit} className="card p-6 space-y-5">
            <h2 className="font-bold text-lg dark:text-white">Personal Information</h2>
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-white">Full Name</label>
              <input value={profile.name} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))} className="input" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-white">Phone Number</label>
              <input value={profile.phone} onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))} className="input" placeholder="+977-98XXXXXXXX" />
            </div>
            <hr className="dark:border-gray-700" />
            <h3 className="font-semibold dark:text-white">Default Address</h3>
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-white">Street</label>
              <input value={profile.street} onChange={(e) => setProfile((p) => ({ ...p, street: e.target.value }))} className="input" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-white">City</label>
                <input value={profile.city} onChange={(e) => setProfile((p) => ({ ...p, city: e.target.value }))} className="input" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-white">State</label>
                <input value={profile.state} onChange={(e) => setProfile((p) => ({ ...p, state: e.target.value }))} className="input" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-white">ZIP</label>
                <input value={profile.zip} onChange={(e) => setProfile((p) => ({ ...p, zip: e.target.value }))} className="input" />
              </div>
            </div>
            <button type="submit" disabled={savingProfile} className="btn-primary w-full py-3">
              {savingProfile ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        )}

        {tab === 'security' && (
          <form onSubmit={handlePwdSubmit} className="card p-6 space-y-5">
            <h2 className="font-bold text-lg dark:text-white">Change Password</h2>
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-white">Current Password</label>
              <input type="password" value={pwd.currentPassword} onChange={(e) => setPwd((p) => ({ ...p, currentPassword: e.target.value }))} className="input" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-white">New Password</label>
              <input type="password" value={pwd.newPassword} onChange={(e) => setPwd((p) => ({ ...p, newPassword: e.target.value }))} className="input" required minLength={6} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-white">Confirm New Password</label>
              <input type="password" value={pwd.confirm} onChange={(e) => setPwd((p) => ({ ...p, confirm: e.target.value }))} className="input" required />
            </div>
            <button type="submit" disabled={savingPwd} className="btn-primary w-full py-3">
              {savingPwd ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
