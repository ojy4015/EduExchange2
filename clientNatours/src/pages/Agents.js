import { useEffect, useState } from "react";
import axios from "axios";
import UserCard from "../components/cards/UserCard";

// show all agents
export default function Agents() {

  // state
  const [agents, setAgents] = useState([{}]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgents();
  }, []);

  // when first come to this page loading is true but after fetchAgents set loading false
  const fetchAgents = async () => {
    try {
      const { data } = await axios.get("/users/agents");
      //console.log("data => ", data);
      setAgents(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100" style={{ marginTop: "-10%" }}>
        <div className="display-1">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="display-1 bg-primary text-light p-5">show all agents</h1>
      <div className="container">
        <div className="row">
          {agents?.map((agent) => (
            <UserCard user={agent} key={agent._id} />
          ))}
        </div>
      </div>

      {/* <pre>{JSON.stringify(agents, null, 4)}</pre> */}

    </div>
  );
}
