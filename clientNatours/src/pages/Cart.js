// import { useAuth } from '../context/auth';
// import { useCart } from '../context/cart';
// import Jumbotron from '../components/cards/Jumbotron';
// import { useNavigate } from 'react-router-dom';

// import UserCartSidebar from '../components/cards/UserCartSidebar';
// import ProductCardHorizontal from '../components/cards/ProductCardHorizontal';


// export default function Cart() {
//     //context
//     const [cart, setCart] = useCart([]);
//     const [auth, setAuth] = useAuth();
//     //hooks
//     const navigate = useNavigate();

//     return (
//         <>
//             <Jumbotron
//                 title={`Hello ${auth?.token && auth?.user?.name?.toUpperCase()}`}
//                 subTitle={
//                     cart?.length
//                         ? `You have ${cart.length} items in the cart.
//                      ${auth.token ? '' : 'Please login to checkout'}`
//                         : "Your cart is empty"
//                 }
//             />

//             {/* Heading */}
//             <div className="container-fluid">
//                 <div className="row">
//                     <div className="col-md-12">
//                         <div className="p-3 mt-2 mb-2 h4 bg-light text-center">
//                             {/* heading */}
//                             {cart?.length
//                                 ? "My Cart"
//                                 : <div>
//                                     <button className="btn btn-primary"
//                                         onClick={() => navigate('/')}
//                                     >
//                                         Continue Shopping
//                                     </button>
//                                 </div>
//                             }
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* in case of something is in cart */}
//             {
//                 <div className="container-fluid">
//                     <div className="row">
//                         <div className="col-md-8">
//                             <div className="row">
//                                 {
//                                     cart?.map((p, index) => (
//                                         < ProductCardHorizontal key={index} p={p} />
//                                     ))
//                                 }
//                             </div>
//                         </div>

//                         <UserCartSidebar />
//                     </div>
//                 </div>
//             }
//         </>
//     );
// }

/////////////////////////////////////////////////////////////////////////////

import { useAuth } from '../context/auth';
import { useCart } from '../context/cart';
import Jumbotron from '../components/cards/Jumbotron';
import { useNavigate } from 'react-router-dom';

import UserCartSidebar from '../components/cards/UserCartSidebar';
import ProductCardHorizontal from '../components/cards/ProductCardHorizontal';


export default function Cart() {
    //context
    const [cart, setCart] = useCart();
    const [auth, setAuth] = useAuth();
    //hooks
    const navigate = useNavigate();

    return (
        <>
            <Jumbotron
                title={`Hello ${auth?.token && auth?.user?.name?.toUpperCase()}`}
                subTitle={
                    cart?.length
                        ? `You have ${cart.length} items in the cart.
                     ${auth.token ? '' : `Please login to checkout`}`
                        : "Your cart is empty"
                }
            />

            {/* Heading */}
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-12">
                        <div className="p-3 mt-2 mb-2 h4 bg-light text-center">
                            {/* heading */}
                            {cart?.length
                                ? "My Cart"
                                : <div>
                                    <button className="btn btn-primary"
                                        onClick={() => navigate('/')}
                                    >
                                        Continue Shopping
                                    </button>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>

            {/* in case of something is in cart */}
            {
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-8">
                            <div className="row">
                                {
                                    // index is unique
                                    cart?.map((p, index) => (
                                        < ProductCardHorizontal key={index} p={p} />
                                    ))
                                }
                            </div>
                        </div>

                        <UserCartSidebar />
                    </div>
                </div>
            }

            {/* {
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-8">
                            <div className="row">
                                {
                                    cart?.map((c) => (
                                        <div key={c._id}>{c.name}</div>
                                    ))
                                }
                            </div>
                        </div>

                        <div className='col-md-4'>Total / Address/ Payment</div>
                    </div>
                </div>
            } */}
        </>
    );
}