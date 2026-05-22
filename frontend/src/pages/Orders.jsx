import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const statusColor = (s) => ({
  Pending: 'bg-yellow-100 text-yellow-800',
  Processing: 'bg-blue-100 text-blue-800',
  Shipped: 'bg-indigo-100 text-indigo-800',
  Delivered: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800',
}[s] || 'bg-neutral-100 text-neutral-700');

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/mine')
      .then(r => setOrders(r.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="max-w-5xl mx-auto p-6">Loading…</div>;

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Your Orders</h1>

      {orders.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-neutral-500 mb-4">You haven't placed any orders yet.</p>
          <Link to="/products" className="btn-primary inline-block">Start shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(o => (
            <div key={o._id} className="card overflow-hidden">
              {/* Header */}
              <div className="bg-neutral-50 dark:bg-neutral-800/50 px-4 py-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs sm:text-sm border-b border-neutral-200 dark:border-neutral-700">
                <div>
                  <div className="text-neutral-500 uppercase text-[10px] tracking-wide">Order placed</div>
                  <div>{new Date(o.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric'})}</div>
                </div>
                <div>
                  <div className="text-neutral-500 uppercase text-[10px] tracking-wide">Total</div>
                  <div className="font-semibold">₹{o.total}</div>
                </div>
                <div className="hidden sm:block">
                  <div className="text-neutral-500 uppercase text-[10px] tracking-wide">Ship to</div>
                  <div className="truncate">{o.shippingAddress?.name}</div>
                </div>
                <div className="col-span-2 sm:col-span-1 sm:text-right">
                  <div className="text-neutral-500 uppercase text-[10px] tracking-wide">Order #</div>
                  <div className="font-mono text-[11px]">{o._id.slice(-12).toUpperCase()}</div>
                </div>
              </div>

              {/* Body */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${statusColor(o.status)}`}>{o.status}</span>
                  <Link to={`/orders/${o._id}`} className="text-sm text-blue-600 hover:underline">View details →</Link>
                </div>

                <div className="space-y-3">
                  {o.items.slice(0, 3).map((it, i) => (
                    <div key={i} className="flex gap-3">
                      <Link to={`/products/${it.product}`} className="shrink-0">
                        <img
                          src={it.image || '/placeholder.png'}
                          alt={it.name}
                          className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded border border-neutral-200 dark:border-neutral-700"
                        />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link to={`/products/${it.product}`} className="font-medium text-sm sm:text-base line-clamp-2 hover:text-blue-600">
                          {it.name}
                        </Link>
                        <div className="text-xs text-neutral-500 mt-1 flex flex-wrap gap-x-3">
                          {it.shirtSize && <span>Size: {it.shirtSize}</span>}
                          {it.pantSize && <span>Size: {it.pantSize}</span>}
                          <span>Qty: {it.quantity}</span>
                        </div>
                        <div className="text-sm font-semibold mt-1">₹{it.price}</div>
                      </div>
                    </div>
                  ))}
                  {o.items.length > 3 && (
                    <Link to={`/orders/${o._id}`} className="text-sm text-blue-600 hover:underline block">
                      + {o.items.length - 3} more item(s)
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
