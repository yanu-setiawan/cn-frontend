import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL: string = import.meta.env.VITE_HTTP_API;

const instance = axios.create({
  baseURL: BASE_URL,
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message ?? "Terjadi kesalahan, coba lagi";
    toast.error(message);
    return Promise.reject(error);
  },
);

export default instance;
