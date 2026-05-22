import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { updateCartItem, removeCartItem } from '../redux/slices/cartSlice';

export default function Cart() {
  const dispatch = useDispatch();
  const { items } = useSelector(s => s.cart);
  const total = items.reduce((a,b) => a + (b.product?.price || 0) * b.quantity, 0);
  if (items.length === 0) return <div className="max-w-3xl mx-auto p-8 text-center"><p>Your cart is empty.</p><Link to="/products" className="btn-primary mt-4 inline-block">Shop now</Link></div>;
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-3">
        {items.map(i => (
          <div key={i._id} className="card p-3 flex gap-4">
            <img src={i.product?.images?.[0]} alt="" className="w-24 h-32 object-cover rounded" />
            <div className="flex-1">
              <div className="font-medium">{i.product?.name}</div>
              <div className="text-sm text-neutral-500">
                {i.shirtSize && `Shirt: ${i.shirtSize} `}{i.pantSize && `Pant: ${i.pantSize}`}
              </div>
              <div className="text-brand font-semibold mt-1">₹{i.product?.price}</div>
              <div className="flex items-center gap-2 mt-2">
                <input type="number" min="1" value={i.quantity}
                  onChange={e => dispatch(updateCartItem({ itemId: i._id, quantity: +e.target.value }))}
                  className="input w-20" />
                <button onClick={() => dispatch(removeCartItem(i._id))} className="text-red-500">Remove</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="card p-4 h-fit">
        <h3 className="font-bold mb-3">Summary</h3>
        <div className="flex justify-between mb-2"><span>Subtotal</span><span>₹{total}</span></div>
        <div className="flex justify-between mb-4 text-sm text-neutral-500"><span>Shipping</span><span>Calculated at checkout</span></div>
        <Link to="/checkout" className="btn-primary w-full">Checkout</Link>
      </div>
    </div>
  );
}
