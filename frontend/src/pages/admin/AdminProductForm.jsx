import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const SHIRT = ['S','M','L','XL'];
const PANT = ['28','30','32','34','36','38'];

export default function AdminProductForm({ edit }) {
  const { id } = useParams();
  const nav = useNavigate();
  const [cats, setCats] = useState([]);
  const [form, setForm] = useState({
    name: '', description: '', price: 0, mrp: 0, productType: 'shirt', category: '',
    images: [], isFeatured: false,
    shirtSizes: SHIRT.map(size => ({ size, stock: 0 })),
    pantSizes: PANT.map(size => ({ size, stock: 0 })),
  });

  useEffect(() => {
    api.get('/categories').then(r => setCats(r.data));
    if (edit && id) api.get(`/products/${id}`).then(r => setForm({
      ...r.data,
      category: r.data.category?._id || '',
      shirtSizes: SHIRT.map(s => r.data.shirtSizes?.find(x=>x.size===s) || { size: s, stock: 0 }),
      pantSizes: PANT.map(s => r.data.pantSizes?.find(x=>x.size===s) || { size: s, stock: 0 }),
    }));
  }, [edit, id]);

  const upload = async (e) => {
    const fd = new FormData();
    [...e.target.files].forEach(f => fd.append('images', f));
    const { data } = await api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    setForm(f => ({ ...f, images: [...f.images, ...data.urls] }));
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (edit) await api.put(`/products/${id}`, form);
      else await api.post('/products', form);
      toast.success('Saved'); nav('/admin/products');
    } catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
  };

  const needShirt = form.productType === 'shirt' || form.productType === 'combo';
  const needPant = form.productType === 'pant' || form.productType === 'combo';

  return (
    <form onSubmit={submit} className="card p-5 space-y-3">
      <h2 className="text-xl font-bold">{edit ? 'Edit' : 'Add'} Product</h2>
      <input className="input" placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
      <textarea className="input" placeholder="Description" rows="3" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
      <div className="grid grid-cols-2 gap-3">
        <input className="input" type="number" placeholder="Price" value={form.price} onChange={e => setForm({...form, price: +e.target.value})} required />
        <input className="input" type="number" placeholder="MRP" value={form.mrp} onChange={e => setForm({...form, mrp: +e.target.value})} />
        <select className="input" value={form.productType} onChange={e => setForm({...form, productType: e.target.value})}>
          <option value="shirt">Shirt</option><option value="pant">Pant</option><option value="combo">Combo</option><option value="other">Other</option>
        </select>
        <select className="input" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
          <option value="">— Category —</option>
          {cats.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
      </div>
      <label className="flex items-center gap-2"><input type="checkbox" checked={form.isFeatured} onChange={e => setForm({...form, isFeatured: e.target.checked})} /> Featured</label>

      <div>
        <label className="block font-medium mb-1">Images</label>
        <input type="file" multiple accept="image/*" onChange={upload} />
        <div className="flex gap-2 mt-2 flex-wrap">
          {form.images.map((u,i) => (
            <div key={i} className="relative">
              <img src={u.startsWith('http') ? u : `${(import.meta.env.VITE_API_URL||'http://localhost:5000/api').replace('/api','')}${u}`} className="w-20 h-20 object-cover rounded" />
              <button type="button" onClick={() => setForm({...form, images: form.images.filter((_,j)=>j!==i)})} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs">×</button>
            </div>
          ))}
        </div>
      </div>

      {needShirt && (
        <div>
          <h3 className="font-semibold">Shirt Sizes & Stock</h3>
          <div className="grid grid-cols-4 gap-2">
            {form.shirtSizes.map((s, idx) => (
              <div key={s.size}>
                <label className="text-xs">{s.size}</label>
                <input className="input" type="number" min="0" value={s.stock}
                  onChange={e => { const v=[...form.shirtSizes]; v[idx]={...v[idx], stock:+e.target.value}; setForm({...form, shirtSizes: v}); }} />
              </div>
            ))}
          </div>
        </div>
      )}
      {needPant && (
        <div>
          <h3 className="font-semibold">Pant Sizes & Stock</h3>
          <div className="grid grid-cols-6 gap-2">
            {form.pantSizes.map((s, idx) => (
              <div key={s.size}>
                <label className="text-xs">{s.size}</label>
                <input className="input" type="number" min="0" value={s.stock}
                  onChange={e => { const v=[...form.pantSizes]; v[idx]={...v[idx], stock:+e.target.value}; setForm({...form, pantSizes: v}); }} />
              </div>
            ))}
          </div>
        </div>
      )}
      <button className="btn-primary">Save Product</button>
    </form>
  );
}
