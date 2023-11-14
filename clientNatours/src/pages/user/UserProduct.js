import { useAuth } from "../../context/auth";
import Jumbotron from "../../components/cards/Jumbotron";
import UserMenu from "../../components/nav/UserMenu";

import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
//import CategoryForm from '../../components/forms/Categoryform';
import { Select } from "antd";
/*import product from '../../../../server/models/product';*/
import { useNavigate } from "react-router-dom";

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
  console.log("blur");
}

function onFocus() {
  console.log("focus");
}

function onSearch(val) {
  console.log("search:", val);
}

export default function UserProduct({ action, type }) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setAd({ ...ad, loading: true });
      //console.log("category in handleSubmit :  ", category);
      const { data } = await axios.post("/tours/ad", {
        ad,
        category  // category id
      });
      // data contains {ad, user, cateogoryId}
      //console.log("ad create response => ", data);
      if (data?.error) {
        toast.error(data.error);
        setAd({ ...ad, loading: false });
      } else {
        // data contains {ad, user, categoryId}
        // update user in context (!seller)
        setAuth({ ...auth, user: data.user });

        // update user in local storage (!seller)
        const fromLS = JSON.parse(localStorage.getItem("auth"));

        fromLS.user = data.user;
        localStorage.setItem("auth", JSON.stringify(fromLS));

        toast.success("Ad created successfully");
        setAd({ ...ad, loading: false });

        //it doesn't reload page
        // navigate("/dashboard/user")

        // reload page on redirect
        window.location.href = "/dashboard/user/mystore";
      }
    } catch (err) {
      console.log(err);
      setAd({ ...ad, loading: false });
    }
  };

  return (
    <>
      <Jumbotron
        title={`Hello ${auth?.user?.name}`}
        subTitle="User Dashboard"
      />

      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>

          <div className="col-md-9">
            <div className="p-3 mt-2 mb-2 h4 bg-light">Manage Products</div>

            <ImageUpload ad={ad} setAd={setAd} />
            <GooglePlacesAutocomplete
              apiKey={GOOGLE_PLACES_KEY}
              apiOptions="kr"
              selectProps={{
                defaultInputValue: ad?.address,
                placeholder: "Search for address..",
                onChange: ({ value }) => {
                  setAd({ ...ad, address: value.description });
                },
              }}
            />

            <Select
              // showSearch
              bordered={false}
              size="large"
              className="form-select mt-5"
              placeholder="Choose category"
              onChange={(value) => setCategory(value)}
            >
              {categories?.map((c) => (
                <Option key={c._id} value={c._id}>
                  {c.name}
                </Option>
              ))}
            </Select>
            <div style={{ marginTop: "50px" }}>
              <CurrencyInput
                // id="input-example"
                // name="input-name"
                placeholder="Please enter a price"
                defaultValue={ad.price}
                className="form-control mb-3"
                // decimalsLimit={2}
                onValueChange={(value) => setAd({ ...ad, price: value })}
              />
            </div>

            <input
              type="number"
              min="0"
              className="form-control mb-3"
              placeholder="how many bedrooms"
              value={ad.bedromms}
              onChange={(e) => setAd({ ...ad, bedrooms: e.target.value })}
            />

            <input
              type="number"
              min="0"
              className="form-control mb-3"
              placeholder="how many bathrooms"
              value={ad.bathrooms}
              onChange={(e) => setAd({ ...ad, bathrooms: e.target.value })}
            />

            <input
              type="number"
              min="0"
              className="form-control mb-3"
              placeholder="Enter how many carpark"
              value={ad.carpark}
              onChange={(e) => setAd({ ...ad, carpark: e.target.value })}
            />

            <input
              type="text"
              className="form-control mb-3"
              placeholder="Size of land"
              value={ad.landsize}
              onChange={(e) => setAd({ ...ad, landsize: e.target.value })}
            />

            <input
              type="text"
              className="form-control mb-3"
              placeholder="Enter name"
              value={ad.name}
              onChange={(e) => setAd({ ...ad, name: e.target.value })}
            />

            <textarea
              className="form-control mb-3"
              placeholder="Enter description"
              value={ad.description}
              onChange={(e) => setAd({ ...ad, description: e.target.value })}
            />

            <input
              type="number"
              min="1"
              className="form-control p-2 mb-3"
              placeholder="Enter ratings average"
              value={ad.ratingsAverage}
              onChange={(e) => setAd({ ...ad, ratingsAverage: e.target.value })}
            />
            <input
              type="number"
              min="1"
              className="form-control p-2 mb-3"
              placeholder="Enter ratings quantity"
              value={ad.ratingsQuantity}
              onChange={(e) =>
                setAd({ ...ad, ratingsQuantity: e.target.value })
              }
            />

            <input
              type="number"
              className="form-control p-2 mb-3"
              placeholder="Enter quantity number"
              value={ad.quantity}
              onChange={(e) => setAd({ ...ad, quantity: e.target.value })}
            />
            <input
              type="number"
              className="form-control p-2 mb-3"
              placeholder="Enter sold number"
              value={ad.sold}
              onChange={(e) => setAd({ ...ad, sold: e.target.value })}
            />

            <button onClick={handleSubmit} className={`btn btn-primary mb-5 ${ad.loading ? "disabled" : ""}`}>
              {ad.loading ? "Saving..." : "Submit"}
            </button>
          </div>
        </div>
      </div>
      <pre>{JSON.stringify(ad, null, 4)}</pre>
    </>
  );
}
