// // the state can be accessed globally
// import { useState, createContext, useContext, useEffect } from 'react';
// import axios from 'axios';

// const AuthContext = createContext();

// const AuthProvider = ({children}) => {
//   const [auth, setAuth] = useState({
//     user: null,
//     token: "",
//   });

//   // axios config globally
//   // REACT_APP_API=http://localhost:8000/api
//   axios.defaults.baseURL = process.env.REACT_APP_API;
//   // axios.defaults.headers.common["Authorization"] = auth?.token;

//   // when application mounts
//   useEffect(() => {
//     const data = localStorage.getItem("auth");
//     if (data) {
//       const parsed = JSON.parse(data);
//       setAuth({ ...auth, user: parsed.data.user, token: parsed.token });
//     }
//   }, []);
  
//   return (
    
//     <AuthContext.Provider value={[auth, setAuth]}>
//       {/* console.log("auth: ",auth) */}
//       {children}
//     </AuthContext.Provider>  
//   );
// };

// const useAuth = () => useContext(AuthContext);

// // const [auth, setAuth] = useAuth();

// export { AuthProvider, useAuth };



// the state can be accessed globally
import { useState, createContext, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ({children}) => {
  const [auth, setAuth] = useState({
    user: null,
    token: "",
  });

  // axios config globally
  // REACT_APP_API=http://localhost:8000/api/v1
  axios.defaults.baseURL = process.env.REACT_APP_API;
  axios.defaults.headers.common["Authorization"] = auth?.token;

  // when application mounts
  useEffect(() => {
    const data = localStorage.getItem("auth");
    if (data) {
      const parsed = JSON.parse(data);
      setAuth({ ...auth, user: parsed.user, token: parsed.token });
    }
  }, []);
  
  return (
    
    <AuthContext.Provider value={[auth, setAuth]}>
      {/* console.log("auth: ",auth) */}
      {children}
    </AuthContext.Provider>  
  );
};

// our own hook
const useAuth = () => useContext(AuthContext);

// const [auth, setAuth] = useAuth();

export { AuthProvider, useAuth };
