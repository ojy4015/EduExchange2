import { useEffect, useState } from 'react';
import { useAuth } from '../../context/auth';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/cart';
import axios from 'axios';
import DropIn from "braintree-web-drop-in-react";
import toast from 'react-hot-toast';
import LoadingGIF from "../../images/loading.gif";


export default function UserCartSidebar() {

    //context
    const [cart, setCart] = useCart();
    const [auth, setAuth] = useAuth();
    // state
    const [clientToken, setClientToken] = useState('');
    const [instance, setInstance] = useState('');
    const [loading, setLoading] = useState(false);

    //hooks
    const navigate = useNavigate();

    const cartTotal = () => {
        let total = 0;
        cart.map((item) => {
            total += item.price;
        });
        return total?.toLocaleString("ko", {
            style: "currency",
            currency: "KRW",
        });
    };

    useEffect(() => {
        if (auth?.token) {
            getClientToken();
        }
    }, [auth?.token]);

    const getClientToken = async () => {
        try {
            const { data } = await axios("/tours/braintree/token");
            //console.log("data=> ", data);
            setClientToken(data.clientToken);
        } catch (err) {
            console.log(err);
        }
    };

    const handleBuy = async () => {
        try {
            if (!auth?.user?.address) {
                navigate("/dashboard/user/profile");
                toast.error("Add deliver address to order");
                return
            }
            setLoading(true);
            const { nonce } = await instance.requestPaymentMethod();
            //console.log("nonce=> ", nonce);
            const { data } = await axios.post("/tours/braintree/payment", {
                nonce, cart
            });
            // console.log('handle by response => ', data);
            setLoading(false);
            // clear localStorage, Cart
            localStorage.removeItem("cart");
            setCart([]);
            navigate("/dashboard/user/orders");
            toast.success("Payment successful");
        } catch (err) {
            console.log(err);
            setLoading(false);
        }
    };

    return (
        <div className="col-md-4 mb-5">
            <h4>Your Cart Summary</h4>
            현재 해외 거래만 가능하고 국내 거래는 불가능합니다!
            <hr />
            <h6>Total : {cartTotal()}</h6>

            {auth?.user?.address ? (
                <>
                    <div className="mb-3">
                        <hr />
                        <h4>Delivery address : </h4>
                        <h5>{auth?.user?.address}</h5>
                    </div>
                    <button
                        className="btn btn-outline-warning"
                        onClick={() => navigate("/dashboard/user/profile", {
                            state: "/cart"
                        })}
                    >
                        Update address
                    </button>
                </>
            ) : (
                <div className='mb-3'>
                    {/*either user logged in*/}
                    {auth?.token ? (
                        <button
                            className="btn btn-outline-warning mt-3"
                            onClick={() => navigate("/dashboard/user/profile", {
                                state: "/cart"
                            })}
                        >
                            Add delivry address
                        </button>
                    ) : (
                        //or user not logged in
                        <button
                            className="btn btn-outline-danger mt-3"
                            onClick={() => navigate("/login", {
                                state: "/cart"
                            })}
                        >
                            Login to checkout
                        </button>
                    )}
                </div>)}
            <div className='mt-3'>
                {!clientToken || !cart?.length ? (
                    ""
                ) : (
                    <>
                        <DropIn
                            options={{
                                authorization: clientToken,
                                paypal: {
                                    flow: "vault",
                                },
                            }}
                            onInstance={(instance) => setInstance(instance)}

                        />
                        {/* <button
                                onClick={handleBuy}
                                className="btn btn-primary col-12 mt-2"
                                disabled={!auth?.user?.address || !instance || loading}
                            >
                                {loading ? "Processing" : "Buy"}

                            </button> */}
                        <button
                            onClick={handleBuy}
                            className="btn btn-primary col-12 mt-2"
                            disabled={!auth?.user?.address || !instance || loading}
                        >
                            {loading ? "Processing..." : "Buy"}

                        </button>
                    </>

                )}

            </div>
        </div>
    );
};