import { useState } from "react";
import Jumbotron from '../../components/cards/Jumbotron';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/auth';
import { useNavigate } from "react-router-dom";

export default function Register() {
  // state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [photo, setPhoto] = useState("");
  const [role, setRole] = useState("");

   // hook
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const {data} = await axios.post(
        `/users/signup`,
        { name, email, password, passwordConfirm, photo, role}
      );
      console.log(data);
      if(data?.error){
        toast.error(data.error);
      } else {
        localStorage.setItem("auth", JSON.stringify(data));
        setAuth({...auth, token: data.token, user: data.user});
        toast.success('Registrarion successful');
        navigate("/dashboard");
      }
      
    } catch (err) {
      console.log(err);
      toast.error('Registeration failed. Try again.');
    }
   
  };



  return (
    <div>
      <Jumbotron title="Register" />      
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-6 offset-md-3">
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                className="form-control mb-4 p-2"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
               <input
                type="email"
                className="form-control mb-4 p-2"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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

              <input
                type="text"
                className="form-control mb-4 p-2"
                placeholder="Enter your photo"
                value={photo}
                onChange={(e) => setPhoto(e.target.value)}
              />

              <input
                type="text"
                className="form-control mb-4 p-2"
                placeholder="Enter your role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
              <button className="btn btn-primary" type="submit">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

//////////////////////////////////////////////////////////////////////////////
// export default function Register() {
//   // state
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [passwordConfirm, setPasswordConfirm] = useState("");
//   const [photo, setPhoto] = useState("");
//   const [role, setRole] = useState("user");

//    // hook
//   const [auth, setAuth] = useAuth();
//   const navigate = useNavigate();
  
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const { data } = await axios.post(
//         `/users/signup`,
//         { name, email, password, passwordConfirm, photo, role}
//       );
//       if (data?.data?.error) {
//          toast.error(data.data.error);
//       } else {
//         //console.log(data);
//         localStorage.setItem("auth", JSON.stringify(data));
       
//         // setAuth({...auth, token: data.token, user: data.data.user});
//         setAuth({...auth, token: data.token, user: data.user});
        
//         toast.success("Registration successful");
//         // navigate("/dashboard/user");
//         navigate("/");
        
//       }
//     } catch (error) {
//       // console.log("err: ", err);
//       toast.error('Registeration failed. Try again.');
//       // toast.error(data.error.errmsg);
//       // console.log(error);
//       // let message = "Unknown Error";
//       // if (error instanceof Error) message = error.message;
//       // toast.error(message);
//     }
   
//   };
