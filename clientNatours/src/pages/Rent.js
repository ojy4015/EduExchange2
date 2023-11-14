////////////////////////////////////////////////////////////////////////
import { useEffect, useState } from "react";
import Jumbotron from "../components/cards/Jumbotron";
import ProductCard from "../components/cards/ProductCard";
import axios from "axios";
import type { PaginationProps } from "antd";
import { Pagination } from "antd";
import SearchNewForm from '../components/forms/SearchNewForm';

export default function Rent() {

  // for realist
  const [ads, setAds] = useState();

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const { data } = await axios.get("/tours/ads-for-rent");

      // { data } : { ads }
      setAds(data);
      // setAdsForRent(data.adsForRent);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <SearchNewForm />
      <h1 className="display-1 bg-primary text-light p-5">For Rent</h1>
      <div className="container">
        <div className="row">
          {ads?.map((ad) => (
            <ProductCard p={ad} key={ad._id} />
          ))}
        </div>
      </div>
    </div>
  );
}

////////////////////////////////////////////////////////////////////////////
{/* <pre>{JSON.stringify(auth, null, 4)}</pre>
<pre>{JSON.stringify({ adsForSell }, null, 4)}</pre> */}