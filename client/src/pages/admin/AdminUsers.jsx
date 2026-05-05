// ============================================================
// client/src/pages/admin/AdminUsers.jsx
// ============================================================
import { useState, useEffect } from 'react';
import { adminAPI } from '../../utils/api';
import { useAuthStore } from '../../utils/store';

const AdminUsers = () => {
  const { user: me }           = useAuthStore();
  const [users,      setUsers]   = useState([]);
  const [loading,    setLoading] = useState(true);
  const [search,     setSearch]  = useState('');
  const [page,       setPage]    = useState(1);
  const [pagination, setPagi]    = useState({});
  const [actionId,   setActionId] = useState(null); // loading state per row

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getUsers({ page, limit: 20, search });
      setUsers(res.data.data);
      setPagi(res.data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, [page, search]);

  const handleToggleRole = async (u) => {
    setActionId(u._id);
    try {
      await adminAPI.updateUser(u._id, { role: u.role === 'admin' ? 'user' : 'admin' });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
    } finally {
      setActionId(null);
    }
  };

  const handleToggleActive = async (u) => {
    setActionId(u._id);
    try {
      await adminAPI.updateUser(u._id, { isActive: !u.isActive });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (u) => {
    if (!window.confirm(`Delete user "${u.name}"? This cannot be undone.`)) return;
    setActionId(u._id);
    try {
      await adminAPI.deleteUser(u._id);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold dark:text-white">Users</h1>
        <input
          type="text" placeholder="Search by name or email..."
          value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="border dark:border-gray-600 rounded-xl px-4 py-2 w-full max-w-sm dark:bg-gray-800 dark:text-white"
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                <tr>
                  <th className="text-left px-4 py-3">User</th>
                  <th className="text-left px-4 py-3">Role</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Joined</th>
                  <th className="text-left px-4 py-3">Last Login</th>
                  <th className="text-right px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-gray-700">
                {users.map((u) => {
                  const isSelf    = u._id === me._id;
                  const isLoading = actionId === u._id;

                  return (
                    <tr key={u._id} className={`hover:bg-gray-50 dark:hover:bg-gray-750 ${!u.isActive ? 'opacity-50' : ''}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center text-orange-600 font-bold flex-shrink-0">
                            {u.name[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium dark:text-white">{u.name} {isSelf && <span className="text-xs text-gray-400">(you)</span>}</p>
                            <p className="text-xs text-gray-400">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          u.role === 'admin'
                            ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          u.isActive
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                        }`}>
                          {u.isActive ? 'Active' : 'Deactivated'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-xs">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-xs">
                        {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {!isSelf && (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleToggleRole(u)}
                              disabled={isLoading}
                              className="text-xs px-2 py-1 border border-orange-300 text-orange-600 rounded-lg hover:bg-orange-50 disabled:opacity-40"
                            >
                              {u.role === 'admin' ? 'Demote' : 'Promote'}
                            </button>
                            <button
                              onClick={() => handleToggleActive(u)}
                              disabled={isLoading}
                              className="text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40"
                            >
                              {u.isActive ? 'Deactivate' : 'Reactivate'}
                            </button>
                            <button
                              onClick={() => handleDelete(u)}
                              disabled={isLoading}
                              className="text-xs px-2 py-1 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 disabled:opacity-40"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {users.length === 0 && (
              <div className="text-center py-12 text-gray-400">No users found.</div>
            )}
          </div>
        )}

        {pagination.pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Page {pagination.page} of {pagination.pages} · {pagination.total} users
            </p>
            <div className="flex gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                className="px-3 py-1 border rounded-lg text-sm disabled:opacity-40 dark:border-gray-600 dark:text-white">
                ← Prev
              </button>
              <button onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))} disabled={page === pagination.pages}
                className="px-3 py-1 border rounded-lg text-sm disabled:opacity-40 dark:border-gray-600 dark:text-white">
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
