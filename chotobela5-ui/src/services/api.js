import axios from "axios";

const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

const API = axios.create({
  baseURL: isLocal ? "http://127.0.0.1:8000/api" : "https://chotobela5-api.onrender.com",
});

export default API;
