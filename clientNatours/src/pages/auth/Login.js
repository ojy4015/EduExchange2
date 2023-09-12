import { useState } from "react";
import Jumbotron from '../../components/cards/Jumbotron';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/auth';
import { useNavigate, useLocation, Link } from "react-router-dom";

export default function Login() {
  // state
  const [email, setEmail] = useState("ojy401@kakao.com");
  const [password, setPassword] = useState("test1234");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  // hook
  const [auth, setAuth] = useAuth({});
  const navigate = useNavigate();
  const location = useLocation();

  //console.log("location => ", location);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`/users/login`,
        { email, password }
      );

      // something worong
      if (data?.error) {
        console.log(data.error);
      } else {
        localStorage.setItem("auth", JSON.stringify(data));
        // setAuth({ ...auth, token: data.token, refreshToken: data.refreshToken, user: data.user });
        setAuth({ ...auth, token: data.token, user: data.user });

        toast.success("Login successful");
        navigate(location.state || `/dashboard/${data?.user?.role[0] === 'admin' ? "admin" : "user"}`);

      }
    } catch (err) {
      console.log(err);
      toast.error('Login failed. Try again.');
    }

  };


  return (
    <div>
      <Jumbotron title="Login" />
      {/* <pre>{JSON.stringify(auth, null, 4)}</pre> */}
      {/* <div>Test code for Git hub here</div> */}
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-6 offset-md-3">
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                className="form-control mb-4 p-2"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
              />

              <input
                type="password"
                className="form-control mb-4 p-2"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />


              <button className="btn btn-primary" type="submit">
                Login
              </button>
            </form>

            <hr />
            <Link className="text-danger" to="/auth/forgot-password">Forgot password</Link>
          </div>
        </div>
      </div>

    </div>
  );
}
