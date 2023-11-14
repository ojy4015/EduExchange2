
import { useAuth } from '../../context/auth';
import Jumbotron from '../../components/cards/Jumbotron';
import AdminMenu from '../../components/nav/AdminMenu';

import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
//import CategoryForm from '../../components/forms/Categoryform';
import { Select } from 'antd';
/*import product from '../../../../server/models/product';*/
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from 'react-bootstrap';

////////////////////for realist//////////////////////
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { GOOGLE_PLACES_KEY } from "../../config";

import ImageUpload from "../../components/forms/imageUpload";
import CurrencyInput from "react-currency-input-field";


const { Option } = Select;

function onChange(value) {
    console.log(`selected ${value}`);
}

function onBlur() {
    console.log('blur');
}

function onFocus() {
    console.log('focus');
}

function onSearch(val) {
    console.log('search:', val);
}

export default function AdminProductUpdate({ action, type }) {
    // context
  const [auth, setAuth] = useAuth();
  // state
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [ad, setAd] = useState({
    photos: [],
    uploading: false,
    price: "",
    address: "",
    bedrooms: "",
    bathrooms: "",
    carpark: "",
    landsize: "",
    name: "",
    description: "",
    loading: false,
    type: "House",
    action: "Sell",
    ////////// for natours only ////////////
    ratingsAverage: "",
    ratingsQuantity: "",
    quantity: "",
    sold: "",
  });

    // hook
    const navigate = useNavigate();
    const params = useParams();

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const { data } = await axios.get("/categorys");
            setCategories(data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        loadProduct();
    }, []);

    const loadProduct = async () => {
        try {
            // console.log("params => ", params);
            const { data } = await axios.get(`/tours/slug/${params.slug}`);
            console.log("data in loadProduct in ProductUpdate=> ", data);

            // category모델이 배열인경우
            //setCategory(data.category[0]._id);
            // category모델이 겍체인경우
            setCategory(data.category._id);

            // //console.log('data.category: ', data.category[0]._id);
            // setName(data.name);
            // setDuration(data.duration);
            // setMaxGroupSize(data.maxGroupSize);
            // setDescription(data.description);
            // setDifficulty(data.difficulty);
            // setRatingsAverage(data.ratingsAverage);
            // setRatingsQuantity(data.ratingsQuantity);
            // setPrice(data.price);
            // setPriceDiscount(data.priceDiscount);
            // setQuantity(data.quantity);
            // setSold(data.sold);
            // setSummary(data.summary);

            // setId(data._id);

        } catch (err) {
            console.log(err);
        }
    }

    // const handleUpdate = async (e) => {
    //     e.preventDefault();
    //     try {
    //         // const tourData = new FormData();
    //         // photo && tourData.append("photo", photo);
    //         // tourData.append("category", category);
    //         // tourData.append("name", name);
    //         // tourData.append("duration", duration);
    //         // tourData.append("maxGroupSize", maxGroupSize);
    //         // tourData.append("description", description);
    //         // tourData.append("difficulty", difficulty);
    //         // tourData.append("ratingsAverage", ratingsAverage);
    //         // tourData.append("ratingsQuantity", ratingsQuantity);
    //         // tourData.append("price", price);
    //         // tourData.append("priceDiscount", priceDiscount);
    //         // tourData.append("quantity", quantity);
    //         // tourData.append("sold", sold);
    //         // tourData.append("summary", summary);

    //         // // console.log([...tourData]);
    //         // const { data } = await axios.put(`/tours/${id}`, tourData);

    //         // if (data?.error) {
    //         //     toast.error(data.error);
    //         // } else {
    //         //     toast.success(`"${data.name}" is updated`);
    //         //     navigate("/dashboard/admin/products");
    //         //     // window reload
    //         //     window.location.reload();
    //         // }
    //     } catch (err) {
    //         console.log(err);
    //         toast.error("Tour create failed. Try again.");
    //     }
    // };

    // const handleDelete = async (req, res) => {
    //     // try {
    //     //     let answer = window.confirm(
    //     //         "Are you sure you want to delete this tour?"
    //     //     );
    //     //     if (!answer) return;
    //     //     const { data } = await axios.delete(`/tours/${id}`);
    //     //     toast.success(`"${data.name}" is deleted`);
    //     //     navigate("/dashboard/admin/products");
    //     // } catch (err) {
    //     //     console.log(err);
    //     //     toast.error("Delete failed. Try again.");
    //     // }
    // };

    // return (
    //     <>
    //         <Jumbotron title={`Hello ${auth?.user?.name}`}
    //             subTitle="Admin Dashboard"
    //         />

    //         <div className="container-fluid">
    //             <div className="row">
    //                 <div className="col-md-3">
    //                     <AdminMenu />
    //                 </div>

    //                 <div className="col-md-9">
    //                     <div className="p-3 mt-2 mb-2 h4 bg-light">Update Tour</div>

    //                     {/* {photo ? (
    //                         <div className="text-center">
    //                             <img
    //                                 src={URL.createObjectURL(photo)}
    //                                 alt="tour photo"
    //                                 className="img img-responsive"
    //                                 height="200px"
    //                             />
    //                         </div>
    //                     ) : (
    //                         <div className="text-center">

    //                             <img
    //                                 src={`${process.env.REACT_APP_API}/tours/photo/${id}?${new Date().getTime()}`}
    //                                 alt="tour photo"
    //                                 className="img img-responsive"
    //                                 height="200px"
    //                             />

    //                         </div>
    //                     )} */}

    //                     <div className="pt-2">
    //                         <label className="btn btn-outline-secondary col-12 mb-3">
    //                             {photo ? photo.name : "Upload photo"}
    //                             <input
    //                                 type="file"
    //                                 name="photo"
    //                                 accept="image/*"
    //                                 onChange={(e) => setPhoto(e.target.files[0])}
    //                                 hidden
    //                             />
    //                         </label>
    //                     </div>
    //                     <Select
    //                         // showSearch
    //                         bordered={false}
    //                         size="large"
    //                         className="form-select mb-3"
    //                         placeholder="Choose category"
    //                         onChange={(value) => setCategory(value)}
    //                         value={category}
    //                     >
    //                         {categories?.map((c) => (
    //                             <Option key={c._id} value={c._id}>
    //                                 {c.name}
    //                             </Option>
    //                         ))}
    //                     </Select>
    //                     <label htmlFor="name">Tour Name:</label>
    //                     <input
    //                         id="name"
    //                         type="text"
    //                         className="form-control p-2 mb-3"
    //                         placeholder="Write a name"
    //                         value={name}
    //                         onChange={(e) => setName(e.target.value)}
    //                     />
    //                     <input
    //                         type="number"
    //                         className="form-control p-2 mb-3"
    //                         placeholder="Enter duration"
    //                         value={duration}
    //                         onChange={(e) => setDuration(e.target.value)}
    //                     />
    //                     <input
    //                         type="number"
    //                         min="1"
    //                         className="form-control p-2 mb-3"
    //                         placeholder="Enter max group size"
    //                         value={maxGroupSize}
    //                         onChange={(e) => setMaxGroupSize(e.target.value)}
    //                     />
    //                     <input
    //                         type="text"
    //                         className="form-control p-2 mb-3"
    //                         placeholder="Write a description"
    //                         value={description}
    //                         onChange={(e) => setDescription(e.target.value)}
    //                     />
    //                     <input
    //                         type="text"
    //                         className="form-control p-2 mb-3"
    //                         placeholder="Write a difficulty"
    //                         value={difficulty}
    //                         onChange={(e) => setDifficulty(e.target.value)}
    //                     />
    //                     <input
    //                         type="number"
    //                         min="1"
    //                         className="form-control p-2 mb-3"
    //                         placeholder="Enter ratings average"
    //                         value={ratingsAverage}
    //                         onChange={(e) => setRatingsAverage(e.target.value)}
    //                     />
    //                     <input
    //                         type="number"
    //                         min="1"
    //                         className="form-control p-2 mb-3"
    //                         placeholder="Enter ratings quantity"
    //                         value={ratingsQuantity}
    //                         onChange={(e) => setRatingsQuantity(e.target.value)}
    //                     />

    //                     <input
    //                         type="number"
    //                         className="form-control p-2 mb-3"
    //                         placeholder="Enter price"
    //                         value={price}
    //                         onChange={(e) => setPrice(e.target.value)}
    //                     />
    //                     <input
    //                         type="number"
    //                         className="form-control p-2 mb-3"
    //                         placeholder="Enter price discount"
    //                         value={priceDiscount}
    //                         onChange={(e) => setPriceDiscount(e.target.value)}
    //                     />
    //                     <input
    //                         type="number"
    //                         className="form-control p-2 mb-3"
    //                         placeholder="Enter quantity number"
    //                         value={quantity}
    //                         onChange={(e) => setQuantity(e.target.value)}
    //                     />
    //                     <input
    //                         type="number"
    //                         className="form-control p-2 mb-3"
    //                         placeholder="Enter sold number"
    //                         value={sold}
    //                         onChange={(e) => setSold(e.target.value)}
    //                     />

    //                     <textarea
    //                         type="text"
    //                         className="form-control p-2 mb-3"
    //                         placeholder="Write a summary"
    //                         value={summary}
    //                         onChange={(e) => setSummary(e.target.value)}
    //                     />
    //                     <div className="d-flex justify-content-between">
    //                         <Button onClick={handleUpdate} className="btn btn-primary mb-5">
    //                             Update
    //                         </Button>
    //                         <Button onClick={handleDelete} className="btn btn-danger mb-5">
    //                             Delete
    //                         </Button>
    //                     </div>
    //                 </div>
    //             </div>
    //         </div>
    //     </>
    // );
} 
