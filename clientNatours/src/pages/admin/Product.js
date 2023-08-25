// import { useAuth } from '../../context/auth';
// import Jumbotron from '../../components/cards/Jumbotron';
// import AdminMenu from '../../components/nav/AdminMenu';

// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// //import CategoryForm from '../../components/forms/Categoryform';
// import { Select } from 'antd';
// /*import product from '../../../../server/models/product';*/
// import { useNavigate } from 'react-router-dom';

// const { Option } = Select;

// function onChange(value) {
//     console.log(`selected ${value}`);
// }

// function onBlur() {
//     console.log('blur');
// }

// function onFocus() {
//     console.log('focus');
// }

// function onSearch(val) {
//     console.log('search:', val);
// }
// export default function AdminProduct() {
//     // context
//     const [auth, setAuth] = useAuth();
//     // state
//     const [categories, setCategories] = useState([]); // categories
//     const [photo, setPhoto] = useState("");
//     const [name, setName] = useState("");
//     const [description, setDescription] = useState("");
//     const [price, setPrice] = useState("");
//     const [category, setCategory] = useState("");
//     const [shipping, setShipping] = useState("");
//     const [quantity, setQuantity] = useState("");

//     const [visible, setVisible] = useState(false);
//     const [selected, setSelected] = useState(null);
//     const [updatingName, setUpdatingName] = useState(""); // update category

//     // hook
//     const navigate = useNavigate();

//     useEffect(() => {
//         loadCategories();
//     }, []);

//     const loadCategories = async () => {
//         try {
//             const { data } = await axios.get("/categories");
//             setCategories(data);
//         } catch (err) {
//             console.log(err);
//         }
//     }

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const productData = new FormData();
//             productData.append("photo", photo);
//             productData.append("name", name);
//             productData.append("description", description);
//             productData.append("price", price);
//             productData.append("shipping", shipping);
//             productData.append("quantity", quantity);
//             productData.append("category", category);

//             console.log([...productData]);
//              //console.log(typeof name, description, typeof price, shipping, quantity, typeof category, photo);
//             const { data } = await axios.post("/product", productData);
//             if (data?.error) {
//                 toast.error(data.error);
//             } else {
//                 toast.success(`"${data.name}" is created`);
//                 navigate('/dashboard/admin/products'); // products list 

//             }
//         } catch (err) {
//             console.log(err);
//             toast.error("Product create failed. Try again.");

//         }
//     };

//     return (
//         <>
//             <Jumbotron title={`Hello ${auth?.user?.name}`}
//                 subTitle="Admin Dashboard"
//             />

//             <div className="container-fluid">
//                 <div className="row">
//                     <div className="col-md-3">
//                         <AdminMenu />
//                     </div>
//                     <div className="col-md-9">
//                         <div className="p-3 mt-2 mb-2 h4 bg-light">Manage Products</div>

//                         {photo && (
//                             <div className="text-center">
//                                 <img src={URL.createObjectURL(photo)} alt="product photo" className="img img-responsive" height="200px" />
//                             </div>
//                         )}
//                         <form onSubmit={handleSubmit} calssName="mb-5">
//                             <div className="pt-2">
//                                 <label className="btn btn-outline-secondary col-12 mb-3">
//                                     {photo ? photo.name : "Upload photo"}
//                                     <input type="file" name="photo" accept="image/*"
//                                         onChange={(e) => setPhoto(e.target.files[0])}
//                                         hidden
//                                     />
//                                 </label>

//                             </div>

//                             <input type="text" className="form-control mb-3 p-2"
//                                 placeholder="Write a name" value={name}
//                                 onChange={(e) => setName(e.target.value)}
//                             />


//                             <textarea type="text" className="form-control mb-3 p-2"
//                                 placeholder="Write a description" value={description}
//                                 onChange={(e) => setDescription(e.target.value)}
//                             />

//                             <input type="number" className="form-control mb-3 p-2"
//                                 placeholder="Enter price" value={price}
//                                 onChange={(e) => setPrice(e.target.value)}
//                             />

//                             <Select
//                                 showSearch
//                                 style={{ width: 900 }}
//                                 placeholder="Select a category"
//                                 optionFilterProp="children"
//                                 onChange={(value) => setCategory(value)}
//                                 onFocus={onFocus}
//                                 onBlur={onBlur}
//                                 onSearch={onSearch}
//                                 filterOption={(input, option) =>
//                                     option.props.children.toString().toLowerCase().indexOf(input.toString().toLowerCase()) >= 0
//                                 }
//                             >
//                                 {categories?.map((c) => <Option key={c._id} value={c._id}>{c.name} </Option>)}
//                             </Select>

//                             <Select
//                                 showSearch
//                                 style={{ width: 900 }}
//                                 placeholder="Choose shipping"
//                                 optionFilterProp="children"
//                                 onChange={(value) => setShipping(value)}
//                                 onFocus={onFocus}
//                                 onBlur={onBlur}
//                                 onSearch={onSearch}
//                                 filterOption={(input, option) =>
//                                     option.props.children.toString().toLowerCase().indexOf(input.toString().toLowerCase()) >= 0
//                                 }
//                             >
//                                 <Option value="0">No</Option>
//                                 <Option value="1">Yes</Option>
//                             </Select>

//                             <input type="number" min="1" className="form-control mb-3 p-2"
//                                 placeholder="Enter quantity" value={quantity}
//                                 onChange={(e) => setQuantity(e.target.value)}
//                             />

//                             <button onClick={handleSubmit} calssName="btn btn-primary mb-5">Submit</button>
//                         </form>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// } 


import { useAuth } from '../../context/auth';
import Jumbotron from '../../components/cards/Jumbotron';
import AdminMenu from '../../components/nav/AdminMenu';

import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
//import CategoryForm from '../../components/forms/Categoryform';
import { Select } from 'antd';
/*import product from '../../../../server/models/product';*/
import { useNavigate } from 'react-router-dom';

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
export default function AdminProduct() {
    // context
    const [auth, setAuth] = useAuth();
    // state
    const [categories, setCategories] = useState([]); // categories
    const [name, setName] = useState("");
    const [duration, setDuration] = useState("");
    const [maxGroupSize, setMaxGroupSize] = useState("");
    const [difficulty, setDifficulty] = useState('easy');
    const [ratingsAverage, setRatingsAverage] = useState("");
    const [ratingsQuantity, setRatingsQuantity] = useState("");
    const [price, setPrice] = useState("");
    const [priceDiscount, setPriceDiscount] = useState("");
    const [summary, setSummary] = useState("");
    const [description, setDescription] = useState("");
    const [imageCover, setImageCover] = useState("");
    const [images, setImages] = useState("");
    const [photo, setPhoto] = useState("");
    const [category, setCategory] = useState("");
    const [sold, setSold] = useState("");

    // hook
    const navigate = useNavigate();

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const { data } = await axios.get("/categorys");

            // console.log('data in loadCategories: '+ data);
            setCategories(data);

            //console.log('categories in loadCategories: ' + categories)

        } catch (err) {
            console.log(err);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const tourData = new FormData();
            tourData.append("photo", photo);
            tourData.append("category", category);
            tourData.append("name", name);
            tourData.append("duration", duration);
            tourData.append("maxGroupSize", maxGroupSize);
            tourData.append("description", description);
            tourData.append("difficulty", difficulty);
            tourData.append("ratingsAverage", ratingsAverage);
            tourData.append("ratingsQuantity", ratingsQuantity);
            tourData.append("price", price);
            tourData.append("priceDiscount", priceDiscount);
            tourData.append("sold", sold);
            tourData.append("summary", summary);

            //console.log([...tourData]);
            const { data } = await axios.post("/tours", tourData);

            if (data?.error) {
                toast.error(data.error);
            } else {
                toast.success(`"${data.name}" is created`);
                //     navigate("/dashboard/admin/products");
            }
        } catch (err) {
            console.log(err);
            toast.error("Tour create failed. Try again.");
        }
    };

    return (
        <>
            <Jumbotron title={`Hello ${auth?.user?.name}`}
                subTitle="Admin Dashboard"
            />




            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-3">
                        <AdminMenu />
                    </div>

                    <div className="col-md-9">
                        <div className="p-3 mt-2 mb-2 h4 bg-light">Manage Products</div>

                        {photo && (
                            <div className="text-center">
                                <img
                                    src={URL.createObjectURL(photo)}
                                    alt="tour photo"
                                    className="img img-responsive"
                                    height="200px"
                                />
                            </div>
                        )}

                        <div className="pt-2">
                            <label className="btn btn-outline-secondary col-12 mb-3">
                                {photo ? photo.name : "Upload photo"}
                                <input
                                    type="file"
                                    name="photo"
                                    accept="image/*"
                                    onChange={(e) => setPhoto(e.target.files[0])}
                                    hidden
                                />
                            </label>
                        </div>
                        <Select
                            // showSearch
                            bordered={false}
                            size="large"
                            className="form-select mb-3"
                            placeholder="Choose category"
                            onChange={(value) => setCategory(value)}
                        >
                            {categories?.map((c) => (
                                <Option key={c._id} value={c._id}>
                                    {c.name}
                                </Option>
                            ))}
                        </Select>
                        <label htmlFor="name">Tour Name:</label>
                        <input
                            id="name"
                            type="text"
                            className="form-control p-2 mb-3"
                            placeholder="Write a name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <input
                            type="number"
                            className="form-control p-2 mb-3"
                            placeholder="Enter duration"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                        />
                        <input
                            type="number"
                            min="1"
                            className="form-control p-2 mb-3"
                            placeholder="Enter max group size"
                            value={maxGroupSize}
                            onChange={(e) => setMaxGroupSize(e.target.value)}
                        />
                        <input
                            type="text"
                            className="form-control p-2 mb-3"
                            placeholder="Write a description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <input
                            type="text"
                            className="form-control p-2 mb-3"
                            placeholder="Write a difficulty"
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value)}
                        />
                        <input
                            type="number"
                            min="1"
                            className="form-control p-2 mb-3"
                            placeholder="Enter ratings average"
                            value={ratingsAverage}
                            onChange={(e) => setRatingsAverage(e.target.value)}
                        />
                        <input
                            type="number"
                            min="1"
                            className="form-control p-2 mb-3"
                            placeholder="Enter ratings quantity"
                            value={ratingsQuantity}
                            onChange={(e) => setRatingsQuantity(e.target.value)}
                        />

                        <input
                            type="number"
                            className="form-control p-2 mb-3"
                            placeholder="Enter price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                        <input
                            type="number"
                            className="form-control p-2 mb-3"
                            placeholder="Enter price discount"
                            value={priceDiscount}
                            onChange={(e) => setPriceDiscount(e.target.value)}
                        />

                        <input
                            type="number"
                            className="form-control p-2 mb-3"
                            placeholder="Enter sold number"
                            value={sold}
                            onChange={(e) => setSold(e.target.value)}
                        />

                        <textarea
                            type="text"
                            className="form-control p-2 mb-3"
                            placeholder="Write a summary"
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)}
                        />
                        <button onClick={handleSubmit} className="btn btn-primary mb-5">
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
} 
