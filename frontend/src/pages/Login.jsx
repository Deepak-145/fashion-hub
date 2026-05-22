import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../redux/slices/authSlice';
import toast from 'react-hot-toast';
export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector(s => s.auth);
  useEffect(() => { if (user) navigate('/'); }, [user, navigate]);
  useEffect(() => { if (error) toast.error(error); }, [error]);
  return (
    <div className="max-w-md mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Login</h1>
      <form onSubmit={e => { e.preventDefault(); dispatch(login(form)); }} className="space-y-3">
        <input className="input" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
        <input className="input" type="password" placeholder="Password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
        <button className="btn-primary w-full" disabled={loading}>{loading ? '…' : 'Login'}</button>
      </form>
      <p className="text-sm mt-4">No account? <Link to="/register" className="text-brand">Register</Link></p>
    </div>
  );
}
