import { useState, createContext, useContext } from 'react';

const SearchContext = createContext();

const SearchProvider = ({ children }) => {
    const [values, setValues] = useState({
        keyword: "",
        results: [],
    });

    return (
        <SearchContext.Provider value={[values, setValues]}>
            {children}
        </SearchContext.Provider>
    );
};

const useSearch = () => useContext(SearchContext);
// const [values, setValues] = useSearch();

export { SearchProvider, useSearch };
