import { useState, useEffect } from 'react'
import api from '../../api/axios'
import AdminLayout from './AdminLayout'
import toast from 'react-hot-toast'

const STATUS_OPTIONS = ['pending','confirmed','processing','shipped','delivered','cancelled']
const STATUS_COLOR   = {
  pending:    'bg-yellow-100 text-yellow-700',
  confirmed:  'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  shipped:    'bg-indigo-100 text-indigo-700',
  delivered:  'bg-green-100 text-green-700',
  cancelled:  'bg-red-100 text-red-700',
}

export default function AdminOrders() {
  const [orders, setOrders]   = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter]   = useState('')

  const load = () => {
    setLoading(true)
    api.get('/admin/orders').then(r => setOrders(r.data)).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/admin/orders/${id}/status`, { status })
      toast.success('Status updated')
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o))
    } catch { toast.error('Update failed') }
  }

  const filtered = filter ? orders.filter(o => o.status === filter) : orders

  return (
    <AdminLayout title="Manage Orders">
      {/* Filter tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        <button onClick={() => setFilter('')}
          className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${!filter ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
          All ({orders.length})
        </button>
        {STATUS_OPTIONS.map(s => {
          const count = orders.filter(o => o.status === s).length
          return (
            <button key={s} onClick={() => setFilter(s)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors capitalize ${filter === s ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
              {s} ({count})
            </button>
          )
        })}
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Order ID</th>
                <th className="px-4 py-3 text-left font-medium">Customer</th>
                <th className="px-4 py-3 text-left font-medium">Items</th>
                <th className="px-4 py-3 text-left font-medium">Total</th>
                <th className="px-4 py-3 text-left font-medium">Payment</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={7} className="text-center py-12 text-gray-400">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-gray-400">No orders found</td></tr>
              ) : filtered.map(order => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-700">
                    #{order._id.slice(-8).toUpperCase()}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800">{order.user?.name || '—'}</p>
                    <p className="text-xs text-gray-400">{order.user?.email}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{order.items?.length} item(s)</td>
                  <td className="px-4 py-3 font-bold text-gray-900">${order.totalPrice?.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`badge capitalize ${order.isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                      {order.isPaid ? '✓ Paid' : 'Unpaid'}
                    </span>
                    <p className="text-xs text-gray-400 mt-0.5 capitalize">{order.paymentMethod}</p>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={order.status}
                      onChange={e => updateStatus(order._id, e.target.value)}
                      className={`text-xs font-medium px-2 py-1 rounded-lg border-0 cursor-pointer ${STATUS_COLOR[order.status]}`}
                    >
                      {STATUS_OPTIONS.map(s => <option key={s} value={s} className="bg-white text-gray-700 capitalize">{s}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}
