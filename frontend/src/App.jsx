import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Login from './pages/Login';
import Register from './pages/Register';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
import Admin from './pages/Admin';
import { loadCart } from './redux/slices/cartSlice';
import { loadWishlist } from './redux/slices/wishlistSlice';
import Developer from './pages/Developer';

// Customer-only route: blocks guests AND admins.
const CustomerRoute = ({ children }) => {
  const { user } = useSelector(s => s.auth);
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'admin') return <Navigate to="/admin" replace />;
  return children;
};

// Any logged-in user (customer or admin).
const Private = ({ children }) => {
  const { user } = useSelector(s => s.auth);
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// Admin-only route.
const AdminRoute = ({ children }) => {
  const { user } = useSelector(s => s.auth);
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
};

export default function App() {
  const dispatch = useDispatch();
  const { user } = useSelector(s => s.auth);
  const isAdmin = user?.role === 'admin';

  // Only load cart/wishlist for customer accounts. Admin shopping APIs are blocked server-side.
  useEffect(() => {
    if (user && !isAdmin) {
      dispatch(loadCart());
      dispatch(loadWishlist());
    }
  }, [user, isAdmin, dispatch]);

  return (
    <div className="min-h-full flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={isAdmin ? <Navigate to="/admin" replace /> : <Home />} />
          <Route path="/products" element={isAdmin ? <Navigate to="/admin/products" replace /> : <Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<CustomerRoute><Cart /></CustomerRoute>} />
          <Route path="/wishlist" element={<CustomerRoute><Wishlist /></CustomerRoute>} />
          <Route path="/checkout" element={<CustomerRoute><Checkout /></CustomerRoute>} />
          <Route path="/orders" element={<CustomerRoute><Orders /></CustomerRoute>} />
          <Route path="/orders/:id" element={<CustomerRoute><OrderDetails /></CustomerRoute>} />
          <Route path="/profile" element={<Private><Profile /></Private>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/developer" element={<Developer />} />
          <Route path="/admin/*" element={<AdminRoute><Admin /></AdminRoute>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
