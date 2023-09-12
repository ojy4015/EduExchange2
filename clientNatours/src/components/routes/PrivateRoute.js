
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
    
    useEffect(() => {     
        if (auth?.token) getCurrentUser();
    }, [auth?.token]);

    const getCurrentUser = async () => {
        const { data } = await axios.get(`/users/current-user`);
        //console.log('data;',data);
        if (data) {
            setOk(true);
        } else {
            setOk(false);
        }
    };
    return ok ? <Outlet /> : <Loading />;
};


