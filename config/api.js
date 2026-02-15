import axios from "axios";

// Connects to your Express server. Use env variable for production.
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

export default axiosInstance;
