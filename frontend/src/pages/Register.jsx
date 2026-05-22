import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../redux/slices/authSlice';
import toast from 'react-hot-toast';
export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector(s => s.auth);
  useEffect(() => { if (user) navigate('/'); }, [user, navigate]);
  useEffect(() => { if (error) toast.error(error); }, [error]);
  return (
    <div className="max-w-md mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Create account</h1>
      <form onSubmit={e => { e.preventDefault(); dispatch(register(form)); }} className="space-y-3">
        <input className="input" placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
        <input className="input" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
        <input className="input" type="password" placeholder="Password (min 6)" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
        <button className="btn-primary w-full" disabled={loading}>{loading ? '…' : 'Register'}</button>
      </form>
      <p className="text-sm mt-4">Have account? <Link to="/login" className="text-brand">Login</Link></p>
    </div>
  );
}
