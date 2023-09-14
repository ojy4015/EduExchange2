import { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { useParams } from 'react-router-dom';
import { Badge } from 'antd';
import { FaDollarSign, FaProjectDiagram, FaRegClock, FaCheck, FaTimes, FaTruckMoving, FaWarehouse, FaRocket } from "react-icons/fa";
import ProductCard from '../components/cards/ProductCard';
import { useCart } from '../context/cart';
import toast from 'react-hot-toast';


export default function ProductView() {
    //context
    const [cart, setCart] = useCart();
    // state
    const [product, setProduct] = useState({});
    const [related, setRelated] = useState([]);
    // hooks
    const params = useParams();

    // const stock = product?.maxGroupSize - product?.sold;

    useEffect(() => {
        if (params?.slug) loadProduct();
    }, [params?.slug])


    const loadProduct = async (req, res) => {
        try {
            //console.log(params.slug);
            const { data } = await axios.get(`/tours/${params.slug}`);
            setProduct(data);
            //console.log(data);
            loadRelated(data._id, data.category._id);
            //console.log(data);
        } catch (err) {
            console.log(err);
        }
    };

    const loadRelated = async (tourId, categoryId) => {
        try {
            const { data } = await axios.get(`/tours/related-tours/${tourId}/${categoryId}`);
            setRelated(data);
        } catch (err) {
            console.log(err);
        }
    };
    return (
        <div className="container-flluid">
            <div className="row">
                <div className="col-md-9">
                    <div className='card mb-3'>

                        <Badge.Ribbon text={`${product?.sold} sold`} color="red">
                            {/* <Badge.Ribbon
                                text={
                                    `${stock >= 1 ? `${stock} In stock` : "Out of Stock"}`}
                                placement="start" color="green"
                            > */}
                            <Badge.Ribbon
                                text={`${product?.quantity >= 1
                                ? `${product?.quantity - product?.sold} in stock`
                                : "Out of stock"
                                }`}
                                placement="start"
                                color="green"
                            >
                                <img
                                    className="card-img-top"
                                    src={`${process.env.REACT_APP_API}/tours/photo/${product._id}`}
                                    alt={product.name}
                                    style={{ height: "500px", width: "100%", objectFit: "cover" }}
                                />
                            </Badge.Ribbon>
                        </Badge.Ribbon>

                        <div className="card-body">
                            <h1 className="fw-bold">{product?.name}</h1>

                            <p className="card-text lead">{product?.description}</p>
                        </div>

                        <div className="d-flex-column justify-content-between lead p-5 bg-light fw-bold">
                            <p>
                                <FaDollarSign /> Price: {product.price?.toLocaleString("ko", {
                                    style: "currency",
                                    currency: "KRW",
                                })}
                            </p>
                            <p>
                                <FaProjectDiagram /> Category: {product?.category?.name}
                            </p>
                            <p>
                                <FaRegClock /> Added: {moment(product.createdAt).format('YYYY MM DD HH:mm:ss')}
                            </p>
                            {/* <p>
                                {stock > 1 ? <FaCheck /> : <FaTimes />}{" "}
                                {stock > 1 ? "In Stock" : "Out of Stock"}
                            </p> */}
                            <p>
                                {product?.quantity > 0 ? <FaCheck /> : <FaTimes />}{" "}
                                {product?.quantity > 0 ? "In Stock" : "Out of Stock"}
                            </p>
                            {/* <p>
                                <FaWarehouse /> Available {stock > 0 ? stock : 0}
                            </p> */}
                            <p>
                                <FaWarehouse /> Available {product?.quantity - product?.sold}
                            </p>
                            <p>
                                <FaRocket /> Sold {product.sold}
                            </p>
                        </div>


                        <button
                            className="btn btn-outline-primary col card-button"
                            style={{ borderBottomRightRadius: "5px" }}
                            onClick={() => {
                                setCart([...cart, product]);
                                toast.success("Added to cart");
                            }}
                        >
                            Add to Cart
                        </button>

                    </div>
                </div>
                <div className="col-md-3">
                    <h2>Related Tours</h2>
                    <hr />

                    {related?.length < 1 && <p>Nothig Found</p>}
                    {related?.map((p) => (
                        <ProductCard p={p} key={p._id} />
                    ))}

                </div>
            </div>
        </div>
    );
}


////////////////////////////////////////////////////////////////////////////////////////////////

{/* <pre>{JSON.stringify(related, null, 4)}</pre> */ }
{/* {
                        (related?.length < 1)
                            ? <p>Nothig Found</p>
                            : `${related?.map((p) => (
                                <ProductCard product={p} key={p._id} />
                            ))}`
                    } */}