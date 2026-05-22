import { useEffect, useState } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../utils/api';

const TIMELINE = ['Pending', 'Processing', 'Shipped', 'Delivered'];

const statusColor = (s) => ({
  Pending: 'bg-yellow-100 text-yellow-800',
  Processing: 'bg-blue-100 text-blue-800',
  Shipped: 'bg-indigo-100 text-indigo-800',
  Delivered: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800',
}[s] || 'bg-neutral-100 text-neutral-700');

export default function OrderDetails() {
  const { id } = useParams();
  const { user } = useSelector(s => s.auth);
  const location = useLocation();
  const isAdminView = user?.role === 'admin' || location.pathname.startsWith('/admin');

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/orders/${id}`)
      .then(r => setOrder(r.data))
      .catch(e => setError(e.response?.data?.message || 'Could not load order'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="max-w-5xl mx-auto p-6">Loading…</div>;
  if (error) return <div className="max-w-5xl mx-auto p-6 text-red-600">{error}</div>;
  if (!order) return null;

  const cancelled = order.status === 'Cancelled';
  const currentStep = TIMELINE.indexOf(order.status);
  const addr = order.shippingAddress || {};
  const customer = typeof order.user === 'object' && order.user ? order.user : null;

  return (
    <div className={isAdminView ? '' : 'max-w-5xl mx-auto p-4 sm:p-6'}>
      <Link to={isAdminView ? '/admin/orders' : '/orders'} className="text-sm text-blue-600 hover:underline">
        ← Back to {isAdminView ? 'Orders' : 'Your Orders'}
      </Link>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold">Order Details</h1>
        <span className={`px-3 py-1 rounded text-sm font-medium ${statusColor(order.status)}`}>{order.status}</span>
      </div>

      <div className="text-sm text-neutral-500 mt-1">
        Placed on {new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
        <span className="mx-2">·</span>
        <span className="font-mono text-xs">#{order._id.slice(-12).toUpperCase()}</span>
      </div>

      {!cancelled && (
        <div className="card p-4 sm:p-6 mt-6">
          <h2 className="font-semibold mb-4">Order Timeline</h2>
          <div className="flex items-center justify-between relative">
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-neutral-200 dark:bg-neutral-700 -z-0" />
            <div
              className="absolute top-4 left-0 h-0.5 bg-green-500 -z-0 transition-all"
              style={{ width: `${(Math.max(currentStep, 0) / (TIMELINE.length - 1)) * 100}%` }}
            />
            {TIMELINE.map((step, i) => {
              const done = i <= currentStep;
              return (
                <div key={step} className="relative z-10 flex flex-col items-center flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${done ? 'bg-green-500 text-white border-green-500' : 'bg-white dark:bg-neutral-800 text-neutral-400 border-neutral-300 dark:border-neutral-600'}`}>
                    {done ? '✓' : i + 1}
                  </div>
                  <div className={`mt-2 text-[11px] sm:text-xs text-center ${done ? 'text-neutral-900 dark:text-neutral-100 font-medium' : 'text-neutral-400'}`}>{step}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        <div className="lg:col-span-2 card p-4 sm:p-6">
          <h2 className="font-semibold mb-4">Items ({order.items.length})</h2>
          <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
            {order.items.map((it, i) => (
              <div key={i} className="flex gap-3 sm:gap-4 py-4 first:pt-0 last:pb-0">
                <Link to={`/products/${it.product}`} className="shrink-0">
                  <img
                    src={it.image || '/placeholder.png'}
                    alt={it.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded border border-neutral-200 dark:border-neutral-700"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/products/${it.product}`} className="font-medium hover:text-blue-600 line-clamp-2">
                    {it.name}
                  </Link>
                  <div className="text-xs text-neutral-500 mt-1 flex flex-wrap gap-x-3">
                    {it.shirtSize && <span>Size: {it.shirtSize}</span>}
                    {it.pantSize && <span>Size: {it.pantSize}</span>}
                    <span>Qty: {it.quantity}</span>
                  </div>
                  <div className="text-sm font-semibold mt-2">₹{it.price} <span className="text-xs font-normal text-neutral-500">each</span></div>
                </div>
                <div className="text-right font-semibold text-sm sm:text-base">
                  ₹{(it.price * it.quantity).toFixed(0)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {isAdminView && customer && (
            <div className="card p-4 sm:p-6">
              <h2 className="font-semibold mb-3">Customer</h2>
              <div className="text-sm space-y-1">
                <div className="font-medium">{customer.name}</div>
                <div className="text-neutral-500">{customer.email}</div>
                {customer.phone && <div className="text-neutral-500">📞 {customer.phone}</div>}
              </div>
            </div>
          )}

          <div className="card p-4 sm:p-6">
            <h2 className="font-semibold mb-3">Shipping Address</h2>
            <div className="text-sm text-neutral-600 dark:text-neutral-400 space-y-1">
              <div className="font-medium text-neutral-900 dark:text-neutral-100">{addr.name}</div>
              <div>{addr.line1}</div>
              <div>{addr.city}{addr.state ? `, ${addr.state}` : ''} {addr.pincode}</div>
              {addr.country && <div>{addr.country}</div>}
              {addr.phone && <div className="pt-1">📞 {addr.phone}</div>}
            </div>
          </div>

          <div className="card p-4 sm:p-6">
            <h2 className="font-semibold mb-3">Payment</h2>
            <div className="text-sm space-y-1">
              <div className="flex justify-between"><span className="text-neutral-500">Method</span><span className="font-medium">{order.paymentMethod}</span></div>
              <div className="flex justify-between"><span className="text-neutral-500">Status</span>
                <span className={order.isPaid ? 'text-green-600 font-medium' : 'text-yellow-600 font-medium'}>
                  {order.isPaid ? 'Paid' : order.paymentMethod === 'COD' ? 'Pay on Delivery' : 'Pending'}
                </span>
              </div>
              {order.paidAt && (
                <div className="flex justify-between"><span className="text-neutral-500">Paid on</span>
                  <span className="text-xs">{new Date(order.paidAt).toLocaleDateString('en-IN')}</span>
                </div>
              )}
              {order.paymentResult?.razorpay_payment_id && (
                <div className="pt-2 border-t border-neutral-200 dark:border-neutral-700 mt-2">
                  <div className="text-[11px] text-neutral-500">Payment ID</div>
                  <div className="font-mono text-[11px] break-all">{order.paymentResult.razorpay_payment_id}</div>
                </div>
              )}
            </div>
          </div>

          <div className="card p-4 sm:p-6">
            <h2 className="font-semibold mb-3">Order Summary</h2>
            <div className="text-sm space-y-2">
              <div className="flex justify-between"><span className="text-neutral-500">Items</span><span>₹{order.itemsTotal}</span></div>
              <div className="flex justify-between"><span className="text-neutral-500">Shipping</span><span>{order.shippingFee ? `₹${order.shippingFee}` : 'Free'}</span></div>
              <div className="flex justify-between font-bold text-base pt-2 border-t border-neutral-200 dark:border-neutral-700">
                <span>Total</span><span>₹{order.total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
