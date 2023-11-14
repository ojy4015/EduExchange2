
import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import axios from "axios";
import UserCard from "../components/cards/UserCard";
import ProductCard from "../components/cards/ProductCard";

// one agent's profile(user and tours)
export default function Agent() {
  // hook
  const params = useParams();
  //console.log(params.username);

  // state
  const [agent, setAgent] = useState(null);
  const [tours, setTours] = useState([{}]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params?.username) fetchAgent();
  }, [params?.username]);

  // when first come to this page loading is true but after fetchAgents set loading false
  const fetchAgent = async () => {
    try {
      const { data } = await axios.get(`/users/agent/${params?.username}`);
      // return { user, tours }
      setAgent(data.user);
      setTours(data.tours);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  // Loading spinner or loading text
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100" style={{ marginTop: "-10%" }}>
        <div className="display-1">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="display-1 bg-primary text-light p-5">agent {agent?.name ?? agent?.username} profile</h1>
      <div className="container">
        <div className="row">
          {/* <div className="col-lg-4"></div> */}
          {<UserCard user={agent} />}
          {/* <div className="col-lg-4"></div> */}
        </div>
      </div>

      <h2 className="text-center m-5">Recent Listings</h2>
      <div className="container">
        <div className="row">
          {tours?.map((tour) => (
            <ProductCard p={tour} key={tour._id} />
          ))}
        </div>
      </div>

      {/* <pre>{JSON.stringify(agent, null, 4)}</pre>
      <pre>{JSON.stringify(tours, null, 4)}</pre> */}

    </div>
  );
}
