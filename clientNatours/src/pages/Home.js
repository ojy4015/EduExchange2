////////////////////////////////////////////////////////////////////////
import { useAuth } from '../context/auth';
import { useEffect, useState } from "react";
import Jumbotron from "../components/cards/Jumbotron";
import ProductCard from '../components/cards/ProductCard';
import axios from "axios";
import type { PaginationProps } from 'antd';
import { Pagination } from 'antd';
// import { useAuth } from '../context/auth';

import AdForm from "../components/forms/AdForm"

export default function Home() {
  // context
  const [auth, setAuth] = useAuth();

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
      {/* <pre>{JSON.stringify(auth, null, 4)}</pre> */}
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
              <Pagination showQuickJumper total={total} onChange={onChange} pageSize={4} />
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
        <br />
        <br />

      </div>

      <div className='container mt-2'>
        <AdForm action="Sell" type="House" />
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
