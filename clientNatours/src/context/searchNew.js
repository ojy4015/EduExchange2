// the state can be accessed globally
import { useState, createContext, useContext } from 'react';

const SearchNewContext = createContext();

const innitialState = {
  price: "",
  address: "",
  priceRange: [0, 1000000],
  loading: false,
  type: "House",
  action: "Buy",
  results: [],
  page: "",
}

const SearchNewProvider = ({ children }) => {
  // upon log in we have these state, default values
  const [searchNew, setSearchNew] = useState(innitialState);

  return (

    <SearchNewContext.Provider value={[searchNew, setSearchNew, innitialState]}>
      {children}
    </SearchNewContext.Provider>
  );
};

// our own hook
const useSearchNew = () => useContext(SearchNewContext);

// const [search, setSearch, innitialState] = useSearchNew();

export { SearchNewProvider, useSearchNew };