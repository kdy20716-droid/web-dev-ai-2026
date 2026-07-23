import axios from "axios";
import router from "../router.jsx";

const instance = axios.create({
  baseURL: "http://localhost:4000",
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("name");
      localStorage.removeItem("id");
      router.navigate("/login");
    }
    return Promise.reject(error);
  },
);

export default instance;
