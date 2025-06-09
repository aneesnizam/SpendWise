// utilities/axios.js
import axios from "axios";
import { store } from "../Components/Authstore";

// Set up the instance
const api = axios.create({
  baseURL: "https://spendwise-web.onrender.com",
  withCredentials: true,
  headers: {
    'Cache-Control': 'no-store',
  }
});

// Optional: Load token from localStorage directly for safety
const localToken = JSON.parse(localStorage.getItem("token"));
if (localToken) {
  api.defaults.headers.common["Authorization"] = `Bearer ${localToken}`;
}

// Interceptor: Sync with zustand state
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
