import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/slices/productSlice';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const dispatch = useDispatch();
  const { items } = useSelector(s => s.products);
  useEffect(() => { dispatch(fetchProducts({ limit: 8 })); }, [dispatch]);
  return (
    <>
      <section className="bg-gradient-to-br from-brand to-brand-dark text-white">
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold">Fashion hub</h1>
          <p className="mt-4 text-lg md:text-xl text-brand-light">Premium shirts, pants & combos. Crafted for the modern you.</p>
          <Link to="/products" className="inline-block mt-6 bg-white text-brand font-semibold px-6 py-3 rounded-lg hover:bg-neutral-100">Shop Now</Link>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-3 gap-4">
          {[{t:'Shirts',q:'shirt',i:'👔'},{t:'Pants',q:'pant',i:'👖'},{t:'Combo',q:'combo',i:'🧥'}].map(c => (
            <Link key={c.q} to={`/products?type=${c.q}`} className="card p-6 text-center hover:shadow-md transition">
              <div className="text-4xl">{c.i}</div>
              <div className="mt-2 font-semibold">{c.t}</div>
            </Link>
          ))}
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Latest Arrivals</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map(p => <ProductCard key={p._id} p={p} />)}
        </div>
      </section>
    </>
  );
}
