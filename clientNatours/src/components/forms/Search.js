
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useSearch } from '../../context/search';
import { useNavigate } from 'react-router-dom';


export default function Search() {
    // const [keyword, setKeyword] = useState("");
    // const [results, setResults] = useState([]); // from the server

    //hooks
    const [values, setValues] = useSearch();
    const navigate = useNavigate();

    // send data to the context so that it can be accessed everywhere(replace local state with context in React )
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            //console.log('keyword : ', keyword);
            const { data } = await axios.get(`/tours/search/${values?.keyword}`);
            console.log(data);

            setValues({
                ...values, results: data,
            });

            navigate("/search");

        } catch (err) {
            console.log(err);
        }
    }

    return (
        <form className="d-flex" onSubmit={handleSubmit}>
            <input type="search"
                style={{ borderRadius: "0px" }}
                className="form-control"
                placeholder="Search"
                onChange={(e) => setValues({ ...values, keyword: e.target.value })}
                value={values.keyword}
            />
            <button
                className="btn btn-outline-primary" type="submit" style={{ borderRadius: "0px" }}
            >
                Search
            </button>
        </form>

    );
}
