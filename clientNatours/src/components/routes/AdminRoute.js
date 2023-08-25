// import { useState, useEffect } from 'react';
// import { Outlet } from 'react-router-dom';
// import { useAuth } from '../../context/auth';
// import Loading from './Loading';
// import axios from 'axios';


// export default function AdminRoute() {
//     // context
//     const [auth, setAuth] = useAuth();

//     // state, set ok true only when someone logged in 
//     const [ok, setOk] = useState(false);

//     // using token from the client side and
//     // make a request to the server and wait for response

//     const adminCheck = async () => {
//         const { data } = await axios.get(`/admin-check`);
//         // console.log('data;',data);
//         if (data.ok) {
//             setOk(true);
//         } else {
//             setOk(false);
//         }
//     };
    
//     useEffect(() => {
          
//         if (auth?.token) adminCheck();
//     }, [auth?.token]);
    
//   // path="" : homepage로 이동
//     return ok ? <Outlet /> : <Loading path="" />;
// };





import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../context/auth';
import Loading from './Loading';
import axios from 'axios';


export default function AdminRoute() {
    // context
    const [auth, setAuth] = useAuth();

    // state, set ok true only when someone logged in 
    const [ok, setOk] = useState(false);

    // using token from the client side and
    // make a request to the server and wait for response

    const adminCheck = async () => {
        const { data } = await axios.get(`/users/admin-check`);
        // console.log('data;',data);
        if (data.ok) {
            setOk(true);
        } else {
            setOk(false);
        }
    };
    
    useEffect(() => {
          
        if (auth?.token) adminCheck();
    }, [auth?.token]);
    
  // path="" : homepage로 이동
    return ok ? <Outlet /> : <Loading path="" />;
};
