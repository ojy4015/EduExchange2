////////////////////////////////////////////////////////////////////////
import { useAuth } from "../context/auth";
import { useEffect, useState } from "react";
import Jumbotron from "../components/cards/Jumbotron";
import ProductCard from "../components/cards/ProductCard";
import axios from "axios";
import type { PaginationProps } from "antd";
import { Pagination } from "antd";
import SearchNewForm from '../components/forms/SearchNewForm';

export default function Home() {
  // context
  const [auth, setAuth] = useAuth();

  // state

  // for realist
  const [adsForSell, setAdsForSell] = useState();
  const [adsForRent, setAdsForRent] = useState();

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const { data } = await axios.get("/tours/ads");
      setAdsForSell(data.adsForSell);
      // setAdsForRent(data.adsForRent);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <SearchNewForm />
      <h1 className="display-1 bg-primary text-light p-5">For Sell</h1>
      <div className="container">
        <div className="row">
          {adsForSell?.map((ad) => (
            <ProductCard p={ad} key={ad._id} />
          ))}
        </div>
      <>
      <pre>{JSON.stringify(auth, null, 4)}</pre>
      <pre>{JSON.stringify({ adsForSell }, null, 4)}</pre> 
      </>
      </div>
    </div>
  );
}

////////////////////////////////////////////////////////////////////////////
 