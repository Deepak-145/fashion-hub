import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleWishlist } from '../redux/slices/wishlistSlice';
import toast from 'react-hot-toast';

export default function ProductCard({ p }) {
  const dispatch = useDispatch();
  const { user } = useSelector(s => s.auth);
  const { products } = useSelector(s => s.wishlist);
  const liked = products.some(x => x._id === p._id || x === p._id);
  return (
    <div className="card overflow-hidden group">
      <Link to={`/products/${p._id}`} className="block aspect-[3/4] bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
        {p.images?.[0]
          ? <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
          : <div className="w-full h-full flex items-center justify-center text-4xl">👕</div>}
      </Link>
      <div className="p-3">
        <Link to={`/products/${p._id}`} className="font-medium line-clamp-1">{p.name}</Link>
        <div className="flex items-center justify-between mt-2">
          <div>
            <span className="font-bold text-brand">₹{p.price}</span>
            {p.mrp && p.mrp > p.price && <span className="ml-2 text-xs line-through text-neutral-500">₹{p.mrp}</span>}
          </div>
          {user?.role !== 'admin' && (
            <button
              onClick={() => { if (!user) return toast.error('Login first'); dispatch(toggleWishlist(p._id)); }}
              className="text-lg">{liked ? '❤️' : '🤍'}</button>
          )}
        </div>
      </div>
    </div>
  );
}
