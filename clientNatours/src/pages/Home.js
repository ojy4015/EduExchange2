// import Jumbotron from '../components/cards/Jumbotron';
// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import ProductCard from '../components/cards/ProductCard';

// import {useAuth} from '../context/auth';

// export default function Home() {

//   const [auth, setAuth] = useAuth();

//   // state
//   const [products, setProducts] = useState([]);
//   const [totalProductsNum, setTotalProductsNum] = useState(0);
//   const [page, setPage] = useState(1); // initial page
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     loadProducts();
//     getTotal();
//   }, []);

//   useEffect(() => {
//     if (page === 1) return;
//     loadMore();
//   }, [page]);

//   const getTotal = async () => {
//     try {
//       const { data } = await axios.get("/products-count");
//       setTotalProductsNum(data);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const loadProducts = async () => {
//     try {
//       const { data } = await axios.get(`/list-products/${page}`);
//       setProducts(data);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   // excute each time page change
//   const loadMore = async () => {
//     try {
//       setLoading(true);
//       const { data } = await axios.get(`/list-products/${page}`);
//       setProducts([...products, ...data]);
//       //console.log("products: ", products, "data ; ", data);
//       setLoading(false);
//     } catch (err) {
//       console.log(err);
//       setLoading(false);
//     }
//   };

//   const arr = [...products];
//   //console.log(arr);

//   const sortedBySold = arr?.sort((a, b) => (a.sold < b.sold ? 1 : -1));
//   //console.log(sortedBySold);

//   return (
//     <div>
//       <Jumbotron title="Hello World" subTitle="Let's begin Natours Journey" />
//       <pre>{JSON.stringify(auth, null, 4)}</pre>
//       <div className="row">
//         <div className="col-md-6">
//           <h2 className="p-3 mt-2 mb-2 h4 bg-light text-center">New Arrivals</h2>
//           <div className="row">
//             {products?.map((p) => (
//                 <div className="col-md-6" key={p._id}>
//                 <ProductCard product={p}  />
//               </div>
//             ))}
//           </div>
//         </div>
//         <div className="col-md-6">
//           <h2 className="p-3 mt-2 mb-2 h4 bg-light text-center">Best Sellers</h2>
//           <div className="row">
//             {sortedBySold?.map((p) => (
//                 <div className="col-md-6" key={p._id}>
//                 <ProductCard product={p} />
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//       <div className="container text-center p-5">
//         {products && products.length < totalProductsNum && (
//           <button className="btn btn-warning btn-lg col-md-6" disabled={loading} onClick={
//             e => {
//               e.preventDefault();
//               setPage(page + 1);
//             }
//           }
//           >
//             {loading ? "Loading..." : "Load more"}
//           </button>
//         )}
//       </div>

//     </div>
//   );
// }

////////////////////////////////////////////////////////////////////////

import { useEffect, useState } from "react";
import Jumbotron from "../components/cards/Jumbotron";
import ProductCard from '../components/cards/ProductCard';
import axios from "axios";
import type { PaginationProps } from 'antd';
import { Pagination } from 'antd';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  // const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    loadProducts();
    getTotal();
  }, []);

  useEffect(() => {
    // if (page === 1) return;
    loadMore();
  }, [page]);

  // total documents
  const getTotal = async () => {
    try {
      const { data } = await axios.get("/tours/toursCount");
      //console.log('inside getTotal : ', data);
      setTotal(data);
    } catch (err) {
      console.log(err);
    }
  };

  const loadProducts = async () => {
    try {
      // this will give us 4 pages
      const { data } = await axios.get(`/tours/list-tours/${page}`);
      setProducts(data);
      //console.log('data in loadProducts: ' + data);
    } catch (err) {
      console.log(err);
    }
  }

  const onChange: PaginationProps['onChange'] = (page1) => {
    console.log(page1);
    setCurrent(page1);
    // {page1 === 1 ?  window.location.reload() : setPage(page1)}; 
    setPage(page1); 
    
  };

  const loadMore = async () => {
    try {
      // setLoading(true);
      console.log("page in loadMore: ", page);
      const { data } = await axios.get(`/tours/list-tours/${page}`);
      // keep old tours and add new tours
      // setProducts([...products, ...data]);

      // just new tours
      setProducts([...data]);

      // setLoading(false);
    } catch (err) {
      console.log(err);
      // setLoading(false);
    }
  };

  const arr = [...products];
  const sortByRatingsAveragey = arr?.sort((a, b) => (a.ratingsAverage < b.ratingsAverage ? 1 : -1));

  const sortBySold = arr?.sort((a, b) => (a.sold < b.sold ? 1 : -1));

  return (
    <div>
      <Jumbotron title="Natours Tours" sutTitle="Welcome to Natours Tours" />
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-6">
            <h2 className="p-3 mt-2 mb-2 h4 bg-primary text-center">
              New Tours
            </h2>
            <div className="row bg-light">
              {products?.map((p) => (
                <div className="col-md-6" key={p._id}>
                  <ProductCard p={p} />
                </div>
              ))}
            </div>
            
          </div>

          <div className="col-md-6">
            <h2 className="p-3 mt-2 mb-2 h4 bg-info text-center">
              Best Sellers
            </h2>
            <div className="row bg-light">
              {sortBySold?.map((p) => (
                <div className="col-md-6" key={p._id}>
                  <ProductCard p={p} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="container text-center p-5">
          {products && products.length < total && (
            <>
              <Pagination showQuickJumper total={total} onChange={onChange} pageSize={4}/>
              {/* <button
                className="btn btn-warning btn-lg col-md-6"
                disabled={loading}
                onClick={(e) => {
                  e.preventDefault();
                  setPage(page + 1);
                }}
              >
                {loading ? "Loading..." : "Load more"}
              </button> */}
            
            </>
            
          )}
        </div>
        <br/>
        <br/>
        
      </div>
    </div>
  );
}

//////////////////////////////////////////////////////////////////////
// to explain CORS
// import { useEffect, useState } from "react";
// import Jumbotron from "../components/cards/Jumbotron";
// import axios from "axios";
// import ProductCard from "../components/cards/ProductCard";

// export default function Home() {
//   const [test, setTest] = useState({});
//   // const [products, setProducts] = useState([]);
//   // const [total, setTotal] = useState(0);
//   // const [page, setPage] = useState(1);
//   // const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     loadProducts();
//     //getTotal();
//   }, []);

//   // useEffect(() => {
//   //   if (page === 1) return;
//   //   loadMore();
//   // }, [page]);

//   // const getTotal = async () => {
//   //   try {
//   //     const { data } = await axios.get("/products-count");
//   //     setTotal(data);
//   //   } catch (err) {
//   //     console.log(err);
//   //   }
//   // };

//   const loadProducts = async () => {
//     try {
//       const { data } = await axios.get(`http://localhost:8000/api/v1/tours/test`);
//       setTest(data);
//       //console.log('data in loadProducts: ' + data);
//     } catch (err) {
//       console.log(err);
//     }
//   }

//   // const loadMore = async () => {
//   //   try {
//   //     setLoading(true);
//   //     const { data } = await axios.get(`/list-products/${page}`);
//   //     setProducts([...products, ...data]);
//   //     setLoading(false);
//   //   } catch (err) {
//   //     console.log(err);
//   //     setLoading(false);
//   //   }
//   // };

//   // const arr = [...products];
//   // const sortByRatingsAveragey = arr?.sort((a, b) => (a.ratingsAverage < b.ratingsAverage ? 1 : -1));

//   // const sortBySold = arr?.sort((a, b) => (a.sold < b.sold ? 1 : -1));

//   return (
//     <div>
//       {test.name}{test.favoriteFood}
//     </div>
//   );
// }
