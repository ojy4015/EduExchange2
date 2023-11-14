import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Menu from "./components/nav/Menu";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/user/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminCategory from "./pages/admin/Category";
import AdminProduct from "./pages/admin/Product";
import AdminProducts from "./pages/admin/Products";
import AdminProductUpdate from "./pages/admin/ProductUpdate";
import UserProduct from "./pages/user/UserProduct";
import UserProfile from "./pages/user/Profile";
import ChangePassword from "./pages/user/ChangePassword";
import UserOrders from "./pages/user/Orders";
import AdminOrders from "./pages/admin/Orders";
import PrivateRoute from "./components/routes/PrivateRoute";
import AdminRoute from "./components/routes/AdminRoute";
import PageNotFound from "./pages/user/PageNotFound";
import { Button, Layout } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import "./styles/dashboard.css";
import Shop from "./pages/Shop";
import Search from "./pages/Search";
import SearchNew from "./pages/SearchNew";
import Cart from "./pages/Cart";
import ProductView from "./pages/ProductView";
import CategoriesList from "./pages/CategoriesList";
import CategoryView from "./pages/CategoryView";
import AccountActivate from "./pages/auth/AccountActivate";
import ForgotPassword from "./pages/auth/ForgotPassword";
import AccessAccount from "./pages/auth/AccessAccount";
import Footer from "./components/nav/Footer";
import MyAdminStore from "./pages/admin/MyAdminStore";
import MyUserStore from "./pages/user/MyUserStore";
import TourEdit from "./pages/user/TourEdit";
import Wishlist from "./pages/user/Wishlist";
import Enquiries from "./pages/user/Enquiries";
import Agents from "./pages/Agents";
import Agent from "./pages/Agent";
import Buy from "./pages/Buy";
import Rent from "./pages/Rent";

export default function App() {
  return (
    <BrowserRouter>
      <Menu />
      <Toaster position="top-right" />

      <div id="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/agent/:username" element={<Agent />} />
          <Route path="/buy" element={<Buy />} />
          <Route path="/rent" element={<Rent />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/categories" element={<CategoriesList />} />
          <Route path="/category/:slug" element={<CategoryView />} />
          <Route path="/search" element={<Search />} />
          <Route path="/searchnew" element={<SearchNew />} />
          <Route path="/product/:slug" element={<ProductView />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/auth/account-activate/:token"
            element={<AccountActivate />}
          />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/auth/access-account/:token"
            element={<AccessAccount />}
          />

          <Route path="/dashboard" element={<PrivateRoute />}>
            <Route path="user" element={<Dashboard />} />
            <Route path="user/profile" element={<UserProfile />} />
            <Route path="user/changePassword" element={<ChangePassword />} />
            <Route path="user/orders" element={<UserOrders />} />
            <Route path="user/product" element={<UserProduct />} />
            <Route path="user/mystore" element={<MyUserStore />} />
            <Route path="user/tour/:slug" element={<TourEdit />} />
            <Route path="user/wishlist" element={<Wishlist />} />
            <Route path="user/enquiries" element={<Enquiries />} />

            {/* /dashboard/secret */}
            {/* <Route path="secret" element={<Secret />} /> */}
          </Route>
          <Route path="/dashboard" element={<AdminRoute />}>
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="admin/category" element={<AdminCategory />} />
            <Route path="admin/product" element={<AdminProduct />} />
            <Route path="admin/products" element={<AdminProducts />} />
            <Route path="admin/mystore" element={<MyAdminStore />} />
            <Route
              path="admin/product/update/:slug"
              element={<AdminProductUpdate />}
            />
            <Route path="admin/orders" element={<AdminOrders />} />
          </Route>
          <Route path="*" element={<PageNotFound />} replace />
        </Routes>
      </div>

      <div id="footer">
        <Footer />
      </div>
    </BrowserRouter>
  );
}

//////////////////////////////////////////////////////////////////////////////
