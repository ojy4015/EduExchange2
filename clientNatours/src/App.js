import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import Menu from './components/nav/Menu';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/user/Dashboard';
import AdminDashboard from './pages/admin/Dashboard.js';
import AdminCategory from './pages/admin/Category.js';
import AdminProduct from './pages/admin/Product.js';
import AdminProducts from './pages/admin/Products.js';
import AdminProductUpdate from './pages/admin/ProductUpdate.js'
import UserProfile from './pages/user/Profile.js';
import ChangePassword from './pages/user/ChangePassword.js';
import UserOrders from './pages/user/Orders.js';
import PrivateRoute from './components/routes/PrivateRoute';
import AdminRoute from './components/routes/AdminRoute';
import PageNotFound from './pages/user/PageNotFound';
import { Button, Layout } from 'antd';
import { Content, Header } from 'antd/es/layout/layout';
import Sider from 'antd/es/layout/Sider';
import './styles/dashboard.css';
import Shop from './pages/Shop';
import Search from './pages/Search';
import Cart from './pages/Cart';
import ProductView from './pages/ProductView';
import CategoriesList from './pages/CategoriesList';
import CategoryView from './pages/CategoryView';
import AdminOrders from './pages/admin/Orders';

export default function App() {
    return (

        <BrowserRouter>
            <Menu />
            <Toaster position="top-right" />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/categories" element={<CategoriesList />} />
                <Route path="/category/:slug" element={<CategoryView />} />
                <Route path="/search" element={<Search />} />
                <Route path="/product/:slug" element={<ProductView />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<PrivateRoute />} >
                    <Route path="user" element={<Dashboard />} />
                    <Route path="user/profile" element={<UserProfile />} />
                    <Route path="user/changePassword" element={<ChangePassword />} />
                    <Route path="user/orders" element={<UserOrders />} />

                    {/* /dashboard/secret */}
                    {/* <Route path="secret" element={<Secret />} /> */}
                </Route>
                <Route path="/dashboard" element={<AdminRoute />} >
                    <Route path="admin" element={<AdminDashboard />} />
                    <Route path="admin/category" element={<AdminCategory />} />
                    <Route path="admin/product" element={<AdminProduct />} />
                    <Route path="admin/products" element={<AdminProducts />} />
                    <Route path="admin/product/update/:slug" element={<AdminProductUpdate />} />
                    <Route path="admin/orders" element={<AdminOrders />} />
                </Route>
                <Route path="*" element={<PageNotFound />} replace />
            </Routes>
        </BrowserRouter>
    );
}

//////////////////////////////////////////////////////////////////////////////
// import {
//     BrowserRouter,
//     Routes,
//     Route,
// } from "react-router-dom";
// import { Toaster } from 'react-hot-toast';
// import Menu from './components/nav/Menu';
// import Home from './pages/Home';
// import Login from './pages/auth/Login';
// import Register from './pages/auth/Register';
// import Dashboard from './pages/user/Dashboard';
// import AdminDashboard from './pages/admin/Dashboard.js';
// import AdminCategory from './pages/admin/Category.js';
// import AdminProduct from './pages/admin/Product.js';
// import AdminProducts from './pages/admin/Products.js';
// import AdminProductUpdate from './pages/admin/ProductUpdate.js'
// import UserProfile from './pages/user/Profile.js';
// import ChangePassword from './pages/user/ChangePassword.js';
// import UserOrders from './pages/user/Orders.js';
// import PrivateRoute from './components/routes/PrivateRoute';
// import AdminRoute from './components/routes/AdminRoute';
// import PageNotFound from './pages/user/PageNotFound';
// import { Button, Layout } from 'antd';
// import { Content, Header } from 'antd/es/layout/layout';
// import Sider from 'antd/es/layout/Sider';
// import './styles/dashboard.css';
// import Shop from './pages/Shop';
// import Search from './pages/Search';
// import Cart from './pages/Cart';
// import ProductView from './pages/ProductView';
// import CategoriesList from './pages/CategoriesList';
// import CategoryView from './pages/CategoryView';
// import AdminOrders from './pages/admin/Orders';
// import DaumPost from './hooks/daumPost'
// import Test from './pages/Test';

// export default function App() {
//     return (

//         <BrowserRouter>
//             <Test />
//         </BrowserRouter>
//     );
// }






// import {
//     BrowserRouter,
//     Routes,
//     Route,
// } from "react-router-dom";
// import { Toaster } from 'react-hot-toast';
// import Menu from './components/nav/Menu';
// import Home from './pages/Home';
// import Login from './pages/auth/Login';
// import Register from './pages/auth/Register';
// import Dashboard from './pages/user/Dashboard';
// import AdminDashboard from './pages/admin/Dashboard.js';
// import AdminCategory from './pages/admin/Category.js';
// import AdminProduct from './pages/admin/Product.js';
// import AdminProducts from './pages/admin/Products.js';
// import AdminProductUpdate from './pages/admin/ProductUpdate.js'
// import UserProfile from './pages/user/Profile.js';
// import UserOrders from './pages/user/Orders.js';

// import PrivateRoute from './components/routes/PrivateRoute';
// import AdminRoute from './components/routes/AdminRoute';
// import PageNotFound from './pages/user/PageNotFound';
// import { Button, Layout } from 'antd';
// import { Content, Header } from 'antd/es/layout/layout';
// import Sider from 'antd/es/layout/Sider';
// import './styles/dashboard.css';
// import Shop from './pages/Shop';
// import Search from './pages/Search';
// import Cart from './pages/Cart';
// import ProductView from './pages/ProductView';
// import CategoriesList from './pages/CategoriesList';
// import CategoryView from './pages/CategoryView';
// import AdminOrders from './pages/admin/Orders';

// export default function App() {
//     return (

//         <BrowserRouter>
//             <Menu />
//             <Toaster position="top-right" />
//             <Routes>
//                 <Route path="/" element={<Home />} />
//                 <Route path="/shop" element={<Shop />} />
//                 <Route path="/cart" element={<Cart />} />
//                 <Route path="/categories" element={<CategoriesList />} />
//                 <Route path="/category/:slug" element={<CategoryView />} />
//                 <Route path="/search" element={<Search />} />
//                 <Route path="/product/:slug" element={<ProductView />} />
//                 <Route path="/login" element={<Login />} />
//                 <Route path="/register" element={<Register />} />
//                 <Route path="/dashboard" element={<PrivateRoute />} >
//                     <Route path="user" element={<Dashboard />} />               
//                 </Route>
//                 <Route path="/dashboard" element={<AdminRoute />} >                   
//                     <Route path="admin" element={<AdminDashboard />} />                   
//                 </Route>
//                 <Route path="*" element={<PageNotFound />} replace />
//             </Routes>
//         </BrowserRouter>
//     );
// }


