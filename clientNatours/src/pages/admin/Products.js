import { useAuth } from '../../context/auth';
import Jumbotron from '../../components/cards/Jumbotron';
import AdminMenu from '../../components/nav/AdminMenu';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import moment from 'moment';

export default function Products() {
    // context
    const [auth, setAuth] = useAuth();
    // state
    const [products, setProducts] = useState([]);

    useEffect(() => {
        loadProducts();
    }, [])

    const loadProducts = async () => {
        try {
            const { data } = await axios.get("/tours");
            setProducts(data);
            //console.log('data in loadProducts: ' + products);
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <>
            <Jumbotron title={`Hello ${auth?.user?.name}`}
                subTitle="Admin Dashboard"
            />

            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-3">
                        <AdminMenu />
                    </div>
                    <div className="col-md-9">
                        <div className="p-3 mt-2 mb-2 h4 bg-light">Tours</div>

                        {products?.map((p) =>
                            <Link key={p._id} to={`/dashboard/admin/product/update/${p.slug}`}>
                                <div className="card mb-3">
                                    <div className="row g-0">
                                        <div className="col-md-4">
                                            <img src={`${process.env.REACT_APP_API}/tours/photo/${p._id}`} alt={p.name}
                                                className='img img-fluid rounded-start'
                                            />
                                        </div>
                                        <div className="col-md-8">
                                            <div className="card-body">
                                                <h5 className="card-title">{p.name}</h5>
                                                <p className="card-text">
                                                    {
                                                        (p?.description?.length > 160)
                                                            ? `${p?.description?.substring(0, 160)}...`
                                                            : `${p?.description?.substring(0, 160)}`
                                                    }
                                                </p>
                                                <p className="card-text">
                                                    <small className="text-muted">
                                                        {moment(p.created_at).format("DD MM YYYY hh:mm:ss")}
                                                    </small>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
} 