import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const statusColor = (s) => ({
  Pending: 'bg-yellow-100 text-yellow-800',
  Processing: 'bg-blue-100 text-blue-800',
  Shipped: 'bg-indigo-100 text-indigo-800',
  Delivered: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800',
}[s] || 'bg-neutral-100 text-neutral-700');

export default function AdminDashboard() {
  const [s, setS] = useState({});
  useEffect(() => { api.get('/admin/stats').then(r => setS(r.data)); }, []);

  const cards = [
    { l: 'Total Users', v: s.users, icon: '👥' },
    { l: 'Total Products', v: s.products, icon: '📦' },
    { l: 'Total Orders', v: s.orders, icon: '🧾' },
    { l: 'Total Revenue', v: s.revenue != null ? `₹${s.revenue}` : null, icon: '💰' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map(c => (
          <div key={c.l} className="card p-5">
            <div className="flex items-center justify-between">
              <div className="text-sm text-neutral-500">{c.l}</div>
              <div className="text-xl">{c.icon}</div>
            </div>
            <div className="text-2xl font-bold mt-2">{c.v ?? '…'}</div>
          </div>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
          <h2 className="font-semibold">Recent Orders</h2>
          <Link to="/admin/orders" className="text-sm text-blue-600 hover:underline">View all →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 dark:bg-neutral-800/50">
              <tr>
                <th className="p-3 text-left">Order</th>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Payment</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-right">Total</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {(s.recentOrders || []).map(o => (
                <tr key={o._id} className="border-t border-neutral-200 dark:border-neutral-800">
                  <td className="p-3 font-mono text-xs">#{o._id.slice(-8).toUpperCase()}</td>
                  <td className="p-3">{o.user?.name || '—'}</td>
                  <td className="p-3 text-xs">{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                  <td className="p-3 text-xs">{o.paymentMethod}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColor(o.status)}`}>{o.status}</span>
                  </td>
                  <td className="p-3 text-right font-semibold">₹{o.total}</td>
                  <td className="p-3 text-right">
                    <Link to={`/admin/orders/${o._id}`} className="text-blue-600 hover:underline text-sm">View</Link>
                  </td>
                </tr>
              ))}
              {(!s.recentOrders || s.recentOrders.length === 0) && (
                <tr><td colSpan="7" className="p-6 text-center text-neutral-500">No orders yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
