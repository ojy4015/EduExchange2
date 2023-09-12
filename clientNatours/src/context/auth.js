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
  // axios.interceptors.response.use(
  //   (res) => {
  //     return res;
  //   },
  //   async (err) => {
  //     const originalConfig = err.config;

  //     if (err.response) {
  //       // token is expired
  //       if (err.response.status === 401 && !originalConfig._retry) {
  //         originalConfig._retry = true;

  //         // when token expired we try to get refresh-token
  //         try {
  //           const { data } = await axios.get("/users/refresh-token");
  //           axios.defaults.headers.common["token"] = data.token;
  //           axios.defaults.headers.common["refresh_token"] = data.refreshToken;

  //           setAuth(data);
  //           localStorage.setItem("auth", JSON.stringify(data));

  //           return axios(originalConfig);
  //         } catch (_error) {
  //           if (_error.response && _error.response.data) {
  //             return Promise.reject(_error.response.data);
  //           }

  //           return Promise.reject(_error);
  //         }
  //       }

  //       if (err.response.status === 403 && err.response.data) {
  //         return Promise.reject(err.response.data);
  //       }
  //     }

  //     return Promise.reject(err);
  //   }
  // );
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
