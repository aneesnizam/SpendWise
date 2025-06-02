import axios from "axios";

const api = axios.create({
  baseURL: "https://spendwise-web.onrender.com/",
  withCredentials: true,
});

export default api;
