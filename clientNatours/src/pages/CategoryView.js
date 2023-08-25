import { useState, useEffect } from 'react';
import Jumbotron from '../components/cards/Jumbotron';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import ProductCard from '../components/cards/ProductCard';

export default function CategoryView() {
  // state
  const [products, setProducts] = useState([]); // products belong to the one category
  const [category, setCategory] = useState({});

  // hooks
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    if (params?.slug) loadProductByCategory();
  }, [params?.slug]);

  const loadProductByCategory = async () => {
    try {
      const { data } = await axios.get(`/categorys/tours-by-category/${params.slug}`);

      console.log("data in CategoryView : ", data);
      setCategory(data.category);
      setProducts(data.tours);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <Jumbotron title={category.name} subTitle={`${products?.length} tours founded in "${category?.name}"`} />
      <div className="container-fluid">
        <div className="row mt-3">
          {products.map((p) => (
            <div key={p._id} className="col-md-4">
              <ProductCard p={p} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}