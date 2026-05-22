import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { resetCart } from '../redux/slices/cartSlice';
import toast from 'react-hot-toast';

export default function Checkout() {
  const { items } = useSelector(s => s.cart);
  const { user } = useSelector(s => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [addr, setAddr] = useState({
    name: user?.name || '', phone: user?.phone || '',
    ...(user?.address || { line1: '', city: '', state: '', pincode: '', country: 'India' }),
  });
  const [method, setMethod] = useState('Razorpay');
  const [loading, setLoading] = useState(false);

  const itemsTotal = items.reduce((a, b) => a + (b.product?.price || 0) * b.quantity, 0);
  const shippingFee = itemsTotal > 999 ? 0 : 49;
  const total = itemsTotal + shippingFee;

  const buildItems = () =>
    items.map(i => ({
      product: i.product._id, name: i.product.name, image: i.product.images?.[0],
      price: i.product.price, shirtSize: i.shirtSize, pantSize: i.pantSize, quantity: i.quantity,
    }));

  const placeCOD = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/orders', {
        items: buildItems(), shippingAddress: addr,
        itemsTotal, shippingFee, total, paymentMethod: 'COD',
      });
      dispatch(resetCart());
      toast.success('Order placed! Pay on delivery.');
      navigate(`/orders/${data._id}`);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to place order');
    } finally { setLoading(false); }
  };

  const payRazorpay = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/orders/razorpay', { amount: total });
      const options = {
        key: data.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount, currency: data.currency, order_id: data.id,
        name: 'Singh Fashion', description: 'Order Payment',
        prefill: { name: addr.name, email: user.email, contact: addr.phone },
        theme: { color: '#b91c1c' },
        handler: async (resp) => {
          try {
            const { data: order } = await api.post('/orders', {
              items: buildItems(), shippingAddress: addr,
              itemsTotal, shippingFee, total,
              paymentMethod: 'Razorpay', paymentResult: resp,
            });
            dispatch(resetCart());
            toast.success('Payment successful!');
            navigate(`/orders/${order._id}`);
          } catch (err) { toast.error(err.response?.data?.message || 'Verification failed'); }
        },
        modal: { ondismiss: () => setLoading(false) },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to start payment');
      setLoading(false);
    }
  };

  const submit = (e) => {
    e.preventDefault();
    if (items.length === 0) return toast.error('Cart empty');
    if (method === 'COD') placeCOD();
    else payRazorpay();
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 grid md:grid-cols-3 gap-6">
      <form onSubmit={submit} className="md:col-span-2 space-y-6">
        <div className="card p-5 space-y-3">
          <h2 className="text-xl font-bold">Shipping Address</h2>
          <input className="input" placeholder="Full name" value={addr.name} onChange={e=>setAddr({...addr,name:e.target.value})} required />
          <input className="input" placeholder="Phone" value={addr.phone} onChange={e=>setAddr({...addr,phone:e.target.value})} required />
          <input className="input" placeholder="Address line" value={addr.line1} onChange={e=>setAddr({...addr,line1:e.target.value})} required />
          <div className="grid grid-cols-2 gap-3">
            <input className="input" placeholder="City" value={addr.city} onChange={e=>setAddr({...addr,city:e.target.value})} required />
            <input className="input" placeholder="State" value={addr.state} onChange={e=>setAddr({...addr,state:e.target.value})} required />
            <input className="input" placeholder="Pincode" value={addr.pincode} onChange={e=>setAddr({...addr,pincode:e.target.value})} required />
            <input className="input" placeholder="Country" value={addr.country} onChange={e=>setAddr({...addr,country:e.target.value})} required />
          </div>
        </div>

        <div className="card p-5 space-y-3">
          <h2 className="text-xl font-bold">Payment Method</h2>
          <label className={`flex items-start gap-3 p-3 rounded border cursor-pointer transition ${method==='Razorpay' ? 'border-brand bg-brand/5' : 'border-neutral-200 dark:border-neutral-700'}`}>
            <input type="radio" name="pm" value="Razorpay" checked={method==='Razorpay'} onChange={()=>setMethod('Razorpay')} className="mt-1" />
            <div>
              <div className="font-semibold">Razorpay (Card / UPI / Netbanking)</div>
              <div className="text-xs text-neutral-500">Pay securely online. Order confirmed after payment.</div>
            </div>
          </label>
          <label className={`flex items-start gap-3 p-3 rounded border cursor-pointer transition ${method==='COD' ? 'border-brand bg-brand/5' : 'border-neutral-200 dark:border-neutral-700'}`}>
            <input type="radio" name="pm" value="COD" checked={method==='COD'} onChange={()=>setMethod('COD')} className="mt-1" />
            <div>
              <div className="font-semibold">Cash on Delivery</div>
              <div className="text-xs text-neutral-500">Pay in cash when your order is delivered.</div>
            </div>
          </label>
        </div>

        <button className="btn-primary w-full" disabled={loading}>
          {loading ? 'Please wait…' : method === 'COD' ? `Place Order (Pay ₹${total} on Delivery)` : `Pay ₹${total} with Razorpay`}
        </button>
      </form>

      <div className="card p-4 h-fit md:sticky md:top-20">
        <h3 className="font-bold mb-3">Order Summary</h3>
        {items.map(i => (
          <div key={i._id} className="text-sm flex justify-between mb-1">
            <span className="truncate pr-2">{i.product?.name} ×{i.quantity}</span>
            <span className="shrink-0">₹{i.product?.price * i.quantity}</span>
          </div>
        ))}
        <hr className="my-2 border-neutral-200 dark:border-neutral-800" />
        <div className="flex justify-between"><span>Subtotal</span><span>₹{itemsTotal}</span></div>
        <div className="flex justify-between"><span>Shipping</span><span>{shippingFee ? `₹${shippingFee}` : 'Free'}</span></div>
        <div className="flex justify-between font-bold mt-2"><span>Total</span><span>₹{total}</span></div>
      </div>
    </div>
  );
}
