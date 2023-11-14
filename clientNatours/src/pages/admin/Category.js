// import { useAuth } from '../../context/auth';
// import Jumbotron from '../../components/cards/Jumbotron';
// import AdminMenu from '../../components/nav/AdminMenu';
// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import CategoryForm from '../../components/forms/Categoryform';
// import { Modal } from 'antd';

// export default function AdminCategory() {
//     // context
//     const [auth, setAuth] = useAuth();
//     // state
//     const [name, setName] = useState(""); // create category
//     const [categories, setCategories] = useState([]);
//     const [visible, setVisible] = useState(false);
//     const [selected, setSelected] = useState(null);
//     const [updatingName, setUpdatingName] = useState(""); // update category

//     useEffect(() => {
//         loadCategories();
//     }, []);

//     const loadCategories = async () => {
//         try {
//             const { data } = await axios.get("/categorys");

//             console.log("data array in categorys: ",data);
//             setCategories(data.data);
//             console.log("categories: ",categories);
//         } catch (err) {
//             console.log(err);
//         }
//     }

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const { data } = await axios.post("/categorys", { name });
            
//             console.log("doc in category: ", data);
//             if (data?.error) {
//                 toast.error(data.error);
//             } else {
//                 // loadCategories();
//                 setName("");
//                 toast.success(`"${name}" is created`)
//             }
          
//         } catch (err) {
//             console.log(err);
//             toast.error("Create category failed. Try again.");     
//         }
//     }

//     const handleUpdate = async (e) => {
//         e.preventDefault();
//         try {
//             const { data } = await axios.put(`/category/${selected._id}`,
//                 { name: updatingName });
//             if (data?.error) {
//                 toast.error(data.error);
//             } else {
//                 toast.success(`"${data.name}" is updated`);
//                 setSelected(null);
//                 setUpdatingName("");
//                 loadCategories();
//                 setVisible(false);
//             }
//         } catch (err) {
//             console.log(err);
//             toast.error("Category update failed. Try again.");
//         }
//     }

//     const handleDelete = async (e) => {
//         e.preventDefault();
//         try {
//             const { data } = await axios.delete(`/category/${selected._id}`);
//             if (data?.error) {
//                 toast.error(data.error);
//             } else {
//                 toast.success(`"${data.name}" is deleted`);
//                 setSelected(null);
//                 loadCategories();
//                 setVisible(false);
//             }
//         } catch (err) {
//             console.log(err);
//             toast.error("Category delete failed. Try again.");
//         }
//     }

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
//                         <div className="p-3 mt-2 mb-2 h4 bg-light">Manage Categories</div>


//                         <CategoryForm value={name}
//                             setValue={setName}
//                             handleSubmit={handleSubmit}
//                         />
//                         <hr />

//                         {/* <div className="col">
//                             {categories?.map((c) => (
//                                 <button key={c._id} className="btn btn-outline-primary m-3"
//                                     onClick={() => {
//                                         setVisible(true);
//                                         setSelected(c);
//                                         setUpdatingName(c.name);
//                                     }}
//                                 >
//                                     {c.name}
//                                 </button>
//                             ))}
//                         </div> */}

//                         <Modal open={visible}
//                             onOk={() => setVisible(false)}
//                             onCancel={() => setVisible(false)}
//                             footer={null}>
//                             <CategoryForm value={updatingName} setValue={setUpdatingName}
//                                 handleSubmit={handleUpdate} buttonText="Update"
//                                 handleDelete={handleDelete}
//                             />
//                             <hr />
//                         </Modal>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// } 

//////////////////////////////////////////////////////////////////////////


import { useAuth } from '../../context/auth';
import Jumbotron from '../../components/cards/Jumbotron';
import AdminMenu from '../../components/nav/AdminMenu';
import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import CategoryForm from '../../components/forms/Categoryform';
import { Modal } from 'antd';
import slugify from 'slugify';

export default function AdminCategory() {
    // context
    const [auth, setAuth] = useAuth();
    // state
    const [name, setName] = useState(""); // create category
    const [categories, setCategories] = useState([]);
    const [visible, setVisible] = useState(false);
    const [selected, setSelected] = useState(null);
    const [updatingName, setUpdatingName] = useState(""); // update category

    //const TotalItemsArray=[];

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const { data } = await axios.get("/categorys");
            
            // console.log('data in loadCategories: '+ data);
            setCategories(data);

            console.log('categories in loadCategories: ', categories);

            // const items = data.data.data;

            // console.log("items : ",items);           
            // console.log(typeof items);
           
            // // /////////////////////////////////////////////
            // const TotalItemsArray=[];

            // for(let deepObject of items){

            //     console.log("deepObject : ",deepObject);
                
            //     const deepitemsArray=[];
            //     Object.entries(deepObject).forEach(entry => {
            //     const [key, value] = entry;
            //     deepitemsArray.push([key, value]);
               
            //     });
            //      console.log('deepitemsArray: ',deepitemsArray);

            //      TotalItemsArray.push(deepitemsArray);
            // }
            // console.log('ToalItemsArray: ', TotalItemsArray);
            // setCategories(TotalItemsArray);

        } catch (err) {
            console.log(err);
        }
    }

    // setCategories(TotalItemsArray);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post("/categorys", { name });
            
            // console.log("doc in category: ", data);
            if (data?.error) {
                toast.error(data.error);
            } else {
                loadCategories();
                setName("");
                toast.success(`"${data.name}" is created`)
            }
          
        } catch (err) {
            console.log(err);
            toast.error("Create category failed. Try again.");     
        }
    }

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.patch(`/categorys/${selected._id}`,
                { name: updatingName });
            
            console.log('data in handleUpdate: ' + data);
            if (data?.error) {
                toast.error(data.error);
            } else {
                toast.success(`"${data.name}" is updated`);
                setSelected(null);
                setUpdatingName("");
                loadCategories();
                setVisible(false);
            }
        } catch (err) {
            console.log(err);
            toast.error("Category update failed. Try again.");
        }
    }

    const handleDelete = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.delete(`/categorys/${selected._id}`);
            
            console.log('data in handleDelete: ' + data);
            if (data?.error) {
                toast.error(data.error);
            } else {
                toast.success(`"${data.name}" is deleted`);
                setSelected(null);
                loadCategories();
                setVisible(false);
            }
        } catch (err) {
            console.log(err);
            toast.error("Category delete failed. Try again.");
        }
    }

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
                        <div className="p-3 mt-2 mb-2 h4 bg-light">Manage Categories</div>


                        <CategoryForm value={name}
                            setValue={setName}
                            handleSubmit={handleSubmit}
                        />
                        <hr />

                        <div className="col">
                            {categories?.map((c) => (
                                <button key={c._id} className="btn btn-outline-primary m-3"
                                    onClick={() => {
                                        setVisible(true);
                                        setSelected(c);
                                        setUpdatingName(c.name);
                                    }}
                                >
                                    {c.name}
                                </button>
                            ))}
                        </div>

                        <Modal
                            open={visible}
                            onOk={() => setVisible(false)}
                            onCancel={() => setVisible(false)}
                            footer={null}>
                            <CategoryForm value={updatingName} setValue={setUpdatingName}
                                handleSubmit={handleUpdate} buttonText="Update"
                                handleDelete={handleDelete}
                            />
                            <hr />
                        </Modal>
                    </div>
                </div>
            </div>
        </>
    );
} 
 



































// import { useAuth } from '../../context/auth';
// import Jumbotron from '../../components/cards/Jumbotron';
// import AdminMenu from '../../components/nav/AdminMenu';
// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import CategoryForm from '../../components/forms/Categoryform';
// import { Modal } from 'antd';

// export default function AdminCategory() {
//     // context
//     const [auth, setAuth] = useAuth();
//     // state
//     const [name, setName] = useState(""); // create category
//     const [categories, setCategories] = useState([]);
//     const [visible, setVisible] = useState(false);
//     const [selected, setSelected] = useState(null);
//     const [updatingName, setUpdatingName] = useState(""); // update category

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
//             const { data } = await axios.post("/category/", { name });
//             if (data?.error) {
//                 toast.error(data.error);
//             } else {
//                 loadCategories();
//                 setName("");
//                 toast.success(`"${data.name}" is created`)
//             }
//         } catch (err) {
//             console.log(err);
//             toast.error("Create category failed. Try again.");
//         }
//     }

//     const handleUpdate = async (e) => {
//         e.preventDefault();
//         try {
//             const { data } = await axios.put(`/category/${selected._id}`,
//                 { name: updatingName });
//             if (data?.error) {
//                 toast.error(data.error);
//             } else {
//                 toast.success(`"${data.name}" is updated`);
//                 setSelected(null);
//                 setUpdatingName("");
//                 loadCategories();
//                 setVisible(false);
//             }
//         } catch (err) {
//             console.log(err);
//             toast.error("Category update failed. Try again.");
//         }
//     }

//     const handleDelete = async (e) => {
//         e.preventDefault();
//         try {
//             const { data } = await axios.delete(`/category/${selected._id}`);
//             if (data?.error) {
//                 toast.error(data.error);
//             } else {
//                 toast.success(`"${data.name}" is deleted`);
//                 setSelected(null);
//                 loadCategories();
//                 setVisible(false);
//             }
//         } catch (err) {
//             console.log(err);
//             toast.error("Category delete failed. Try again.");
//         }
//     }

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
//                         <div className="p-3 mt-2 mb-2 h4 bg-light">Manage Categories</div>


//                         <p>Create category form...</p>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// } 

///////////////////////////////////////////////////////////////
 //const entries = Object.entries(data);

            // console.log("data : ",data);           
            // console.log(typeof data);

            // console.log("{data} : ",{data});           
            // console.log(typeof {data});

            // console.log("data.data : ",data.data);           
            // console.log(typeof data.data);

            // console.log("data.data.data : ",data.data.data);           
            // console.log(typeof data.data.data);

            // console.log("data.data.data[0] : ",data.data.data[0]);           
            // console.log(typeof data.data.data[0]);
            
            // console.log("data.data.data[0] : ",data.data.data[0]);           
            // console.log(typeof data.data.data[0]);

            // console.log("data.data.data[0]._id : ",data.data.data[0]._id);           
            // console.log(typeof data.data.data[0]._id);

            // console.log("data.data.data[0].name : ",data.data.data[0].name);           
            // console.log(typeof data.data.data[0].name);
// const namesArray = items.map((item) => item.name);
            // console.log('namesArray: ', namesArray);


                      
        

            // /////////////////////////////////////////////
            
            // for(let deepObject of items){

            //     console.log("deepObject : ",deepObject);
                
            //     const deepitemsArray=[];
            //     Object.entries(deepObject).forEach(entry => {
            //     const [key, value] = entry;
            //     deepitemsArray.push([key, value]);
               
            //     });
            //      console.log('deepitemsArray: ',deepitemsArray);
            // }
      


            // /////////////////////////////////////////////
            // let newArray=[];
            // items.forEach((n)=>{
            //     console.log('n.length: ',n.length);
            //     let deepObject = items[n];
            //     console.log("deepObject : ",deepObject);
                
            //     let deepitems=[];
            //     Object.entries(deepObject).forEach(entry => {
            //     let [key, value] = entry;
            //     deepitems.push([key, value]);
            
            //     });
            //     console.log('deepitems: ',deepitems);
            //     newArray.push(deepitems);
               
            // });
            //  console.log('newArray: ', newArray);
            
             




















            // const {_id, name} = deepObject;
            // const idAndNameObj = {_id, name};
        
            // console.log('idAndNameObj: ',idAndNameObj);



            // const idAndNameArray = [];
            // items.forEach(({n}) => {
            //     console.log('{n}.name: ',{n}.name);
            //     let deepObject = {n};

            //     const {_id, name} = deepObject;
            //     const idAndNameObj = {_id, name};

            //     idAndNameArray.push(idAndNameObj);
            // });

            // console.log('idAndNameArray: ', idAndNameArray);