import axios from "axios";

const BASE_URL = import.meta.env.MODE === "development" ? "hhttp://localhost:5001/api" : "/api"
export const axiosInstance = axios.create({
  baseURL: BASE_URL, // Use the base URL for your backend API
  withCredentials: true, // send cookies with the request
});