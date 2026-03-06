import axios from "axios";

const API = axios.create({
  baseURL: "https://chotobela5-api.onrender.com",
});

export default API;