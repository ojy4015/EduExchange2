////////////////////////////////////////////////////////////////
import { useEffect, useState } from "react";
import { Badge, Card, Space } from "antd";
import { useNavigate, Link } from "react-router-dom";
import moment from "moment";
import toast from "react-hot-toast";
import Logo from '../../logo.svg'; // default image
import axios from 'axios';

export default function UserCard({ user }) {

  const [count, setCount] = useState(0);

  useEffect(() => {
    if (user?._id) fetchAdCount();
  }, [user._id])

  const fetchAdCount = async () => {
    try {
      const { data } = await axios.get(`/users/agent-ad-count/${user._id}`);
      setCount(data.length);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="col-lg-12 p-4 gx-4 gy-4">
      <Link to={`/agent/${user.username}`}>
        <Badge.Ribbon text={`${count} listings`} placement="start" color="red">
          <img
            src={user?.photo?.Location ?? Logo} // Logo: default image
            alt={`${user.namename}`}
            style={{ height: "200px", objectFit: "cover" }}
          />
        </Badge.Ribbon>
      </Link>
      <div className="card-body">
        <div className="card hoverable shadow"></div>
        <h5>{user?.username ?? user?.name}</h5>

        <p className="text-muted">
          Joined At: {moment(user.createdAt).format("YYYY MM DD HH:mm")}
        </p>
      </div>
    </div>
  );
}

////////////////////////////////////////////////////////////////////////////
