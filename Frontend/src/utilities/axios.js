import axios from "axios";
import { store } from "../Components/Authstore";

const api = axios.create({
  baseURL: "https://spendwise-web.onrender.com/",
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = store.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
