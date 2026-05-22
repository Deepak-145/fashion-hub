import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import api from '../utils/api';
import { setUser } from '../redux/slices/authSlice';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user } = useSelector(s => s.auth);
  const dispatch = useDispatch();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '',
    address: user?.address || { line1: '', city: '', state: '', pincode: '', country: 'India' } });

  const save = async (e) => {
    e.preventDefault();
    try { const r = await api.put('/auth/profile', form); dispatch(setUser({ ...user, ...r.data })); toast.success('Saved'); }
    catch { toast.error('Failed'); }
  };
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>
      <form onSubmit={save} className="space-y-3">
        <input className="input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Name" />
        <input className="input" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="Phone" />
        <h3 className="font-semibold mt-4">Address</h3>
        {['line1','city','state','pincode','country'].map(k => (
          <input key={k} className="input" value={form.address[k] || ''}
            onChange={e => setForm({...form, address: { ...form.address, [k]: e.target.value }})} placeholder={k} />
        ))}
        <button className="btn-primary">Save</button>
      </form>
    </div>
  );
}
