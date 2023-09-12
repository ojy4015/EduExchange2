// grap the email

import { useState } from "react";
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate, Link } from "react-router-dom";

export default function ForgotPassword() {
  // state
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // hook
  //const [auth, setAuth] = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post(`/users/forgotPassword`, { email});
      //console.log(data);

      if (data?.error) {
        toast.error(data.error);
        setLoading(false);
      } else {
        toast.success("Please check your email for password reset link");
        setLoading(false);
        navigate("/dashboard");
      }


    } catch (err) {
      console.log(err);
      toast.error('Something wrong. Try again.');
      setLoading(false);
    }

  };

  return (
    <div>
      <h1 className="display-1 bg-primary text-light p-5">Forgot Password</h1>
      <div className="container mt-5">
        <div className="row">
          <div className="col-lg-4 offset-lg-4">
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                className="form-control mb-4 p-2"
                placeholder="Enter your email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button disabled={loading} className="btn btn-primary col-12 mb-4" type="submit">
                {loading ? "Waiting..." : "Submit"}
              </button>
            </form>

            <Link className="text-danger" to="/login">Back to login</Link>

          </div>
        </div>
      </div>
    </div>
  );
}