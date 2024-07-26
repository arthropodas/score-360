import axios from "axios";
import { jwtDecode } from "jwt-decode";
const apiEndpoint = process.env.REACT_APP_API_ENDPOINT;
const isAccessTokenExpired = (accessToken) => {
  try {
    const decodedToken = jwtDecode(accessToken);
    const currentDate = new Date();

    return decodedToken.exp * 1000 < currentDate.getTime();
  } catch (error) {
    console.error("Error decoding access token:", error);
    return true;
  }
};

const axiosInstance = axios.create({
  baseURL: apiEndpoint,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    
    const authTokens = JSON.parse(localStorage.getItem("authTokens"));
    const token = authTokens?.accessToken;
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401) {
      const token = JSON.parse(localStorage.getItem("authTokens"));
     
      if (isAccessTokenExpired(token.accessToken) === true) {
        originalRequest._retry = true;
        const accessToken = await refreshAccessToken();
        axiosInstance.defaults.headers.common["Authorization"] =
          "Bearer " + accessToken;
        return axiosPrivate(originalRequest);
      } else {
        localStorage.clear();
        window.location.replace("/login");
      }
    }
    return Promise.reject(error);
  }
);

const refreshAccessToken = async () => {
  const authTokens = JSON.parse(localStorage.getItem("authTokens"));
  const refreshToken = authTokens.refreshToken;
  const userId = authTokens.userId;
  const user_type = authTokens.user_type;
  const data = { refresh: refreshToken };
  try {
    const response = await axios.post(
      `${apiEndpoint}/player/login/refresh`,
      data
    );
    const accessToken = response.data.access;
    let authTokens = JSON.stringify({
      accessToken: accessToken,
      refreshToken: refreshToken,
      userId: userId,
      user_type: user_type,
    });
    localStorage.setItem("authTokens", authTokens);
    return accessToken;
  } catch (err) {
    localStorage.clear();

    setTimeout(() => {
      window.location.replace("/login");
    }, 1000);
  }
};
const axiosPrivate = axiosInstance;
export { axiosPrivate };
