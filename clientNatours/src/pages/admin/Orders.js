import { useAuth } from '../../context/auth';
import Jumbotron from '../../components/cards/Jumbotron';
import AdminMenu from '../../components/nav/AdminMenu';
import { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import ProductCardHorizontal from '../../components/cards/ProductCardHorizontal';
import { Select, Space } from 'antd';
const { Option } = Select;

export default function AdminOrders() {
  // context
  const [auth, setAuth] = useAuth();

  //state
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState([
    "Not processed",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ]);
  const [changedStatus, setChangedStatus] = useState("");

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  const getOrders = async () => {
    try {
      const { data } = await axios.get("/all-orders");
      setOrders(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = async (orderId, value: string[]) => {
    // console.log(`selected ${value}`);
    // console.log('orderId ; ', orderId);
    setChangedStatus(value);
    try {
      const { data } = await axios.put(`/order-status/${orderId}`, {
        status: value,
      });
      getOrders();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Jumbotron title={`Hello ${auth?.user?.name}`}
        subTitle="User Dashboard"
      />

      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <div className="p-3 mt-2 mb-2 h4 bg-light"> Orders</div>
            {/* <pre>{JSON.stringify( orders , null, 4)}</pre>*/}
            {orders?.map((o, index) => {
              return (
                <div
                  key={o._id}
                  className="border shadow bg-light rounded-4 mb-5"
                >
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Status</th>
                        <th scope="col">Buyer</th>
                        <th scope="col">Ordered</th>
                        <th scope="col">Payment</th>
                        <th scope="col">Quantity</th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr>
                        <td>{index + 1}</td>
                        <td>
                          <Select

                            style={{ width: '100%' }}
                            placeholder="select one"
                            defaultValue={o?.status}
                            onChange={(value) => handleChange(o._id, value)}
                            optionLabelProp="label"
                          >
                            {
                              status.map((s, i) => (

                                <Option key={i} value={s} label={s}>
                                  <Space>
                                    {s}
                                  </Space>
                                </Option>

                              ))
                            }
                          </Select>
                        </td>
                        {/* <td>{o?.status}</td> */}
                        <td>{o?.buyer?.name}</td>
                        <td>{moment(o?.createdAt).fromNow()}</td>
                        <td>{o?.payment?.success ? "Success" : "Failed"}</td>
                        <td>{o?.products?.length} products</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="container">
                    <div className="row m-2">
                      {
                        o?.products?.map((p, index) => (
                          < ProductCardHorizontal key={index} p={p} remove={false} />
                        ))
                      }
                    </div>
                  </div>
                </div>

              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}