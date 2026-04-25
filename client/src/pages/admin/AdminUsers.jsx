import { useState, useEffect } from 'react'
import { FiTrash2, FiShield, FiUser } from 'react-icons/fi'
import api from '../../api/axios'
import AdminLayout from './AdminLayout'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'

export default function AdminUsers() {
  const [users, setUsers]     = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')
  const { user: me }          = useAuth()

  const load = () => {
    setLoading(true)
    api.get('/admin/users').then(r => setUsers(r.data)).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const toggleRole = async (id, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin'
    if (!confirm(`Change role to ${newRole}?`)) return
    try {
      await api.put(`/admin/users/${id}`, { role: newRole })
      toast.success('Role updated')
      setUsers(prev => prev.map(u => u._id === id ? { ...u, role: newRole } : u))
    } catch { toast.error('Update failed') }
  }

  const deleteUser = async (id, name) => {
    if (id === me._id) return toast.error("Can't delete yourself")
    if (!confirm(`Delete user "${name}"?`)) return
    try {
      await api.delete(`/admin/users/${id}`)
      toast.success('User deleted')
      setUsers(prev => prev.filter(u => u._id !== id))
    } catch { toast.error('Delete failed') }
  }

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <AdminLayout title="Manage Users">
      <div className="mb-5">
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="input-field max-w-sm"
        />
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left font-medium">User</th>
                <th className="px-4 py-3 text-left font-medium">Email</th>
                <th className="px-4 py-3 text-left font-medium">Role</th>
                <th className="px-4 py-3 text-left font-medium">Joined</th>
                <th className="px-4 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={5} className="text-center py-12 text-gray-400">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-12 text-gray-400">No users found</td></tr>
              ) : filtered.map(u => (
                <tr key={u._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${u.role === 'admin' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600'}`}>
                        {u.name[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{u.name}</p>
                        {u._id === me._id && <span className="text-xs text-orange-500">(You)</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`badge capitalize ${u.role === 'admin' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button
                        onClick={() => toggleRole(u._id, u.role)}
                        title={u.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                        className={`p-1.5 rounded-lg transition-colors ${u.role === 'admin' ? 'hover:bg-orange-50 text-orange-500' : 'hover:bg-blue-50 text-blue-500'}`}
                      >
                        {u.role === 'admin' ? <FiUser size={14} /> : <FiShield size={14} />}
                      </button>
                      <button
                        onClick={() => deleteUser(u._id, u.name)}
                        disabled={u._id === me._id}
                        className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2 text-xs text-gray-400 border-t">
          Total: {filtered.length} user(s)
        </div>
      </div>
    </AdminLayout>
  )
}
