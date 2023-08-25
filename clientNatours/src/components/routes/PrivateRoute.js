// import { useState, useEffect } from 'react';
// import { Outlet } from 'react-router-dom';
// import { useAuth } from '../../context/auth';
// import Loading from './Loading';
// import axios from 'axios';


// export default function PrivateRoute() {
//     // context
//     const [auth, setAuth] = useAuth();

//     // state, set ok true only when someone logged in 
//     const [ok, setOk] = useState(false);

//     // using token from the client side and
//     // make a request to the server and wait for response

//     const authCheck = async () => {
//         const { data } = await axios.get(`/users/auth-check`, {
//             headers: {
//                 Authorization: auth?.token,
//             },
//         });
//         // console.log('data;',data);
//         if (data?.ok) {
//             setOk(true);
//         } else {
//             setOk(false);
//         }
//     };
    
//     useEffect(() => {
          
//         if (auth?.token) authCheck();
//     }, [auth?.token]);
 
//     return ok ? <Outlet /> : <Loading />;

//     // useEffect(() => {
          
//     //     if (auth?.token) {
//     //         setOk(true);
//     //     } else {
//     //         setOk(false);
//     //     };
//     // }, [auth?.token]);
 
//     // return ok ? <Outlet /> : "Loading...";
// };



import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../context/auth';
import Loading from './Loading';
import axios from 'axios';


export default function PrivateRoute() {
    // context
    const [auth, setAuth] = useAuth();

    // state, set ok true only when someone logged in 
    const [ok, setOk] = useState(false);

    // using token from the client side and
    // make a request to the server and wait for response

    // const authCheck = async () => {
    //     const { data } = await axios.get(`/users/auth-check`, {
    //         headers: {
    //             Authorization: auth?.token,
    //         },
    //     });
    //     //console.log('data;',data);
    //     if (data?.ok) {
    //         setOk(true);
    //     } else {
    //         setOk(false);
    //     }
    // };
    
    const authCheck = async () => {
        const { data } = await axios.get(`/users/auth-check`);
        //console.log('data;',data);
        if (data?.ok) {
            setOk(true);
        } else {
            setOk(false);
        }
    };
    
    useEffect(() => {
          
        if (auth?.token) authCheck();
    }, [auth?.token]);
 
    return ok ? <Outlet /> : <Loading />;

    // useEffect(() => {
          
    //     if (auth?.token) {
    //         setOk(true);
    //     } else {
    //         setOk(false);
    //     };
    // }, [auth?.token]);
 
    // return ok ? <Outlet /> : "Loading...";
};


