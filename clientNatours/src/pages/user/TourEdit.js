import { useState, useEffect } from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { GOOGLE_PLACES_KEY } from "../../config";
import CurrencyInput from 'react-currency-input-field';
import ImageUpload from '../../components/forms/imageUpload';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import UserMenu from '../../components/nav/UserMenu';
import { useAuth } from "../../context/auth";
import Jumbotron from "../../components/cards/Jumbotron";
// import Sidebar from '../../../components/nav/Sidebar';

export default function TourEdit({ action, type }) {
  // context
  const [auth, setAuth] = useAuth();
  // state
  const [tour, setTour] = useState({
    _id: "",
    photos: [],
    uploading: false,
    price: "",
    address: "",
    bedrooms: "",
    bathrooms: "",
    carpark: "",
    landsize: "",
    title: "",
    description: "",
    loading: false,
    type,
    action,
  });

  const [loaded, setLoaded] = useState(false);

  // hooks
  const navigate = useNavigate();
  const params = useParams();

  // deploying saved info from database by reading params
  useEffect(() => {

    if (params?.slug) {
      if (params?.slug) {
        // console.log('params?.slug => ', params?.slug);
        fetchTour();
      }
    }
  }, [params?.slug]);

  const fetchTour = async () => {
    try {
      const { data } = await axios.get(`/tours/slug/${params.slug}`);
      // console.log("single ad edit page => ", data);
      // name is used for title
      setTour({ ...data, title: data.name });
      setLoaded(true);
    } catch (err) {
      console.log(err);
    }
  }

  const handleClick = async () => {
    try {
      // validation
      if (!tour.photos?.length) {
        toast.error("Photo is required");
        return;
      } else if (!tour.price) {
        toast.error("Price is required");
        return;
      } else if (!tour.description) {
        toast.error("Description is required");
        return;
      } else {
        // make API put request
        setTour({ ...tour, loading: true });

        const { data } = await axios.put(`/tours/${tour._id}`, tour);
        console.log("ad create response => ", data);
        if (data?.error) {
          toast.error(data.error);
          setTour({ ...tour, loading: false });
        } else {
          toast.success("Tour updated successfully");
          setTour({ ...tour, loading: false });
          navigate("/dashboard/user/mystore");
        }
      }

    } catch (err) {
      console.log(err);
      setTour({ ...tour, loading: false })
    }
  }

  const handleDelete = async () => {
    try {
      // make API put request
      setTour({ ...tour, loading: true });

      const { data } = await axios.delete(`/tours/${tour._id}`);
      //console.log("ad create response => ", data);
      if (data?.error) {
        toast.error(data.error);
        setTour({ ...tour, loading: false });
      } else {
        toast.success("Tour deleted successfully");
        setTour({ ...tour, loading: false });
        navigate("/dashboard/user/mystore");
      }
    }

    catch (err) {
      console.log(err);
      setTour({ ...tour, loading: false })
    }
  }

  return (
    <>
      <Jumbotron
        title={`Hello ${auth?.user?.name}`}
        subTitle="Tour Edit"
      />
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <div className="p-3 mt-2 mb-2 h4 bg-light">Edit Tour</div>
            <ImageUpload ad={tour} setAd={setTour} />
            {loaded ? (
              < GooglePlacesAutocomplete
                apiKey={GOOGLE_PLACES_KEY}
                apiOptions="kr"
                selectProps={{
                  defaultInputValue: tour?.address,
                  placeholder: "Search for address..",
                  onChange: ({ value }) => {
                    setTour({ ...tour, address: value.description });
                  },
                }}
              />
            ) : ("")

            }

            {
              loaded ? (
                <div style={{ marginTop: '100px' }}>
                  <CurrencyInput
                    // id="input-example"
                    // name="input-name"
                    placeholder="Please enter a price"
                    defaultValue={tour.price}
                    className='form-control mb-3'
                    // decimalsLimit={2}
                    onValueChange={(value) => setTour({ ...tour, price: value })}
                  />
                </div>
              ) : ("")
            }

            {
              tour.type === 'House' ? (
                <>
                  <input type="number"
                    min="0"
                    className='form-control mb-3'
                    placeholder='how many bedrooms'
                    value={tour.bedrooms}
                    onChange={(e) => setTour({ ...tour, bedrooms: e.target.value })}
                  />

                  <input type="number"
                    min="0"
                    className='form-control mb-3'
                    placeholder='how many bathrooms'
                    value={tour.bathrooms}
                    onChange={(e) => setTour({ ...tour, bathrooms: e.target.value })}
                  />

                  <input type="number"
                    min="0"
                    className='form-control mb-3'
                    placeholder='Enter how many carpark'
                    value={tour.carpark}
                    onChange={(e) => setTour({ ...tour, carpark: e.target.value })}
                  />
                </>
              ) : ("")
            }


            <input type="text"
              className='form-control mb-3'
              placeholder='Size of land'
              value={tour.landsize}
              onChange={(e) => setTour({ ...tour, landsize: e.target.value })}
            />

            <input type="text"
              className='form-control mb-3'
              placeholder='Enter title'
              value={tour.title}
              onChange={(e) => setTour({ ...tour, title: e.target.value })}
            />

            <textarea
              className='form-control mb-3'
              placeholder='Enter description'
              value={tour.description}
              onChange={(e) => setTour({ ...tour, description: e.target.value })}
            />

            <div className="d-flex justify-content-between">
              <button onClick={handleClick} className={`btn btn-primary mb-5 ${tour.loading ? "disabled" : ""}`}>
                {tour.loading ? "Saving..." : "Update"}
              </button>
              <button onClick={handleDelete} className={`btn btn-danger mb-5 ${tour.loading ? "disabled" : ""}`}>
                {tour.loading ? "Deleting..." : "Delete"}
              </button>
            </div>
            {/* <pre>{JSON.stringify(ad, null, 4)}</pre> */}
          </div>

        </div>
      </div>
    </>
  )
}

