// import { Badge } from 'antd';
// import { useNavigate } from 'react-router-dom';
// import { useCart } from '../../context/cart';
// import toast from 'react-hot-toast';
// import moment from 'moment';

// export default function ProductCard({ product }) {
//     //console.log("product : ", product);
//     //context
//     const [cart, setCart] = useCart([]);

//     //hooks
//     const navigate = useNavigate();

//     // const stock = product?.quantity - product?.sold;
//     // const stock = product?.quantity;

//     // const addIntoCart = (p) => {
//     //     setCart([...cart, p]);
//     //     localStorage.setItem("cart", JSON.stringify([...cart, p]));
//     //     toast.success("Added to cart");
//     // };

//     return (
//         <div className='card mb-3 hoverable'>

//             {/* <Badge.Ribbon text={`${product?.sold} sold`} color="red">
//                 <Badge.Ribbon text={`${stock >= 1 ? `${stock} In stock` : "Out of Stock"}`} placement="start" color="green"> */}
//             <img className="card-img-top"
//                 src={`${process.env.REACT_APP_API}/tours/photo/${product._id}`}
//                 alt={product.name}
//                 style={{ height: "300px", objectFit: "cover" }}
//             />
//             <div className="card-body">
//                 <h5>{product?.name}</h5>
//                 <p className="card-text">{product?.description.substring(0, 60)}...</p>
//                 <p>{moment(product.createdAt).fromNow()}</p>
//                 <p>{product.ratingsAverage} ratingsAverage</p>
//             </div>
//             <div className="d-flex justify-content-between">
//                 <button
//                     className="btn btn-primary col card-button"
//                     style={{ borderBottomLeftRadius: "5px" }}
//                     onClick={() => {
//                         navigate(`/product/${product.slug}`)
//                     }}
//                 >
//                     View Product
//                 </button>
//                 <button className="btn btn-outline-primary col card-button"
//                     style={{ borderBottomRightRadius: "5px" }}
//                     // onClick={() => {
//                     //     setCart([...cart, product]);
//                     //     toast.success("Added to cart");
//                     // }}
//                     onClick={() => addIntoCart(product)}
//                 >
//                     Add to Cart
//                 </button>
//             </div>
//         </div>
//     );
// }




// {/* </Badge.Ribbon>
//             </Badge.Ribbon> */}

// {/* <div className="card-body">
//                 <h5>{product?.name}</h5>
//                 <h4 className="fw-bold">
//                     {product.price?.toLocaleString("ko", {
//                         style: "currency",
//                         currency: "KRW",
//                     })}
//                 </h4>
//                 <p className="card-text">{product?.description.substring(0, 60)}...</p>
//             </div>
//             {/* <p>{moment(product.createdAt).fromNow()}</p>
//             <p>{product.sold} sold</p>
//             <div className="d-flex justify-content-between">
//                 <button
//                     className="btn btn-primary col card-button"
//                     style={{ borderBottomLeftRadius: "5px" }}
//                     onClick={() => {
//                         navigate(`/product/${product.slug}`)
//                     }}
//                 >
//                     View Product
//                 </button>
//                 <button className="btn btn-outline-primary col card-button"
//                     style={{ borderBottomRightRadius: "5px" }}
//                     // onClick={() => {
//                     //     setCart([...cart, product]);
//                     //     toast.success("Added to cart");
//                     // }}
//                     onClick={() => addIntoCart(product)}
//                 >
//                     Add to Cart
//                 </button>
//             </div> */
//     {/* </div>
//     ); */}
// }

///////////////////////////////////////////////////

// import { Badge } from "antd";
// import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";
// import { useCart } from "../../context/cart";
// import moment from "moment";

// export default function ProductCard({ p }) {
//   //console.log('p.createdAt: ', p.createdAt);
//   // context
//   const [cart, setCart] = useCart();
//   // hooks
//   const navigate = useNavigate();

//   return (
//     <div className="card mb-3 hoverable">
//       <Badge.Ribbon text={`${p?.sold} sold`} color="red">
//         <Badge.Ribbon
//           text={`${p?.ratingsAverage} ratingsAverage`}
//           placement="start"
//           color="green"
//         >
//           <img
//             className="card-img-top"
//             src={`${process.env.REACT_APP_API}/tours/photo/${p._id}`}
//             alt={p.name}
//             style={{ height: "300px", objectFit: "cover" }}
//           />
//         </Badge.Ribbon>
//       </Badge.Ribbon>

//       <div className="card-body">
//         <h5>{p?.name}</h5>

//         <h4 className="fw-bold">
//           {p?.price?.toLocaleString("ko", {
//             style: "currency",
//             currency: "KRW",
//           })}
//         </h4>

//         <p className="card-text">{p?.description?.substring(0, 60)}...</p>
//         {/* <p>{p.ratingsAverage} ratingsAverage</p> */}
//         <p>{moment(p.createdAt).format('YYYY MM DD HH:mm:ss')}</p>
//         <p>{p.sold} sold</p>
//       </div>

//       <div className="d-flex justify-content-between">
//         <button
//           className="btn btn-primary col card-button"
//           style={{ borderBottomLeftRadius: "5px" }}
//         //onClick={() => navigate(`/product/${p.slug}`)}
//         >
//           View Product
//         </button>

//         <button
//           className="btn btn-outline-primary col card-button"
//           style={{ borderBottomRightRadius: "5px" }}
//         //   onClick={() => {
//         //     setCart([...cart, p]);
//         //     localStorage.setItem("cart", JSON.stringify([...cart, p]));
//         //     toast.success("Added to cart");
//         //   }}
//         >
//           Add to Cart
//         </button>
//       </div>


//     </div>
//   );
// }


////////////////////////////////////////////////////////////////

import { Badge } from "antd";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/cart";
import moment from "moment";
import toast from 'react-hot-toast';

export default function ProductCard({ p }) {

  // context
  const [cart, setCart] = useCart();
  // hooks
  const navigate = useNavigate();

  return (
    <div className="card mb-3 hoverable">
      <Badge.Ribbon text={`${p?.sold} sold`} color="red">
        <Badge.Ribbon
          text={`${p?.ratingsAverage} ratingsAverage`}
          placement="start"
          color="green"
        >
          <img
            className="card-img-top"
            src={`${process.env.REACT_APP_API}/tours/photo/${p._id}`}
            alt={p.name}
            style={{ height: "300px", objectFit: "cover" }}
          />
        </Badge.Ribbon>
      </Badge.Ribbon>

      <div className="card-body">
        <h5>{p?.name}</h5>

        <h4 className="fw-bold">
          {p?.price?.toLocaleString("ko", {
            style: "currency",
            currency: "KRW",
          })}
        </h4>

        <p className="card-text">{p?.description?.substring(0, 60)}...</p>
        {/* <p>{p.ratingsAverage} ratingsAverage</p> */}
        <p>{moment(p.createdAt).format('YYYY MM DD HH:mm')}</p>
        <p>{p.sold} sold</p>
      </div>

      <div className="d-flex justify-content-between">
        <button
          className="btn btn-primary col card-button"
          style={{ borderBottomLeftRadius: "5px" }}
          onClick={() => navigate(`/product/${p.slug}`)}
        >
          View Product
        </button>

        <button
          className="btn btn-outline-primary col card-button"
          style={{ borderBottomRightRadius: "5px" }}
          onClick={() => {
            setCart([...cart, p]);
            localStorage.setItem("cart", JSON.stringify([...cart, p]));
            toast.success("Added to cart");
          }}
        >
          Add to Cart
        </button>
      </div>


    </div>
  );
}


////////////////////////////////////////////////////////////////////////////


