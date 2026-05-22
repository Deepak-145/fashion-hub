import { useEffect, useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
export default function AdminCategories() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', slug: '', type: 'shirt' });
  const load = () => api.get('/categories').then(r => setItems(r.data));
  useEffect(() => { load(); }, []);
  const add = async (e) => { e.preventDefault(); try { await api.post('/categories', form); toast.success('Added'); setForm({ name: '', slug: '', type: 'shirt' }); load(); } catch (e) { toast.error(e.response?.data?.message); } };
  const del = async (id) => { await api.delete(`/categories/${id}`); load(); };
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <form onSubmit={add} className="card p-4 space-y-2">
        <h2 className="font-bold">New Category</h2>
        <input className="input" placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g,'-')})} />
        <input className="input" placeholder="Slug" value={form.slug} onChange={e=>setForm({...form,slug:e.target.value})} />
        <select className="input" value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>
          <option>shirt</option><option>pant</option><option>combo</option><option>other</option>
        </select>
        <button className="btn-primary">Add</button>
      </form>
      <div className="card p-4">
        <h2 className="font-bold mb-2">Categories</h2>
        {items.map(c => <div key={c._id} className="flex justify-between py-1"><span>{c.name} <span className="text-xs text-neutral-500">({c.type})</span></span><button onClick={()=>del(c._id)} className="text-red-500 text-sm">Delete</button></div>)}
      </div>
    </div>
  );
}
