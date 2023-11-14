
import { useState, useEffect } from 'react';
// import Sidebar from '../../components/nav/Sidebar';
import Jumbotron from '../../components/cards/Jumbotron';
import { useAuth } from '../../context/auth';
import axios from 'axios';
import UserProductCard from '../../components/cards/UserProductCard';
import UserMenu from '../../components/nav/UserMenu';
import { Pagination } from 'antd';
import { PaginationProps } from 'antd';

export default function Enquiries() {
  // context
  const [auth, setAuth] = useAuth();

  // state
  const [tours, setTours] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

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
      const { data } = await axios.get(`/tours/enquiries/${page}`);
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

  const onChange: PaginationProps['onChange'] = (page1) => {
    console.log(page1);
    setCurrentPage(page1);
    { page1 === 1 ? window.location.reload() : setPage(page1) };
    setPage(page1);
  };

  return (
    <>
      <Jumbotron title='Enquires List'
        subTitle="Enquires List"
      />
      <div>
        <div className="col-md-3">
          <UserMenu />
        </div>
        <div className="col-md-9">
          {!total ? (
            <div className='d-flex justify-content-center alin-irems-center vh-100'
              style={{ marginTop: "-10%" }}>
              <h2>
                Hey {auth.user?.name ? auth.user?.name : auth.user?.username},
                You have not enquired any properties yet!
              </h2>
            </div>
          ) : (
            <div className="container">
              <div className="row">
                <div className="col-lg-8 offset-lg-2 mt-4 mb-4">
                  <p className="text-center">You have enquired {total} properties</p>
                </div>
              </div>
              <div className="row">
                {tours?.map((tour) => (
                  <UserProductCard p={tour} key={tour._id} />
                ))}
              </div>
              {/* Load more */}
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

              <div className="container text-center p-5">
                {
                  tours?.length < total ? (
                    <>
                      <Pagination
                        defaultCurrent={1}
                        total={total}
                        showSizeChanger
                        pageSizeOptions={[1, 2, 3, 4, 5, 10]}
                        showQuickJumper current={currentPage}
                        onChange={(page, pageSize) => {
                          setCurrentPage(page);
                          // make api call
                        }}

                      />
                    </>
                  ) : ("")
                }
              </div>

              <pre>{JSON.stringify(tours, null, 4)}</pre>
            </div>
          )}
        </div>
      </div>
    </>
  );
}




