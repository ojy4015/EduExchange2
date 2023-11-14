import SearchNewForm from '../components/forms/SearchNewForm';
import {useSearchNew} from "../context/searchNew";
import ProductCard from '../components/cards/ProductCard';

export default function SearchNew() {

  //hooks
  const [searchNew, setSearchNew] = useSearchNew();

  return (
    <div>
      <h1 className="display-1 bg-primary text-light p-5">SearchNew</h1>
      <SearchNewForm />

      <div className="container">
        <div className="row">
          {searchNew.results?.length > 0 ? (
          <div className="col-md-12 text-center p-5">
            Found {searchNew.results?.length} results
          </div>
            ) : (
            <div className="col-md-12 text-center p=5">No properties found</div>
            )}
        </div>


        <div className="row">
          {searchNew.results?.map((item) => (<ProductCard p={item} key={item._id} />))}
        </div>
      </div> 

    </div>
  );
}