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
    // const [loading, setLoading] = useState(false);

    // review for one product per one user
    const [review, setReview] = useState("");
    // rating for one product per one user
    const [rating, setRating] = useState("");

    // review for one product of all users
    const [reviews, setReviews] = useState([]);

    // to make review input and rating input disable afrer once input has done
    const [disable, setDisable] = useState(false);

    // hooks
    const params = useParams();


    // useEffect(() => {
    //     if (auth?.token) loadReviews();
    // }, [auth?.token]);



    // const stock = product?.maxGroupSize - product?.sold;

    useEffect(() => {
        if (params?.slug) loadProduct();
    }, [params?.slug])


    const loadProduct = async (req, res) => {
        try {
            //console.log(params.slug);
            const { data } = await axios.get(`/tours/slug/${params.slug}`);
            setProduct(data);
            // console.log(data);
            loadRelated(data._id, data.category._id);
            // loadReviews();
            //console.log(data);
        } catch (err) {
            console.log(err);
        }
    };


    const loadRelated = async (tourId, categoryId) => {
        try {
            const { data } = await axios.get(`/tours/related-tours/${tourId}/${categoryId}`);
            setRelated(data);
            loadReviews(tourId);
        } catch (err) {
            console.log(err);
        }
    };

    // load all the reviews fro one product by all users
    // const loadReviews = async (ProductId) => {
    //     try {
    //         //console.log(params.slug);
    //         const { data } = await axios.get(`/reviews/${ProductId}`);
    //         console.log("reviews : ", data);
    //         setReviews(data);
    //         //console.log(data);
    //         // loadRelated(data._id, data.category._id);
    //         //console.log(data);
    //     } catch (err) {
    //         console.log(err);
    //     }
    // };

    // load all the reviews fro one product by all users
    const loadReviews = async (ProductId) => {
        try {
            //console.log(params.slug);
            const { data } = await axios.get(`/tours/${ProductId}`);
            console.log("tour : ", data);
            setReviews(data.reviews);
            //console.log(data);
            // loadRelated(data._id, data.category._id);
            //console.log(data);
        } catch (err) {
            console.log(err);
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        try {
            //   setLoading(true);
            const { data } = await axios.post(
                `/reviews/${product._id}`,
                { review, rating }
            );
            console.log(data);
            if (data?.error) {
                toast.error(data.error);
                // setLoading(false);
            } else {

                toast.success('your review is saved');

                // diable input field of review and rating for no more input
                setDisable(true);

                // setLoading(false);
                // navigate("/dashboard");
            }

        } catch (err) {
            console.log(err);
            toast.error('You wrote review for this item already. Review can be written only once!');
            //   setLoading(false);
        }

    };

    return (
        <div className="container-flluid">
            <div className="row">
                <div className="col-md-9">
                    <div className='card mb-3'>

                        <Badge.Ribbon text={`${product?.sold} sold`} color="red">

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

                            <p>
                                {product?.quantity > 0 ? <FaCheck /> : <FaTimes />}{" "}
                                {product?.quantity > 0 ? "In Stock" : "Out of Stock"}
                            </p>

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

                    <div className="p-3 mt-2 mb-2 h4 bg-light"> Reviews</div>
                    <p>댓글 수 : {reviews.length}</p>
                    {/* <pre>{JSON.stringify({reviews}, null, 4)}</pre> */}
                    <div className="border shadow bg-light rounded-4 mb-5">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">When</th>
                                    <th scope="col">Buyer</th>
                                    <th scope="col">Review</th>
                                    <th scope="col">Rating(1-5)</th>
                                </tr>
                            </thead>

                            <tbody>
                                {reviews?.map((r, index) => (
                                    <tr key={r._id}>
                                        <td>{index + 1}</td>
                                        <td>{moment(r?.createdAt).format('YYYY MM DD HH:mm:ss')}</td>
                                        <td>{r?.user?.name}</td>
                                        <td>{r?.review}</td>
                                        <td>{r?.rating}</td>
                                    </tr>

                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-3 mt-2 mb-2 h4 bg-light">Write Review</div>
                    <div>
                        <form onSubmit={handleSubmitReview}>

                            <textarea
                                className="form-control m-2 p-2"
                                placeholder="Enter your review"
                                autoFocus
                                value={review}
                                onChange={(e) => setReview(e.target.value)}
                                disabled={disable}
                            />

                            <input
                                type="number"
                                className="form-control mb-4 p-2"
                                placeholder="Enter your rating"
                                required
                                autoFocus
                                value={rating}
                                onChange={(e) => setRating(e.target.value)}
                                disabled={disable}
                            />

                            <button className="btn btn-primary" type="submit">
                                Register
                            </button>
                        </form>
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
