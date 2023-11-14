
import { useSearchNew } from "../../context/searchNew";
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { GOOGLE_PLACES_KEY } from "../../config";
import { sellPrices, rentPrices } from "../../helpers/priceList";
import queryString from 'query-string';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function SearchNewForm({ action, type }) {
  // context
  const [searchNew, setSearchNew] = useSearchNew();

  // hooks
  const navigate = useNavigate();

  const handleSearch = async () => {
    setSearchNew({ ...searchNew, loading: true });
    try {
      // we have only rest taking out results, loading, page, price from search
      const { results, loading, page, price, ...rest } = searchNew;
      // console.log(search);

      const query = queryString.stringify(rest);
      console.log(query);

      const { data } = await axios.get(`/tours/searchNew?${query}`);

      if (searchNew?.page !== '/searchnew') {
        // console.log("prev => ", prev);
        setSearchNew((prev) => ({ ...prev, results: data, loading: false }));
        navigate("/searchnew");
      } else {
        setSearchNew((prev) => ({ ...prev, results: data, page: window.location.pathname, loading: false }));
      }

    } catch (err) {
      console.log(err);
      setSearchNew({ ...searchNew, loading: false });

    }
  }


  return (
    <>
      <div className="container mt-5 mb-5">
        <div className="row">
          <div className="col-lg-12 form-control">

            < GooglePlacesAutocomplete
              apiKey={GOOGLE_PLACES_KEY}
              apiOptions="kr"
              selectProps={{
                defaultInputValue: searchNew?.address,
                placeholder: "Search for address..",
                onChange: ({ value }) => {
                  setSearchNew({ ...searchNew, address: value.description });
                },
              }}
            />
          </div>
        </div>
        <div className="d-flex justify-content-center mt-3">
          <button onClick={() => setSearchNew({ ...searchNew, action: "Buy", price: "", priceRange: [] })}
            className="btn btn-primary col-lg-2" square
          >
            {searchNew.action === 'Buy' ? '☑ Buy' : "Buy"}
          </button>
          <button onClick={() => setSearchNew({ ...searchNew, action: "Rent", price: "", priceRange: [] })}
            className="btn btn-primary col-lg-2" square
          >
            {searchNew.action === 'Rent' ? '☑ Rent' : "Rent"}
          </button>
          <button onClick={() => setSearchNew({ ...searchNew, type: "House", price: "", priceRange: [] })}
            className="btn btn-primary col-lg-2" square
          >
            {searchNew.type === 'House' ? '☑ House' : "House"}
          </button>
          <button onClick={() => setSearchNew({ ...searchNew, type: "Land", price: "", priceRange: [] })}
            className="btn btn-primary col-lg-2" square
          >
            {searchNew.type === 'Land' ? '☑ Land' : "Land"}
          </button>

          <div className="dropdown">
            <button
              className="btn btn-primary dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              &nbsp; {searchNew?.price ? searchNew.price : "Price"}
            </button>
            <ul className="dropdown-menu">
              {searchNew.action === "Buy" ? (
                <>
                  {sellPrices?.map((p) => (
                    <li key={p._id}>
                      <a
                        className="dropdown-item"
                        onClick={() =>
                          setSearchNew({
                            ...searchNew,
                            price: p.name,
                            priceRange: p.array,
                          })
                        }
                      >
                        {p.name}
                      </a>
                    </li>
                  ))}
                </>
              ) : (
                <>
                  {rentPrices?.map((p) => (
                    <li key={p._id}>
                      <a
                        className="dropdown-item"
                        onClick={() =>
                          setSearchNew({
                            ...searchNew,
                            price: p.name,
                            priceRange: p.array,
                          })
                        }
                      >
                        {p.name}
                      </a>
                    </li>
                  ))}
                </>
              )}
            </ul>
          </div>

          <button onClick={handleSearch} className="btn btn-danger col-lg-2" square>Search</button>
        </div>
        {/* <pre>{JSON.stringify(searchNew, null, 4)}</pre> */}
      </div>
    </>
  )
}

