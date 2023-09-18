import Jumbotron from '../components/cards/Jumbotron';
import ProductCard from '../components/cards/ProductCard';

import { useState, useEffect } from 'react';
import axios from 'axios';
import type { PaginationProps } from 'antd';
import { Checkbox, Radio, Pagination } from 'antd';

import { prices } from '../prices';

export default function Shop() {

    // state
    const [categories, setCategories] = useState([]); // categories
    const [products, setProducts] = useState([]); // products
    //const [filteredProducts, setFilteredProducts] = useState([]); // products
    const [checked, setChecked] = useState([]); // categories check
    const [radio, setRadio] = useState([]); // radio
    const [current, setCurrent] = useState(1);


    // when mounted first time
    useEffect(() => {
        if (!checked.length && !radio.length) loadProducts();
    }, []);

    //when you clicked category or price choice, when you make some choce
    useEffect(() => {
        if (checked.length || radio.length) loadFilteredProducts();
    }, [checked, radio]);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const { data } = await axios.get("/categorys");
            console.log("data in loadCategories in Shop: ", data);
            setCategories(data);
            console.log("categories in loadProducts in Shop=> ", categories);
        } catch (err) {
            console.log(err);
        }
    }
   
    const loadProducts = async () => {
        try {
            const { data } = await axios.get("/tours");
            console.log('data in loadproducts: ', data);
            setProducts(data);
            console.log('num of products in loadproducts: ', products.length);
        } catch (err) {
            console.log(err);
        }
    }

    
    const loadFilteredProducts = async () => {
        try {
            console.log("checked and radio : ", {checked, radio});
            const { data } = await axios.post("/tours/filteredTours", { checked, radio });

            console.log("data in loadFilteredProducts in Shop=> ", data);
            //console.log("inside loadFilteredProducts, filtered tours == => ", data);
            setProducts(data);
            console.log("products in loadFilteredProducts in shop: ", products);
        } catch (err) {
            console.log(err);
        }
    }

    const handleCheck = (value, categoryId) => {
        let allCategories = [ ...checked ];
        if (value) {
            allCategories.push(categoryId);
        } else {
            allCategories = allCategories.filter((c) => c !== categoryId);
        }
        setChecked(allCategories);
    };

    // const onChange = (e: RadioChangeEvent) => {
    //     console.log('radio checked', e.target.value);
    //     setPrices(e.target.value);
    // };



    //console.log('categories: ', categories);
    //console.log('products: ', products);

    return (
        <>
            <Jumbotron title="Shopping Here"
                subTitle="Welcome to Natours Trip"
            />
            {/* <pre>{JSON.stringify({ checked, radio }, null, 4)}</pre> */}
            <div className="container-fluid">
                {/* <a href="https://easel.teacherspayteachers.com/students?code=4C2N2E&utm_campaign=direct">easel by tpt</a>
                <br />
                <a href="https://easel.teacherspayteachers.com/students?code=A7EMGGO&utm_campaign=direct">easel by tpt</a> */}


                <div className="row">
                    <div className="col-md-3">
                        <h2 className="p-3 mt-2 mb-2 h4 bg-light text-center">Filter by Categories
                        </h2>
                        <div className="row p-5">
                            {categories?.map((c) => (
                                <Checkbox key={c._id} onChange={(e) => handleCheck(e.target.checked, c._id)}>
                                    {c.name}
                                </Checkbox>
                            ))}
                        </div>

                        <h2 className="p-3 mt-2 mb-2 h4 bg-light text-center">Filter by Prices
                        </h2>
                        <div className="row p-5">
                            <Radio.Group onChange={(e) => setRadio(e.target.value)}>
                                {prices?.map((p) => (
                                    <div key={p._id} style={{ marginLeft: "8px" }}>
                                        <Radio value={p.array}>{p.name}</Radio>
                                    </div>
                                ))}
                            </Radio.Group>
                        </div>
                        
                        {/* resetting all choice selection */}
                        <div className="p-5 pt-0">
                            <button className="btn btn-outline-secondary col-12"
                                onClick={() => window.location.reload()}
                            >
                                Reset
                            </button>
                        </div>
                    </div>

                    <div className="col-md-9">
                        <h2 className="p-3 mt-2 mb-2 h4 bg-light text-center">{products?.length} Tours
                        </h2>
                        <div className="row" style={{ height: '100vh', overflow: 'scroll' }}>
                            {products?.map((p) => (
                                <div className="col-md-4" key={p._id}>
                                    <ProductCard p={p} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

///////////////////////////////////////////////////////

   //const { data } = await axios.post("/tours/filtered-tours", "post test");
            //const { data } = await axios.post("/tours/filteredTours", {checked, radio});
            // const { data } = await axios.post("/tours/filteredTours",
            //  {
            //     "checked": [
            //         "64d792253d7b422db01fe7d5"
            //     ],
            //     "radio": []
            //  });
            
            // const { data } = await axios.post(`/tours/test`);
            //console.log('{ checked, radio } : ',{ checked, radio });
           


            // const { data } = await axios.post(`/tours/filtered-tours`, { checked, radio },{
            //     headers:{
            //       Accept: 'application/json',
            //      'Content-Type': 'application/json',
            //       Authorization: 'Bearer ' + token // if you use token
            //   }
            //   });


            // const { data } = await axios(`/tours/filtered-tours`, {
            //     data: JSON.stringify({ checked, radio }),
            //     method: "POST",
            //     headers: {
            //       "Content-Type": "application/json; charset=utf-8",
            //     },
            //   });
