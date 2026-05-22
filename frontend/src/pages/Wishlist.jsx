import { useSelector } from 'react-redux';
import ProductCard from '../components/ProductCard';
export default function Wishlist() {
  const { products } = useSelector(s => s.wishlist);
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>
      {products.length === 0 ? <p className="text-neutral-500">Empty.</p> :
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{products.map(p => <ProductCard key={p._id} p={p} />)}</div>}
    </div>
  );
}
