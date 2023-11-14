////////////////////////////////////////////////////////////////
import { Badge, Card, Space } from "antd";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/cart";
import moment from "moment";
import toast from 'react-hot-toast';


import ProductFeatures from "./ProductFeatures";

export default function ProductCard({ p }) {

  // context
  const [cart, setCart] = useCart();
  // hooks
  const navigate = useNavigate();

  return (
    <div className="col-lg-12 p-4 gx-4 gy-4">
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Badge.Ribbon text={`${p?.sold} sold`} placement="start" color="red">
          <Badge.Ribbon
            text={`${p?.quantity >= 1
              ? `${p?.quantity - p?.sold} in stock`
              : "Out of stock"
              }`}
            placement="end"
            color="green"
          >
            <img
              src={p?.photos?.[0].Location}
              alt={`${p?.type}-${p?.address}-${p?.action}-${p?.price}`}
              style={{ height: "200px", objectFit: "cover" }}
            />
          </Badge.Ribbon>
        </Badge.Ribbon>
        <Badge.Ribbon text={`${p?.type} for ${p?.action}`} color={`${p?.action === "Sell" ? "blue" : "red"}`}>


          <div className="card-body">
            <div className="card hoverable shadow"></div>
            <h5>{p?.name}</h5>

            <h4 className="fw-bold">
            cost: {p?.price?.toLocaleString("ko", {
                style: "currency",
                currency: "KRW",
              })}
            </h4>
            <p className="card-text">address: {p?.address}</p>

            <p className="card-text">{p?.description?.substring(0, 60)}...</p>
            {/* <p>{p.ratingsAverage} ratingsAverage</p> */}
            <p className="text-muted">cretaed At: {moment(p.createdAt).format('YYYY MM DD HH:mm')}</p>
            <p>{p.sold} sold</p>


            <ProductFeatures  p={p} />
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
        </Badge.Ribbon>

      </Space>
    </div>
  );
}


////////////////////////////////////////////////////////////////////////////


