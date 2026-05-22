import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import toast from 'react-hot-toast';
export default function AdminProducts() {
  const [items, setItems] = useState([]);
  const load = () => api.get('/products', { params: { limit: 100 } }).then(r => setItems(r.data.items));
  useEffect(() => { load(); }, []);
  const del = async (id) => { if (!confirm('Delete?')) return; await api.delete(`/products/${id}`); toast.success('Deleted'); load(); };
  return (
    <div>
      <div className="flex justify-between mb-4"><h2 className="text-xl font-bold">Products</h2><Link to="/admin/products/new" className="btn-primary">+ Add</Link></div>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-100 dark:bg-neutral-800"><tr><th className="p-2 text-left">Name</th><th>Type</th><th>Price</th><th>Stock</th><th></th></tr></thead>
          <tbody>
            {items.map(p => (
              <tr key={p._id} className="border-t border-neutral-200 dark:border-neutral-800">
                <td className="p-2">{p.name}</td><td className="text-center">{p.productType}</td>
                <td className="text-center">₹{p.price}</td>
                <td className="text-center">{(p.shirtSizes||[]).reduce((a,b)=>a+b.stock,0) + (p.pantSizes||[]).reduce((a,b)=>a+b.stock,0)}</td>
                <td className="text-right pr-2">
                  <Link to={`/admin/products/${p._id}/edit`} className="text-brand mr-3">Edit</Link>
                  <button onClick={() => del(p._id)} className="text-red-500">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
