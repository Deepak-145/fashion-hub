import { Routes, Route, NavLink } from 'react-router-dom';
import AdminDashboard from './admin/AdminDashboard';
import AdminProducts from './admin/AdminProducts';
import AdminProductForm from './admin/AdminProductForm';
import AdminUsers from './admin/AdminUsers';
import AdminOrders from './admin/AdminOrders';
import AdminCategories from './admin/AdminCategories';
import OrderDetails from './OrderDetails';


export default function Admin() {
  const link = ({ isActive }) => `block px-3 py-2 rounded ${isActive ? 'bg-brand text-white' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'}`;
  return (
    <div className="max-w-7xl mx-auto p-4 grid md:grid-cols-[200px_1fr] gap-4">
      <aside className="card p-2 h-fit space-y-1 text-sm">
        <NavLink to="/admin" end className={link}>Dashboard</NavLink>
        <NavLink to="/admin/products" className={link}>Products</NavLink>
        <NavLink to="/admin/products/new" className={link}>+ Add Product</NavLink>
        <NavLink to="/admin/categories" className={link}>Categories</NavLink>
        <NavLink to="/admin/orders" className={link}>Orders</NavLink>
        <NavLink to="/admin/users" className={link}>Users</NavLink>
      </aside>
      <section>
        <Routes>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/new" element={<AdminProductForm />} />
          <Route path="products/:id/edit" element={<AdminProductForm edit />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="orders/:id" element={<OrderDetails />} />
          <Route path="users" element={<AdminUsers />} />
        </Routes>
      </section>
    </div>
  );
}
