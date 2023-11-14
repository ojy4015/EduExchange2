import { useAuth } from "../../context/auth";
import { FcLike, FcLikePlaceholder } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function LikeUnlike({ product }) {
  // context
  const [auth, setAuth] = useAuth();

  // hooks
  const navigate = useNavigate();

  const handleLike = async () => {
    try {
      if (auth.user === null) {
        navigate("/login", {
          state: `/product/${product.slug}`,
        });
        return;
      }

      const { data } = await axios.post("/tours/wishlist", { productId: product._id });

      // context update
      setAuth({ ...auth, user: data });

      // localStorage update
      const fromLS = JSON.parse(localStorage.getItem("auth"));
      fromLS.user = data;
      localStorage.setItem("auth", JSON.stringify(fromLS));
      toast.success("Added to wishlist");
    } catch (err) {
      console.log(err);
    }
  }

  const handleUnlike = async () => {
    try {
      if (auth.user === null) {
        navigate("/login", {
          state: `/product/${product.slug}`,
        });
        return;
      }

      const { data } = await axios.delete(`/tours/wishlist/${product._id}`);


      // context update
      setAuth({ ...auth, user: data });

      // localStorage update
      const fromLS = JSON.parse(localStorage.getItem("auth"));
      fromLS.user = data;
      localStorage.setItem("auth", JSON.stringify(fromLS));
      toast.success("Removed from wishlist");
    } catch (err) {
      console.log(err);
    }
  }


  return (
    <>
      {auth.user?.wishlist?.includes(product?._id) ? (
        <span>
          <FcLike onClick={handleUnlike} className="h2 mt-3 pointer" />
        </span>
      ) : (
        <span>
          <FcLikePlaceholder onClick={handleLike} className="h2 mt-3 pointer" />
        </span>
      )}
      {/* <pre>{JSON.stringify({ auth }, null, 4)}</pre> */}
    </>
  );
}
