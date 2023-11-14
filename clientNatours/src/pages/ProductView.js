import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { useParams } from "react-router-dom";
import { Badge } from "antd";
import {
  FaDollarSign,
  FaProjectDiagram,
  FaRegClock,
  FaCheck,
  FaTimes,
  FaTruckMoving,
  FaWarehouse,
  FaRocket,
} from "react-icons/fa";
import ProductCard from "../components/cards/ProductCard";
import { useCart } from "../context/cart";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Gallery from "react-photo-gallery";
import Carousel, { Modal, ModalGateway } from "react-images";
import ImageGallery from "../components/misc/imageGallery";
import Logo from "../logo.svg";
import ProductFeatures from "../components/cards/ProductFeatures";
import LikeUnlike from "../components/misc/LikeUnlike";
import MapCard from "../components/cards/MapCard";
import HTMLRenderer from "react-html-renderer";
import ContactSeller from "../components/forms/ContactSeller";

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

  const [ratingsAverage, setRatingsAverage] = useState("");
  const [ratingsQuantity, setRatingsQuantity] = useState("");

  // react-image
  const [current, setCurrent] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  // to make review input and rating input disable afrer once input has done
  // const [disable, setDisable] = useState(false);

  // hooks
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (params?.slug) loadProduct();
  }, [params?.slug]);

  const loadProduct = async (req, res) => {
    try {
      const { data } = await axios.get(`/tours/slug/${params.slug}`);
      setProduct(data);
      console.log(data);
      console.log("categoryIn", data.categoryIn);
      loadRelated(data._id, data.categoryIn);
      // loadReviews();
    } catch (err) {
      console.log(err);
    }
  };

  const loadRelated = async (tourId, categoryId) => {
    try {
      const { data } = await axios.get(
        `/tours/related-tours/${tourId}/${categoryId}`
      );
      setRelated(data);
      loadReviews(tourId);
    } catch (err) {
      console.log(err);
    }
  };

  // load all the reviews fro one product by all users
  const loadReviews = async (ProductId) => {
    try {
      //console.log(params.slug);
      const { data } = await axios.get(`/tours/${ProductId}`);
      console.log("tour in loadReview : ", data);
      setReviews(data.reviews);

      setRatingsAverage(data.ratingsAverage);
      setRatingsQuantity(data.ratingsQuantity);
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
      const { data } = await axios.post(`/reviews/${product._id}`, {
        review,
        rating,
      });
      //console.log(data);

      if (data?.error) {
        toast.error(data.error);
        // setLoading(false);
      } else {
        toast.success("your review is saved");
        // window.location.reload();
        loadProduct();

        setReview("");
        setRating("");

        // diable input field of review and rating for no more input
        // setDisable(true);

        // setLoading(false);
        // navigate("/dashboard");
      }
    } catch (err) {
      console.log(err);
      toast.error(
        "You wrote review for this item already or Rating should be between 1 and 5!"
      );
      //   setLoading(false);
    }
  };

  const handleDeleteMeSubmit = async (e) => {
    e.preventDefault();
    try {
      //   setLoading(true);
      const { data } = await axios.delete(`/reviews/${product._id}`);
      console.log(data);

      if (data?.error) {
        toast.error(data.error);
        // setLoading(false);
      } else {
        toast.success("your review is deleted");

        loadProduct();

        setReview("");
        setRating("");
        // window.location.reload();
        // diable input field of review and rating for no more input
        // setDisable(true);

        // setLoading(false);
        // navigate("/dashboard");
      }
    } catch (err) {
      console.log(err);
      toast.error("Something wrong. try again!");
      //   setLoading(false);
    }
  };

  const generatePhotsArray = (photos) => {
    if (photos?.length > 0) {
      const x = photos?.length === 1 ? 2 : 4;
      let arr = [];

      photos.map((p) =>
        arr.push({
          src: p.Location,
          width: x,
          height: x,
        })
      );
      return arr;
    } else {
      return [
        {
          src: Logo,
          width: 2,
          height: 1,
        },
      ];
    }
  };

  if (product?.location?.coordinates?.length) {
    return (
      <>
        <div className="container-flluid">
          <div className="row mt-2">
            <div className="col-md-4">
              <div className="d-flex justify-content-between">
                <button className="btn btn-primary disabled mt-2">
                  {product.type} for {product.action}
                </button>
                <LikeUnlike product={product} />
              </div>
              <div className="mt-4 mb-4">
                {product?.isSold ? "❌Off market" : "✅In market"}
                <h3>address: {product.address}</h3>
                <ProductFeatures p={product} />
                <h4 className="fw-bold">
                  cost:{" "}
                  {product?.price?.toLocaleString("ko", {
                    style: "currency",
                    currency: "KRW",
                  })}
                </h4>
                <p className="text-muted">
                  cretaed At:{" "}
                  {moment(product.createdAt).format("YYYY MM DD HH:mm")}
                </p>
              </div>
            </div>
            <div className="col-md-8">
              <ImageGallery photos={generatePhotsArray(product?.photos)} />
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-md-8 offset-md-2 mt-3">
              <MapCard product={product} />

              <br />

              <h1>
                {product?.type} in {product?.address} for {product?.action} $
                {product?.price}
              </h1>
              <ProductFeatures ad={product} />
              <hr />
              <h3 className="fw-bold mb-3">{product?.name}</h3>
              <HTMLRenderer
                html={product?.description?.replaceAll(".", "<br/><br/>")}
              />
            </div>
          </div>

          <div className="container">
            <ContactSeller p={product} />
          </div>

          <div className="container-fluid">
            <h4 className="text-center mb-3">Related Products</h4>
            <hr style={{ width: "33%" }} />
            <div className="row">
              {related?.map((product) => (
                <ProductCard key={product._id} p={product} />
              ))}
            </div>
          </div>
          {/* <pre>{JSON.stringify({ product, related }, null, 4)}</pre> */}
        </div>
      </>
    );
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////
