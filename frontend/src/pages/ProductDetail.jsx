import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProduct } from '../redux/slices/productSlice';
import { addToCart } from '../redux/slices/cartSlice';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { current: p } = useSelector(s => s.products);
  const { user } = useSelector(s => s.auth);
  const [shirtSize, setShirtSize] = useState('');
  const [pantSize, setPantSize] = useState('');
  const [qty, setQty] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  useEffect(() => { dispatch(fetchProduct(id)); api.get(`/reviews/product/${id}`).then(r => setReviews(r.data)); }, [id, dispatch]);

  if (!p) return <div className="p-8">Loading…</div>;
  const needShirt = p.productType === 'shirt' || p.productType === 'combo';
  const needPant = p.productType === 'pant' || p.productType === 'combo';
  const shirtStock = p.shirtSizes?.find(s => s.size === shirtSize)?.stock ?? 0;
  const pantStock = p.pantSizes?.find(s => s.size === pantSize)?.stock ?? 0;

  const isAdmin = user?.role === 'admin';
  const handleAdd = async () => {
    if (!user) return toast.error('Login first');
    if (isAdmin) return toast.error('Admins cannot shop. Use a customer account.');
    if (needShirt && !shirtSize) return toast.error('Select shirt size');
    if (needPant && !pantSize) return toast.error('Select pant size');
    if (needShirt && shirtStock < qty) return toast.error('Insufficient shirt stock');
    if (needPant && pantStock < qty) return toast.error('Insufficient pant stock');
    await dispatch(addToCart({ product: p._id, shirtSize, pantSize, quantity: qty }));
    toast.success('Added to cart');
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Login first');
    try { await api.post('/reviews', { productId: id, rating, comment }); toast.success('Review posted'); setComment('');
      const r = await api.get(`/reviews/product/${id}`); setReviews(r.data);
    } catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-8">
      <div className="aspect-[3/4] bg-neutral-100 dark:bg-neutral-800 rounded-xl overflow-hidden">
        {p.images?.[0] ? <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-6xl">👕</div>}
      </div>
      <div>
        <h1 className="text-3xl font-bold">{p.name}</h1>
        <p className="text-neutral-600 dark:text-neutral-400 mt-2">{p.description}</p>
        <div className="flex items-center gap-3 mt-4">
          <span className="text-2xl font-bold text-brand">₹{p.price}</span>
          {p.mrp > p.price && <span className="line-through text-neutral-500">₹{p.mrp}</span>}
        </div>
        <div className="text-sm text-yellow-600 mt-1">★ {p.rating?.toFixed(1) || 0} ({p.numReviews} reviews)</div>

        {needShirt && (
          <div className="mt-6">
            <div className="font-medium mb-2">Shirt Size</div>
            <div className="flex gap-2 flex-wrap">
              {['S','M','L','XL'].map(s => {
                const st = p.shirtSizes?.find(x => x.size === s)?.stock ?? 0;
                return <button key={s} onClick={() => setShirtSize(s)} disabled={st === 0}
                  className={`px-4 py-2 rounded-lg border ${shirtSize===s?'bg-brand text-white border-brand':'border-neutral-300 dark:border-neutral-700'} disabled:opacity-40 disabled:line-through`}>{s}</button>;
              })}
            </div>
            {shirtSize && <p className="text-xs text-neutral-500 mt-1">In stock: {shirtStock}</p>}
          </div>
        )}
        {needPant && (
          <div className="mt-6">
            <div className="font-medium mb-2">Pant Size</div>
            <div className="flex gap-2 flex-wrap">
              {[28,30,32,34,36,38].map(s => {
                const st = p.pantSizes?.find(x => x.size === String(s))?.stock ?? 0;
                return <button key={s} onClick={() => setPantSize(String(s))} disabled={st === 0}
                  className={`px-4 py-2 rounded-lg border ${pantSize===String(s)?'bg-brand text-white border-brand':'border-neutral-300 dark:border-neutral-700'} disabled:opacity-40 disabled:line-through`}>{s}</button>;
              })}
            </div>
            {pantSize && <p className="text-xs text-neutral-500 mt-1">In stock: {pantStock}</p>}
          </div>
        )}

        {!isAdmin && (
          <div className="flex items-center gap-3 mt-6">
            <input type="number" min="1" value={qty} onChange={e => setQty(Math.max(1, +e.target.value))} className="input w-24" />
            <button onClick={handleAdd} className="btn-primary">Add to Cart</button>
          </div>
        )}
        {isAdmin && (
          <p className="mt-6 text-sm text-neutral-500 italic">Admin accounts cannot place orders. Sign in as a customer to shop.</p>
        )}

        <section className="mt-10">
          <h2 className="text-xl font-bold mb-3">Reviews</h2>
          {user && (
            <form onSubmit={submitReview} className="card p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span>Rating:</span>
                <select className="input w-20" value={rating} onChange={e => setRating(+e.target.value)}>
                  {[5,4,3,2,1].map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <textarea className="input" rows="3" placeholder="Your review…" value={comment} onChange={e => setComment(e.target.value)} />
              <button className="btn-primary mt-2">Post Review</button>
            </form>
          )}
          {reviews.length === 0 ? <p className="text-neutral-500">No reviews yet.</p> :
            reviews.map(r => (
              <div key={r._id} className="card p-3 mb-2">
                <div className="font-medium">{r.name} <span className="text-yellow-500">{'★'.repeat(r.rating)}</span></div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">{r.comment}</p>
              </div>
            ))}
        </section>
      </div>
    </div>
  );
}
