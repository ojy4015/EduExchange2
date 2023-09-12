import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/auth';
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom"
import Search from '../forms/Search';
import useCategory from '../../hooks/useCategory';
import { useCart } from '../../context/cart';
import { Badge } from 'antd';

export default function Menu() {
  // context
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useCart([]);

  //hooks
  const navigate = useNavigate();
  const categories = useCategory();

  //console.log('categories in menu : ', categories);

  // hooks

  const logout = () => {
    // setAuth({ ...auth, user: null, token: "", refreshToken: "" });
    setAuth({ ...auth, user: null, token: "" });
    localStorage.removeItem("auth");
    toast.success("Logout successful");
    navigate("/login");
  }

  // const loggedIn = auth.user !== null && auth.token !== "" && auth.refreshToken !== "";
  const loggedIn = auth.user !== null && auth.token !== "";

  return (
    <>
      <ul className="nav d-flex justify-content-between shadow-sm mb-2 sticky-top bg-light">
        <li className="nav-item">
          <NavLink className="nav-link" aria-current="page" to="/">HOME</NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" aria-current="page" to="/shop">SHOP</NavLink>
        </li>

        <div className="dropdown">
          <li>
            <a
              className="nav-link pointer dropdown-toggle"
              data-bs-toggle="dropdown">
              CATEGORIES
            </a>

            <ul
              className="dropdown-menu"
              style={{ height: '300px', overflow: "scroll" }}
            >
              <li>
                <NavLink
                  className="nav-link"
                  to={"/categories"}
                >
                  All CATEGORIES
                </NavLink>
              </li>
              {categories?.map((c) => (
                <li key={c._id}>
                  <NavLink
                    className="nav-link"
                    to={`/category/${c.slug}`}
                  >
                    {c.name?.toUpperCase()}
                  </NavLink>
                </li>
              ))}
            </ul>

          </li>
        </div>

        <Search />

        <li className="nav-item mt-1">
          <Badge count={cart?.length >= 1 ? cart.length : 0}
            offset={[-5, 11]}
            showZero={true}
          >
            <NavLink className="nav-link" aria-current="page" to="/cart">
              CART
            </NavLink>

          </Badge>
        </li>

        { !loggedIn ? (
          <>
          <li className="nav-item">
            <NavLink className="nav-link" to="/login">LOGIN</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/register">REGISTER</NavLink>
            </li>
          </>
        ) : ("")}

        { loggedIn ? (
          <div className="dropdown">
            <li>
              <a
                className="nav-link pointer dropdown-toggle"
                data-bs-toggle="dropdown">
                {auth?.user?.name ? auth.user.name.toUpperCase() : `${auth?.user?.role[0] === 'admin' ? "ADMIN" : "USER"}`}
              </a>

              <ul className="dropdown-menu">
                <li>
                  <NavLink
                    className="nav-link"
                    to={`/dashboard/${auth?.user?.role[0] === 'admin' ? "admin" : "user"}`}           
                  >
                    Dashboard
                  </NavLink>
                </li>
                <li className="nav-item pointer">
                  <a onClick={logout} className="nav-link">Logout</a>
                </li>
              </ul>
            </li>
          </div>
        ) : ("")}

      </ul>
    </>
  );
}

