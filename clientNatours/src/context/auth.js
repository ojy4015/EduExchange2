// the state can be accessed globally
import { useState, createContext, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    token: "",
  });

  // axios config globally
  // REACT_APP_API=http://localhost:8000/api/v1
  axios.defaults.baseURL = process.env.REACT_APP_API;
  axios.defaults.headers.common["Authorization"] = auth?.token;
  // axios.defaults.headers.common["refresh_token"] = auth?.refreshToken;

  /////////// axios interceptors code /////////////////////////////
  /////////////////////////////////////////////////////////////////////////

  // when application mounts
  useEffect(() => {
    const fromLS = localStorage.getItem("auth");
    if (fromLS) {
      const parsed = JSON.parse(fromLS);
      // setAuth({ ...auth, user: parsed.user, token: parsed.token, refreshToken: parsed.refreshToken });
      setAuth({ ...auth, user: parsed.user, token: parsed.token});
    }
  }, []);

  return (

    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );
};

// our own hook
const useAuth = () => useContext(AuthContext);

// const [auth, setAuth] = useAuth();

export { AuthProvider, useAuth };
