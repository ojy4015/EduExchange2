import { useState, useEffect } from 'react';
// import Sidebar from '../../components/nav/Sidebar';
import Jumbotron from '../../components/cards/Jumbotron';
import { useAuth } from '../../context/auth';
import axios from 'axios';
import ProductCard from '../../components/cards/ProductCard';
import AdminMenu from '../../components/nav/AdminMenu';


export default function MyAdminStore() {
  // context
  const [auth, setAuth] = useAuth();

  // state
  const [tours, setTours] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const seller = auth.user?.role?.includes("Seller");

  useEffect(() => {
    fetchAds()
  }, [auth.token != '']);

  useEffect(() => {
    if (page == 1) return;
    fetchAds()
  }, [page]);

  const fetchAds = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/tours/user-tours/${page}`);
      //console.log("data in MyStore : ", data);

      // setTours(data.tours);
      setTours([...tours, ...data.tours]);
      setTotal(data.total);
      setLoading(false);

    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  }

  const handleOnClick = (e) => {
    e.preventDefault();
    try {
      setPage(page + 1);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <Jumbotron title='My Store'
        subTitle="My Admin store"
      />
      <div>
        <div className="col-md-3">
          <AdminMenu />
        </div>
        <div className="col-md-9">
          {!seller ? (
            <div className='d-flex justify-content-center alin-irems-center vh-100'
              style={{ marginTop: "-10%" }}>
              <h2>
                Hey {auth.user?.name ? auth.user?.name : auth.user?.username},
                Welcome to Natours App
              </h2>
            </div>
          ) : (
            <div className="container">
              <div className="row">
                <div className="col-lg-8 offset-lg-2 mt-4 mb-4">
                  <p className="text-center">Total {total} tours found</p>
                </div>
              </div>
              <div className="row">
                {tours?.map((tour) => (
                  <ProductCard p={tour} key={tour._id} />
                ))}
              </div>
              {
                tours?.length < total ? (
                  <div className="row">
                    <div className="col text-center mt-4 mb-4">
                      <button disabled={loading} className="btn btn-warning" onClick={handleOnClick}>
                        {loading ? "Loading..." : `${tours?.length} / ${total} Load more`}
                      </button>
                    </div>
                  </div>
                ) : ("")
              }
              <pre>{JSON.stringify(tours, null, 4)}</pre>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

