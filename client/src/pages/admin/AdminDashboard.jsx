import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiPackage, FiUsers, FiShoppingBag, FiDollarSign, FiArrowRight } from 'react-icons/fi'
import api from '../../api/axios'
import AdminLayout from './AdminLayout'

export default function AdminDashboard() {
  const [stats, setStats]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/admin/stats').then(r => setStats(r.data)).finally(() => setLoading(false))
  }, [])

  const STATUS_COLOR = {
    pending:    'bg-yellow-100 text-yellow-700',
    confirmed:  'bg-blue-100 text-blue-700',
    processing: 'bg-purple-100 text-purple-700',
    shipped:    'bg-indigo-100 text-indigo-700',
    delivered:  'bg-green-100 text-green-700',
    cancelled:  'bg-red-100 text-red-700',
  }

  return (
    <AdminLayout title="Dashboard">
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
          {[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-gray-100 rounded-xl" />)}
        </div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { icon: FiDollarSign, label: 'Total Revenue',  value: `$${stats?.totalRevenue?.toFixed(2) || '0.00'}`, color: 'bg-green-50 text-green-600' },
              { icon: FiShoppingBag,label: 'Total Orders',   value: stats?.totalOrders,   color: 'bg-blue-50 text-blue-600' },
              { icon: FiPackage,    label: 'Total Products', value: stats?.totalProducts, color: 'bg-orange-50 text-orange-600' },
              { icon: FiUsers,      label: 'Total Users',    value: stats?.totalUsers,    color: 'bg-purple-50 text-purple-600' },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="card p-5">
                <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}>
                  <Icon size={20} />
                </div>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-sm text-gray-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Recent Orders */}
          <div className="card p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-800">Recent Orders</h3>
              <Link to="/admin/orders" className="text-sm text-orange-500 hover:text-orange-600 flex items-center gap-1">
                View all <FiArrowRight size={13} />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-500 border-b">
                    <th className="pb-2 font-medium">Order ID</th>
                    <th className="pb-2 font-medium">Customer</th>
                    <th className="pb-2 font-medium">Total</th>
                    <th className="pb-2 font-medium">Status</th>
                    <th className="pb-2 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {stats?.recentOrders?.map(order => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="py-2.5 font-mono text-xs">#{order._id.slice(-6).toUpperCase()}</td>
                      <td className="py-2.5">{order.user?.name || 'Unknown'}</td>
                      <td className="py-2.5 font-medium">${order.totalPrice?.toFixed(2)}</td>
                      <td className="py-2.5">
                        <span className={`badge capitalize ${STATUS_COLOR[order.status] || 'bg-gray-100 text-gray-600'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-2.5 text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  )
}
