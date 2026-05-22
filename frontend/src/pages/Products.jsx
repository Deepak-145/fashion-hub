import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts } from '../redux/slices/productSlice';
import ProductCard from '../components/ProductCard';

export default function Products() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector(s => s.products);
  const [params, setParams] = useSearchParams();
  useEffect(() => {
    const p = Object.fromEntries(params);
    dispatch(fetchProducts(p));
  }, [params, dispatch]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold">All Products</h1>
        <div className="flex gap-2">
          <input className="input max-w-xs" placeholder="Search…" defaultValue={params.get('q') || ''}
            onKeyDown={(e) => e.key === 'Enter' && setParams({ ...Object.fromEntries(params), q: e.target.value })} />
          <select className="input max-w-xs" value={params.get('type') || ''} onChange={(e) => {
            const p = Object.fromEntries(params); if (e.target.value) p.type = e.target.value; else delete p.type; setParams(p);
          }}>
            <option value="">All</option><option value="shirt">Shirt</option><option value="pant">Pant</option><option value="combo">Combo</option>
          </select>
        </div>
      </div>
      {loading ? <p>Loading…</p> :
        items.length === 0 ? <p className="text-neutral-500">No products found.</p> :
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{items.map(p => <ProductCard key={p._id} p={p} />)}</div>}
    </div>
  );
}
