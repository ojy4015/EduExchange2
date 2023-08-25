// import { useSearch } from '../context/search';
// import ProductCard from '../components/cards/ProductCard';
// import Jumbotron from '../components/cards/Jumbotron';



// export default function Search() {
//     // context
//     const [values, setValues] = useSearch();

//     return (
//         <>
//             <Jumbotron
//                 title="Search Results"
//                 subTitle={
//                     values?.results?.length < 1
//                         ? "No proucts found"
//                         : `Found ${values?.results?.length} products for "${values?.keyword}"`
//                 }
//             />
//             <div className="container-fluid mt-3">
//                 <div className="row">
//                     {values?.results?.map(
//                         (p) => (
//                             <div key={p._id} className="col-md-4">
//                                 <ProductCard product={p} />
//                             </div>
//                         )
//                     )}
//                 </div>
//             </div>
//         </>
//     );
// }

////////////////////////////////////////////////////////////////////////////////////////

import { useSearch } from '../context/search';
import ProductCard from '../components/cards/ProductCard';
import Jumbotron from '../components/cards/Jumbotron';

export default function Search() {
    // context
    const [values, setValues] = useSearch();

    return (
        <>
            <Jumbotron
                title="Search Results"
                subTitle={
                    values?.results?.length < 1
                        ? "No tours found"
                        : `Found ${values?.results?.length} tours for "${values?.keyword}"`
                }
            />
            <div className="container-fluid mt-3">
                <div className="row">
                    {values?.results?.map(
                        (p) => (
                            <div key={p._id} className="col-md-4">
                                <ProductCard p={p} />
                            </div>
                        )
                    )}
                </div>
            </div>
        </>

    );
}