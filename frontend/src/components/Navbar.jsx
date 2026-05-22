import { Link, NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { toggleDark } from '../redux/slices/uiSlice';
import { useState } from 'react';

export default function Navbar() {
  const dispatch = useDispatch();
  const { user } = useSelector(s => s.auth);
  const { items } = useSelector(s => s.cart);
  const { products } = useSelector(s => s.wishlist);
  const { dark } = useSelector(s => s.ui);
  const [open, setOpen] = useState(false);
  const isAdmin = user?.role === 'admin';
  const count = items.reduce((a, b) => a + b.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-neutral-950/90 backdrop-blur border-b border-neutral-200 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to={isAdmin ? '/admin' : '/'} className="text-2xl font-extrabold text-brand">Fashion<span className="text-neutral-900 dark:text-white">Hub</span></Link>
        <nav className="hidden md:flex items-center gap-6 font-medium">
          {isAdmin ? (
            <>
              <NavLink to="/admin" end className={({isActive}) => isActive ? 'text-brand' : ''}>Dashboard</NavLink>
              <NavLink to="/admin/products" className={({isActive}) => isActive ? 'text-brand' : ''}>Products</NavLink>
              <NavLink to="/admin/orders" className={({isActive}) => isActive ? 'text-brand' : ''}>Orders</NavLink>
              <NavLink to="/admin/users" className={({isActive}) => isActive ? 'text-brand' : ''}>Users</NavLink>
              <NavLink to="/admin/categories" className={({isActive}) => isActive ? 'text-brand' : ''}>Categories</NavLink>
            </>
          ) : (
            <>
              <NavLink to="/" className={({isActive}) => isActive ? 'text-brand' : ''}>Home</NavLink>
              <NavLink to="/products" className={({isActive}) => isActive ? 'text-brand' : ''}>Shop</NavLink>
              <NavLink to="/products?type=shirt">Shirts</NavLink>
              <NavLink to="/products?type=pant">Pants</NavLink>
              <NavLink to="/products?type=combo">Combo</NavLink>
              <NavLink to="/developer" className={({isActive}) => isActive ? 'text-brand' : ''}> Developer</NavLink>
          </>
          )}
        </nav>
        <div className="flex items-center gap-3">
          <button onClick={() => dispatch(toggleDark())} className="btn-outline !px-3 !py-1.5">{dark ? '☀️' : '🌙'}</button>
          {/* Cart & Wishlist are customer-only */}
          {!isAdmin && (
            <>
              <Link to="/wishlist" className="relative">❤️<span className="absolute -top-2 -right-2 bg-brand text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">{products.length}</span></Link>
              <Link to="/cart" className="relative">🛒<span className="absolute -top-2 -right-2 bg-brand text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">{count}</span></Link>
            </>
          )}
          {user ? (
            <div className="relative">
              <button onClick={() => setOpen(o=>!o)} className="btn-outline !px-3 !py-1.5">{user.name.split(' ')[0]} ▾</button>
              {open && (
                <div className="absolute right-0 mt-2 w-44 card py-1" onClick={() => setOpen(false)}>
                  <Link to="/profile" className="block px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800">Profile</Link>
                  {!isAdmin && <Link to="/orders" className="block px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800">My Orders</Link>}
                  {isAdmin && <Link to="/admin" className="block px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800">Admin Panel</Link>}
                  <button onClick={() => dispatch(logout())} className="w-full text-left px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800">Logout</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn-primary !px-3 !py-1.5">Login</Link>
          )}
        </div>
      </div>
    </header>
  );
}
