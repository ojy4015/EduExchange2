import { useState } from "react";
import Jumbotron from '../../components/cards/Jumbotron';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/auth';
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Modal } from 'antd';

export default function Login() {
  // state
  const [email, setEmail] = useState("admin@natours.io");
  const [password, setPassword] = useState("test1234");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

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

      //console.log(data);

      // something worong
      if (data?.error) {
        console.log(data.error);
      } else {
        localStorage.setItem("auth", JSON.stringify(data));
        setAuth({ ...auth, token: data.token, user: data.user });


        toast.success("Login successful");
        navigate(location.state || `/dashboard/${data?.user?.role === 'admin' ? "admin" : "user"}`);
        //navigate(location.state || "/dashboard");

      }
    } catch (err) {
      console.log(err);
      toast.error('Login failed. Try again.');
    }

  };

  // find password with email knowledge
  const handleFindPasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      //console.log("email in handlePasswor : ", email);
      const { data } = await axios.post(`/users/forgotPassword`,
        { email }
      );

      console.log(data);

      // something worong
      if (data?.error) {
        console.log(data.error);
      } else {


      }
    } catch (err) {
      console.log(err);
      toast.error('Reset Password failed. Try again.');
    }

  };

  // find password with email knowledge
  const handleSetNewPasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(" in handlePasswor : ", password, passwordConfirm);

      const token = '411d03d7c2741dc846ec50b749f5dc6174bdf702124ee9e417b7a1df687af1ec';

      const { data } = await axios.patch(`/users/resetPassword/${token}`,
        { password, passwordConfirm }
      );

      console.log(data);

      // something worong
      if (data?.error) {
        console.log(data.error);
      } else {
        toast.success("Set new password!");

      }
    } catch (err) {
      console.log(err);
      toast.error('Reset new Password failed. Try again.');
    }

  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };


  return (
    <div>
      <Jumbotron title="Login" />
      <pre>{JSON.stringify(auth, null, 4)}</pre>
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
                Submit
              </button>
            </form>
            {/* <br/>

            <form onSubmit={handlefindPasswordSubmit}>
              <button className="btn btn-success" type="submit">
                find password
              </button>
            </form> */}
            {/* <div className='search_user_info_div'>
              <div> <b style={{ 'marginLeft': '15px' }}> 아이디 찾기 </b> </div>
              <div> <b> 비밀번호 찾기 </b> </div>
            </div> */}
            <hr />
            <button className="btn btn-outline-primary m-3"
              onClick={() => {
                setIsModalOpen(true);
              }}
            >
              find password
            </button>

            <Modal title="find password" open={isModalOpen} footer={null}>

              <form>
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

                <input
                  type="password"
                  className="form-control mb-4 p-2"
                  placeholder="Enter your password again"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                />

                <div className="d-flex justify-content-between">
                  <button onClick={handleFindPasswordSubmit} className="btn btn-primary mt-3" type="submit" >
                    Send Email
                  </button>
                  <button onClick={handleSetNewPasswordSubmit} className="btn btn-primary mt-3" type="submit" >
                    Set New Password
                  </button>
                  <button onClick={handleCancel} className="btn btn-success mt-3">Cancel</button>
                </div>

              </form>
            </Modal>

          </div>
        </div>
      </div>

    </div>
  );
}



/////////////////////////////////////////////////////////////
// const handlefindPasswordSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const { data } = await axios.post(`/ users / forgotPassword`,
  //       { email }
  //     );
  //     //console.log(data);
  //     if (data?.error) {
  //       toast.error(data.error);
  //     } else {
  //       // localStorage.setItem("auth", JSON.stringify(data));
  //       // setAuth({...auth, user: data.user, token: data.token});
  //       toast.success("Login successful");
  //       // navigate(location.state || `/ dashboard / ${ data?.user?.role === 1 ? "admin" : "user" } `);
  //     }
  //   } catch (err) {
  //     console.log(err);
  //     toast.error('Login failed. Try again.');
  //   }

  // };