import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const statusColor = (s) => ({
  Pending: 'bg-yellow-100 text-yellow-800',
  Processing: 'bg-blue-100 text-blue-800',
  Shipped: 'bg-indigo-100 text-indigo-800',
  Delivered: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800',
}[s] || 'bg-neutral-100 text-neutral-700');

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => api.get('/admin/orders').then(r => setOrders(r.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const setStatus = async (id, status) => {
    await api.put(`/admin/orders/${id}/status`, { status });
    toast.success('Order updated');
    load();
  };

  if (loading) return <div>Loading…</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Orders ({orders.length})</h1>

      {orders.length === 0 && <div className="card p-6 text-center text-neutral-500">No orders yet.</div>}

      {orders.map(o => (
        <div key={o._id} className="card overflow-hidden">
          <div className="bg-neutral-50 dark:bg-neutral-800/50 px-4 py-3 grid grid-cols-2 md:grid-cols-5 gap-3 text-xs sm:text-sm border-b border-neutral-200 dark:border-neutral-700">
            <div>
              <div className="text-neutral-500 uppercase text-[10px]">Order</div>
              <div className="font-mono text-[11px]">#{o._id.slice(-10).toUpperCase()}</div>
            </div>
            <div>
              <div className="text-neutral-500 uppercase text-[10px]">Customer</div>
              <div className="truncate">{o.user?.name || '—'}</div>
              <div className="truncate text-[11px] text-neutral-500">{o.user?.email}</div>
            </div>
            <div>
              <div className="text-neutral-500 uppercase text-[10px]">Date</div>
              <div>{new Date(o.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric'})}</div>
            </div>
            <div>
              <div className="text-neutral-500 uppercase text-[10px]">Payment</div>
              <div>{o.paymentMethod}</div>
              <div className={`text-[11px] ${o.isPaid ? 'text-green-600' : 'text-yellow-600'}`}>{o.isPaid ? 'Paid' : 'Pending'}</div>
            </div>
            <div>
              <div className="text-neutral-500 uppercase text-[10px]">Total</div>
              <div className="font-semibold">₹{o.total}</div>
            </div>
          </div>

          <div className="p-4">
            <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
              <span className={`px-2 py-1 rounded text-xs font-medium ${statusColor(o.status)}`}>{o.status}</span>
              <div className="flex items-center gap-2">
                <select
                  value={o.status}
                  onChange={e => setStatus(o._id, e.target.value)}
                  className="input !py-1 !text-sm"
                >
                  <option>Pending</option><option>Processing</option><option>Shipped</option><option>Delivered</option><option>Cancelled</option>
                </select>
                <Link to={`/admin/orders/${o._id}`} className="btn-outline !py-1 !px-3 !text-sm">View Details</Link>
              </div>
            </div>

            <div className="space-y-3">
              {o.items.slice(0, 3).map((it, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <img
                    src={it.image || '/placeholder.png'}
                    alt={it.name}
                    className="w-14 h-14 object-cover rounded border border-neutral-200 dark:border-neutral-700 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm line-clamp-1">{it.name}</div>
                    <div className="text-xs text-neutral-500 flex flex-wrap gap-x-3 mt-0.5">
                      {it.shirtSize && <span>Size: {it.shirtSize}</span>}
                      {it.pantSize && <span>Size: {it.pantSize}</span>}
                      <span>Qty: {it.quantity}</span>
                    </div>
                  </div>
                  <div className="text-sm font-semibold shrink-0">₹{it.price * it.quantity}</div>
                </div>
              ))}
              {o.items.length > 3 && (
                <Link to={`/admin/orders/${o._id}`} className="text-sm text-blue-600 hover:underline block">
                  + {o.items.length - 3} more item(s)
                </Link>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
